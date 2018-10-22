/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component, Input
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {toast} from '../../services/toast.service';


@Component({
    selector: 'global-login-reset-password',
    templateUrl: './src/globalcomponents/templates/globalloginresetpassword.html',
    host: {
        '(window:keypress)': 'this.keypressed($event)'
    }
})
export class GlobalLoginResetPassword {
    @Input('oldpassword') oldPassword: string = undefined;
    password: string = undefined;
    repeatPassword: string = undefined;
    promptNewPass: boolean = false;
    pwdCheck: RegExp = new RegExp('//');
    pwdGuideline: string = undefined;
    infoLoaded = false;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private toast: toast,
                private session: session) {
        this.getInfo();
    }

    get oldPwError(){
        return (this.oldPassword == this.password) ? 'Old password is not allowed to be used as a new password': false;
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }
    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    keypressed(event) {
        if (event.keyCode === 13) {
                this.sendNewPass();

        }
    }

    getInfo() {
        this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/info').subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    sendNewPass() {

        if (this.infoLoaded)
            if(this.pwderror) return false;

        if (this.password && this.pwdreperror == false && this.oldPwError == false) {

            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', this.session.authData.sessionId);

            this.http.post(this.configuration.getBackendUrl() + '/resetTempPass', {
                "password": this.password,
            },{headers: headers}).subscribe(
                (res) => {
                    this.session.authData.renewPass = false;
                    this.toast.sendToast('Password was successfully changed', 'success', '', 5);
                    this.loginService.load();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptNewPass = true;
                            break;
                    }
                });
        }
    }

}