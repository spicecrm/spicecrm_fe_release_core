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
import {
    Component,
    Input,
    ElementRef,
    OnInit
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {language} from "../../../services/language.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    providers: [model, view],
    selector: "mailbox-manager-email",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanageremail.html",
})
export class MailboxManagerEmail implements OnInit {

    @Input() private email: any = {}
    private componentFields: Array<any> = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private elementref: ElementRef,
        private view: view,
        private model: model,
        private modelutilities: modelutilities,
    ) {
        this.view.displayLinks = false;
    }

    public ngOnInit() {
        this.model.module = "Emails";
        this.model.id = this.email.id;
        this.model.data = this.modelutilities.backendModel2spice("Emails", this.email);

        // get the module conf
        let fieldset = this.metadata.getComponentConfig("MailboxManagerEmail").fieldset;
        if (fieldset) {
            this.componentFields = this.metadata.getFieldSetItems(fieldset);
        }
    }

    private selectMail(e) {
        if (!this.mailboxesEmails.activeEmail || e.id != this.mailboxesEmails.activeEmail.id) {
            this.mailboxesEmails.activeEmail = e;
        }
    }

    get isSelected() {
        return this.mailboxesEmails.activeEmail && this.mailboxesEmails.activeEmail.id == this.model.id;
    }

    get nameStyle() {
        let style = {};
        if (this.email.status === 'unread') {
            style['font-weight'] = 'bold';
        }
        switch (this.email.openness) {
            case 'user_closed':
            case 'system_closed':
                style['text-decoration'] = 'line-through';
                break;
        }
        return style;
    }

}
