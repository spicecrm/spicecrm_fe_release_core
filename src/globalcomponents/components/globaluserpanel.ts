/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/


import {Router} from "@angular/router";
import {Component, ViewChild, ViewContainerRef, Renderer} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {popup} from "../../services/popup.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {configurationService} from "../../services/configuration.service";
import { modal } from "../../services/modal.service";
import {cookie} from "../../services/cookie.service";

@Component({
    selector: "global-user-panel",
    templateUrl: "./src/globalcomponents/templates/globaluserpanel.html",
})
export class GlobaUserPanel {

    @ViewChild("imgupload", {read: ViewContainerRef}) public imgupload: ViewContainerRef;

    constructor(
        private rendered: Renderer,
        private loginService: loginService,
        private session: session,
        private router: Router,
        private popup: popup,
        private language: language,
        private metadata: metadata,
        private footer: footer,
        private config: configurationService,
        private modalservice: modal,
        private cookie: cookie,
    ) {

    }

    private logoff() {
        this.loginService.logout()
    }

    private changeImage() {
        let event = new MouseEvent("click", {bubbles: true});
        this.rendered.invokeElementMethod(this.imgupload.element.nativeElement, "dispatchEvent", [event]);
    }

    private getAvialableLanguages(){
        return this.language.getAvialableLanguages(true);
    }

    get displayName(){
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    get userName(){
        return this.session.authData.userName;
    }

    get currentlanguage(){
        return this.language.currentlanguage;
    }

    set currentlanguage(value){
        this.popup.close();
        this.language.currentlanguage = value;
        this.language.loadLanguage();
    }

    private goDetails() {
        this.popup.close();
        this.router.navigate(["/module/Users/" + this.session.authData.userId]);
    }

    private changePassword() {
        this.modalservice.openModal("UserChangePasswordModal");
    }
}
