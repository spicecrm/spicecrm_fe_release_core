/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {mailboxesEmails} from '../services/mailboxesemail.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'mailbox-manager-header',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanagerheader.html',
})
export class MailboxManagerHeader implements OnInit {

    private mailboxselection: string;
    //private emailopenness: string = '';
    get emailopenness()
    {
        return this.mailboxesEmails.emailopenness == "" ? 'all' : this.mailboxesEmails.emailopenness;
    }
    set emailopenness(val) {
        this.mailboxesEmails.emailopenness = val == 'all' ? "" : val;
        this.mailboxesEmails.loadMails();
    }

    get buttonenabled() {
        return this.mailboxesEmails.activeMailBox && !this.mailboxesEmails.isLoading ? true : false;
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private metadata: metadata
    ) {

        // load default settings for the openness selection and the unread only flag
        let componentconfig = this.metadata.getComponentConfig('MailboxManagerHeader');
        this.emailopenness = componentconfig.selectionstatus ? componentconfig.selectionstatus : '';
        this.mailboxesEmails.unreadonly = componentconfig.unreadonly ? componentconfig.unreadonly : false;
    }

    public ngOnInit() {
        let routeSubscribe = this.activatedRoute.params.subscribe(
            (params) => {
                this.mailboxselection = params['id'];

                // catch an event from mailboxesEmails service once the mailboxes are actually loaded
                this.mailboxesEmails.mailboxesLoaded$.subscribe(
                    (loaded) => {
                        if (loaded === true) {
                            this.selectMailbox();
                        }
                    }
                );
            }
        );
    }

    private selectMailbox() {
        this.mailboxesEmails.activeMailBox = {};
        for (let mailbox of this.mailboxesEmails.mailboxes) {
            if (mailbox.id === this.mailboxselection) {
                this.mailboxesEmails.activeMailBox = mailbox;
            }
        }
        this.mailboxesEmails.loadMails();
    }

    private reloadList() {
        this.mailboxesEmails.loadMails();
    }

    private fetchEmails() {
        this.mailboxesEmails.fetchEmails();
    }

}
