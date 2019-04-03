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
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "user-changepassword-modal",
    templateUrl: "./src/modules/users/templates/userchangepasswordmodal.html"
})
export class UserChangePasswordModal {

    private currentPassword: string = "";
    private newPassword: string = "";
    private repeatPassword: string = "";
    private pwdCheck: RegExp = new RegExp("//");
    private pwdGuideline: string = "";
    private infoLoaded = false;
    private repFieldVisited = false;

    public self: any = undefined;

    constructor( private language: language, private session: session, private backend: backend, private toast: toast ) { }

    public ngOnInit() {
        this.getInfo();
    }

    get pwderror() {
        if ( !this.infoLoaded ) { return false;}
        return !this.newPassword || this.pwdCheck.test(this.newPassword) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.language.getLabel("MSG_PWDS_DONT_MATCH"); // does not match password
    }

    private close() {
        this.self.destroy();
    }

    private canSave() {
        if ( !this.infoLoaded ) { return false;}
        return this.currentPassword && this.newPassword && this.pwderror === false && this.newPassword !== this.currentPassword && this.pwdreperror === false;
    }

    private save() {
        if ( !this.canSave() ) { return; }
        let postData = {
            currentpwd: this.currentPassword,
            newpwd: this.newPassword
        };
        this.backend.postRequest("user/password/change", {}, postData).subscribe(res => {
            if(res.status === "success"){
                this.toast.sendToast(this.language.getLabel("MSG_PWD_CHANGED_SUCCESSFULLY"));
                this.close()
            } else {
                this.toast.sendToast( this.language.getLabel("ERR_CHANGING_PWD"), "error", this.language.getLabel( res.lbl ), 10 );
            }
        });
    }

    private getInfo() {
        this.backend.getRequest("user/password/info", { lang: this.language.currentlanguage } ).subscribe( (res:any) => {
            this.pwdCheck = new RegExp( res.pwdCheck.regex );
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

}
