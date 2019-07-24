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
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";
import {toast} from "../../../services/toast.service";

@Component({
    providers: [model, view],
    selector: "mailbox-manager-email-details",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanageremaildetails.html",
})
export class MailboxmanagerEmailDetails implements AfterViewInit {

    private containerComponents: any[] = [];
    private fieldset: string = '';
    private fieldsetitems: any[];

    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) private detailscontent: ViewContainerRef;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        public sanitizer: DomSanitizer,
        private mailboxesEmails: mailboxesEmails,
        private elementref: ElementRef,
        private backend: backend,
        private toast: toast,
        private view: view,
    ) {
        this.mailboxesEmails.activeMessage$.subscribe(email => {
            this.loadEmail(email);
        });

        this.view.displayLabels = false;
    }

    get containerStyle() {
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)'
        };
    }

    private loadEmail(email) {

        // set the module to the model
        if (this.mailboxesEmails.activeMailBox) {
            if (this.mailboxesEmails.activeMailBox.type == 'sms') {
                this.model.module = "TextMessages";
            } else if (this.mailboxesEmails.activeMailBox.type == 'email') {
                this.model.module = "Emails";
            }
        }

        // initialize and set the id
        this.model.initialize();

        // on load undefined is returned
        if (!email) {
            this.model.id = undefined;
            return;
        }

        this.model.id = email.id;

        // rebuild the container so all data gets reinitialized
        this.buildContainer();

        // load the model
        this.model.getData(false, '').subscribe(loaded => {
            if (this.model.getFieldValue('status') == 'unread') {
                this.setStatus('read');
            }
        });
    }

    public ngAfterViewInit() {
        // this.buildContainer();
    }

    private destroyContainer() {
        for (let containerComponent of this.containerComponents) {
            containerComponent.destroy();
        }
        this.containerComponents = [];
    }

    private handleAction(event) {
        switch (event) {
            // is needed for the emailtoobject component and its behavior to link a relation after save so it needs to reloaded in order to show new related records...
            case 'save':
                this.buildContainer();
                break;
        }
    }

    private buildContainer() {

        this.destroyContainer();

        // get componentset
        let componentconfig = this.metadata.getComponentConfig("MailboxmanagerEmailDetails", this.model.module);
        let viewComponentSet = componentconfig.componentset;
        for (let component of this.metadata.getComponentSetObjects(viewComponentSet)) {
            this.metadata.addComponent(component.component, this.detailscontent).subscribe(componentRef => {
                componentRef.instance["componentconfig"] = component.componentconfig ? component.componentconfig : {};
                this.containerComponents.push(componentRef);
            });
        }

        // load the fieldset
        this.fieldset = componentconfig.fieldset;
        if (this.fieldset) {
            this.fieldsetitems = this.metadata.getFieldSetFields(this.fieldset);
        }

    }

    get sanitizedEmailHtml() {
        return this.sanitizer.bypassSecurityTrustHtml(this.model.data.body);
    }

    get nameStyle() {
        let styles = {};

        if (this.isCompleted) {
            styles["text-decoration"] = "line-through";
        }

        return styles;
    }

    get isUserClosed() {
        return this.model.getField('openness') == 'user_closed';
    }

    get isRead() {
        return this.model.getField('status') == 'read';
    }

    get isCompleted() {
        return this.model.data.emailopenness === "user_closed";
    }

    get actionSet() {
        if (this.mailboxesEmails.activeMailBox.actionset) {
            return this.mailboxesEmails.activeMailBox.actionset;
        } else {
            return "";
        }
    }

    private completeMail() {
        this.setOpenness('user_closed');
    }

    private markUnread() {
        this.setStatus('unread');
    }

    private reopen() {
        this.setOpenness('open');
    }

    public setStatus(status) {
        // set the model
        this.model.setField('status', status);
        // update the backend
        this.backend.postRequest('/module/' + this.model.module + '/' + this.model.id + '/setstatus/' + status).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeMessage.status = status;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change status to ' + status);
            }
        );
    }

    public setOpenness(openness) {
        // set the model
        this.model.setField("openness", openness);
        // update the backend
        this.backend.postRequest("/module/" + this.model.module + '/' + this.model.id + "/setopenness/" + openness).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeMessage.openness = openness;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change openness to ' + openness);
            }
        );
    }
}
