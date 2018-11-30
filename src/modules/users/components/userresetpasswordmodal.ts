/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {session} from "../../../services/session.service";

@Component({
    selector: "user-reset-password-modal",
    templateUrl: "./src/modules/users/templates/userresetpasswordmodal.html"
})
export class UserResetPasswordModal {

    public self: any = undefined;
    public userId: string = '';
    private password: string = undefined;
    private repeatPassword: string = undefined;
    private pwdCheck: RegExp = new RegExp("//");
    private pwdGuideline: string = undefined;
    private infoLoaded = false;
    private autogenerate: boolean = false;
    private sendByEmail: boolean = false;
    private showPassword: boolean = false;
    private passwordErrorMsg: string = "";
    private repeatPasswordErrorMsg: string = "";
    private canSendByEmail: boolean = true;

    constructor(
        private language: language,
        private modelutilities: modelutilities,
        private toast: toast,
        private session: session,
        private backend: backend,
    ) {}

    get passwordError() {
        let boolean = !this.autoGenerate && this.password && !this.pwdCheck.test(this.password);
        this.passwordErrorMsg = boolean ? "Password does not match the Guideline." : "";
        return boolean;
    }

    get repeatPasswordError() {
        let boolean = !this.autoGenerate && this.repeatPassword && this.password !== this.repeatPassword;
        this.repeatPasswordErrorMsg = boolean ? "Inputs for the new Password does not match." : "";
        return boolean;
    }

    get autoGenerate() {
        return this.autogenerate;
    }

    set autoGenerate(value) {
        this.autogenerate = value;
        this.password = value ? Math.random().toString(36).slice(-8) : undefined;
        this.repeatPassword = this.password;
    }

    public ngOnInit() {
        this.getInfo();
    }


    private getPasswordStyle(touched, dirty, isRepeat = false) {
        return touched && dirty && ((isRepeat ? this.repeatPasswordError : this.passwordError)) ? 'slds-has-error' : '';
    }


    private toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private copyPassword() {
        if (!this.autoGenerate) {
            return;
        }

        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.password;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toast.sendToast("Password copied", "success");
    }


    private getInfo() {
        this.backend.getRequest("user/password/info", {lang: this.language.currentlanguage}).subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    private onModalEscX() {
        this.close();
    }

    private save() {
        if (!this.checkErrors() || !this.session.isAdmin) {
            return false;
        }
        this.backend.postRequest("user/password/new", {}, {
            newpwd: this.password,
            userId: this.userId,
            SystemGeneratedPassword: this.autoGenerate,
            sendByEmail: this.sendByEmail
        }).subscribe(res => {
            if (res.status) {
                if (this.sendByEmail) {
                    this.toast.sendToast("An Email with the new password was successfully sent, check your inbox", "success", "", 10);
                } else {
                    this.toast.sendToast("Data saved", "success");
                }

                this.self.destroy();
            } else {
                this.sendByEmail = false;
                this.canSendByEmail = false;
                this.toast.sendToast(res.message, "error");
            }
        }, error => {
            this.sendByEmail = false;
            this.canSendByEmail = false;
            this.toast.sendToast("Email couldn't be send. Check Mailbox Settings.", "error")
        });
    }

    private checkErrors() {
        if (this.autoGenerate) {
            return true;
        }
        let isValid = true;
        if (this.infoLoaded && this.passwordError) {
            isValid = false;
        }
        if (!this.password || this.repeatPasswordError) {
            isValid = false;
        }
        return isValid;
    }

    private close() {
        this.self.destroy();
    }
}
