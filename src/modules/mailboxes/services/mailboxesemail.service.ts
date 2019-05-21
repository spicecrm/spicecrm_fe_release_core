/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleMailboxes
 */
import {Injectable, EventEmitter, Output} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

import {Subject, Observable} from 'rxjs';


/**
* @ignore
*/
declare var moment: any;

@Injectable()
export class mailboxesEmails {

    @Output('mailboxesLoaded') mailboxesLoaded$: EventEmitter<boolean> = new EventEmitter<boolean>();

    private limit = 30;

    public mailboxes: any[] = [];
    public emails: Array<any> = [];

    private _activeMailBox: any;
    private _activeEmail: any;
    public activeEmail$: EventEmitter<any> = new EventEmitter<any>();
    public unreadonly: boolean = true;
    public openonly: boolean = true;
    public isLoading: boolean = false;
    public emailopenness: string = "";
    public allLoaded: boolean = false;

    constructor(
        private backend: backend,
        private modelutilities: modelutilities,
    ) {
        this.getMailboxes();
    }

    get activeEmail() {
        return this._activeEmail;
    }

    set activeEmail(email) {
        this._activeEmail = email;
        this.activeEmail$.emit(email);
    }

    get activeMailBox() {
        return this._activeMailBox;
    }

    set activeMailBox(mailbox) {
        this._activeMailBox = mailbox;
        this.allLoaded = false;
    }

    private getMailboxes() {

        this.backend.getRequest("mailboxes/getmailboxes", {scope: 'inbound'}).subscribe(
            (results: any) => {
                for (let mailbox of results) {
                    this.mailboxes.push({
                        actionset: mailbox.actionset,
                        id: mailbox.value,
                        name: mailbox.display,
                    });
                }
                // send an event here and catch it in mailboxmanagerheader
                this.mailboxesLoaded$.emit(true);
            }
        );

    }

    public fetchEmails() {
        let responseSubject = new Subject<boolean>();

        this.backend.getRequest("/modules/Mailboxes/" + this.activeMailBox.id + "/fetchemails").subscribe(
            // todo a spinner or sth similar while waiting for the response
            (response: any) => {
                if (response.new_mail_count > 0) {
                    this.loadMails();
                }
                responseSubject.next(response);
                responseSubject.complete();
            },
        );
    }

    public loadMails() {
        if (!this.activeMailBox) {
            return false;
        }

        this.activeEmail = undefined;

        // reset the emails
        this.emails = [];

        let conditions = [
            {field: "mailbox_id", operator: "=", value: this.activeMailBox.id},
            {field: "type", value: "inbound", operator: "="},
        ];
        if (this.emailopenness) {
            conditions.push({
                field: "openness",
                value: this.emailopenness,
                operator: "="
            });
        }
        if (this.unreadonly) {
            conditions.push({
                field: "status",
                value: "unread",
                operator: "="
            });
        }
        let parameters = {
            fields: JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness",
                "sentiment", "magnitude"]),
            searchfields: JSON.stringify({
                conditions: conditions,
                join: "and",
            }),
            sortdirection: "DESC",
            sortfield: "date_sent",
        };

        this.isLoading = true;

        this.backend.getRequest("module/Emails", parameters).subscribe((res: any) => {
            this.emails = res.list;
            //this.loadedMailbox = this.activeMailBox.id;
            this.isLoading = false;
        });
    }

    public loadMore() {
        this.isLoading = true;
        let parameters = {};
        if (this.unreadonly) {
            parameters = {
                fields: JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness",
                "sentiment", "magnitude"]),
                limit: this.limit,
                offset: this.emails.length,
                searchfields: JSON.stringify({
                        conditions: [
                            {
                                field: "mailbox_id",
                                operator: "=",
                                value: this.activeMailBox.id,
                            },
                            {field: "status", value: "user_closed", operator: "!="},
                            {field: "type", value: "inbound", operator: "="}
                        ],
                        join: "and",
                    }
                ),
                sortdirection: "DESC",
                sortfield: "date_sent",
            };
        } else {
            parameters = {
                fields: JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness"]),
                limit: this.limit,
                offset: this.emails.length,
                searchfields: JSON.stringify({
                    conditions: [
                        {
                            field: "mailbox_id",
                            value: this.activeMailBox.id,
                            operator: "="
                        },
                        {field: "type", value: "inbound", operator: "="}
                    ],
                    join: "and",
                }),
                sortdirection: "DESC",
                sortfield: "date_sent",
            };
        }


        this.backend.getRequest("module/Emails", parameters).subscribe((res: any) => {
            if (res.list.length > 0) {
                for (let mail of res.list) {
                    this.emails.push(mail);
                }
            } else {
                this.allLoaded = true;
            }

            this.isLoading = false;
        });
    }
}