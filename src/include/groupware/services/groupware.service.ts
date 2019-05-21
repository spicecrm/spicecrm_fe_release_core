/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

@Injectable()
export abstract class GroupwareService {

    public emailId: string = "";
    public _messageId: string = "";

    public archiveto: any[] = [];
    public archiveattachments: any[] = [];

    public relatedBeans: any[] = [];

    public outlookAttachments = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };

    constructor(
        protected backend: backend,
    ) {}

    public addBean(bean) {
        this.archiveto.push(bean);
    }

    public removeBean(bean) {
        let foundindex = this.archiveto.findIndex(element => bean.id == element.id);
        this.archiveto.splice(foundindex, 1);
    }

    public checkBeanArchive(bean) {
        return this.archiveto.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    public addAttachment(attachment) {
        this.archiveattachments.push(attachment);
    }

    public removeAttachment(attachment) {
        let foundindex = this.archiveattachments.findIndex(element => attachment.id == element.id);
        this.archiveattachments.splice(foundindex, 1);
    }

    public checkAttachmentArchive(attachment) {
        return this.archiveattachments.findIndex(element => attachment.id == element.id) >= 0 ? true : false;
    }

    public getAttachment(id) {
        return this.outlookAttachments.attachments.filter(element => id == element.id);
    }

    public checkRelatedBeans(bean) {
        return this.relatedBeans.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    public archiveEmail(): Observable<any> {
        let retSubject = new Subject();

        this.assembleEmail().subscribe(
            (email: any) => {
                let data = {
                    beans: this.archiveto,
                    email: email,
                };

                this.backend.postRequest('module/Emails/groupware/saveemailwithbeans', {}, data).subscribe(
                    (res) => {
                        if (this.archiveattachments.length > 0) {
                            let attachmentData = {
                                attachmentToken: this.outlookAttachments.attachmentToken,
                                ewsUrl: this.outlookAttachments.ewsUrl,
                                outlookAttachments: this.archiveattachments,
                                email_id: res.email_id,
                            };

                            this.backend.postRequest('module/Emails/groupware/saveaddinattachments', {}, attachmentData).subscribe(
                                success => {
                                    retSubject.next(true);
                                    retSubject.complete();
                                },
                                error => {
                                    retSubject.error('error archiving attachments');
                                    retSubject.complete();
                                }
                            );

                            this.emailId = res.email_id;
                        } else {
                            retSubject.next(true);
                            retSubject.complete();
                        }
                    },
                    error => {
                        retSubject.error('error archiving email');
                        retSubject.complete();
                    }
                );
            },
            (err) => {
                console.log('Cannot assemble email: ' + err);
            }
        );

        return retSubject.asObservable();
    }

    public getEmailFromSpice(): Observable<any> {
        let retSubject = new Subject();

        let data = {
            message_id: this._messageId
        };

        this.backend.postRequest('module/Emails/groupware/getemail', {}, data).subscribe(
            (res) => {
                this.emailId = res.email_id;

                for (let beanId in res.linkedBeans) {
                    if (!this.checkBeanArchive(res.linkedBeans[beanId])) {
                        this.addBean(res.linkedBeans[beanId]);
                    }
                }

                for (let attId in res.attachments) {
                    if (attId == "") {
                        continue;
                    }

                    let currentAttachment = this.getAttachment(attId);
                    this.addAttachment(currentAttachment[0]);
                }

                retSubject.next(true);
                retSubject.complete();
            },
            (err) => {
                console.log(err);
                retSubject.error(false);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    /**
     * loads the beans from SpiceCRM that are related to any of the email addresses used in the email
     */
    public loadLinkedBeans(): Observable<any> {
        let responseSubject = new Subject<any>();
        let payload = this.getEmailAddressData();

        this.backend.postRequest('EmailAddress/searchBeans', {}, payload).subscribe(
            (res: any) => {
                for (let item in res) {
                    if (!this.checkRelatedBeans(res[item])) {
                        this.relatedBeans.push(res[item]);
                    }
                }
                responseSubject.next(this.relatedBeans);
                responseSubject.complete();
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    get messageId() {
        return this._messageId;
    }

    set messageId(value) {
        this._messageId = value;
    }

    public abstract assembleEmail(): Observable<any>;

    public abstract getAttachments(): Observable<any>;

    public abstract getAttachmentToken(): Observable<any>;

    public abstract getAddressArray();

    public abstract getEmailAddressData();
}
