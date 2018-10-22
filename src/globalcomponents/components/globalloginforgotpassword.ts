/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Output} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {toast} from '../../services/toast.service';
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'global-login-forgot-password',
    templateUrl: './src/globalcomponents/templates/globalloginforgotpassword.html',
    host: {
        '(window:keypress)': 'this.keypressed($event)'
    }
})
export class GlobalLoginForgotPassword {
    email: string = '';
    token: string = '';
    password: string = undefined;
    repeatPassword: string = undefined;
    pwdCheck: RegExp = new RegExp('//');
    pwdGuideline: string = '';
    infoLoaded: boolean = false;
    emailEmpty: boolean = false;
    tokenEmpty: boolean = false;
    tokenInvalid: boolean = false;
    promptUser: boolean = false;
    showForgotPasswordEmail: boolean = true;
    promptNewPass: boolean = false;
    showForgotPasswordToken: boolean = false;
    @Output() hasNewPassword: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private http: HttpClient,
        private configuration: configurationService,
        private toast: toast,
    ) {
        this.getInfo();
    }

    getInfo() {
        this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/info').subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }
    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    keypressed(event) {
        if (event.keyCode === 13) {
            if (this.showForgotPasswordEmail)
                this.sendEmail();
            if (this.showForgotPasswordToken)
                this.sendToken();
            if (this.promptNewPass)
                this.sendNewPass();
        }
    }

    sendEmail() {
        if (this.email.length > 0) {
            this.emailEmpty = false;
            this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/' + this.email).subscribe(
                (res) => {
                    if (!res) {
                        this.toast.sendToast('User with the given email does not exist', 'error');
                    } else {
                        this.showForgotPasswordToken = true;
                        this.showForgotPasswordEmail = false;
                        this.toast.sendToast('Successfully sent, check your inbox to get the token code', 'success');
                    }
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.showForgotPasswordEmail = true;
                            break;
                    }
                });
        } else {
            this.emailEmpty = true;
        }
    }

    sendToken() {
        if (this.token.length > 0) {
            this.tokenEmpty = false;
            this.http.post(
                this.configuration.getBackendUrl() + '/forgotPassword/' + this.email + "/" + this.token,
                {},
            ).subscribe(
                (res: any) => {
                    var response = res;
                    this.showForgotPasswordEmail = false;
                    if (response.token_valid) {
                        this.showForgotPasswordToken = false;
                        this.promptNewPass = true;
                    } else {
                        this.tokenInvalid = true;
                        this.toast.sendToast(
                            'Token or email is invalid',
                            'error',
                            'Token is expired, or invalid or does not belong to this email address',
                            false,
                        );
                    }

                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.showForgotPasswordToken = true;
                            break;
                    }
                });
        } else {
            this.emailEmpty = true;
        }
    }

    sendNewPass() {
        if(this.infoLoaded)
            if(this.pwderror) return false;

        if (this.password && this.pwdreperror == false) {
            this.http.post(this.configuration.getBackendUrl() + '/forgotPassword/resetPass', {
                "email": this.email,
                "token": this.token,
                "password": this.password
            }).subscribe(
                (res) => {
                    this.promptNewPass = false;
                    this.toast.sendToast(
                        'please log in with new password',
                        'default',
                        'please return to login form and enter login data with new password',
                        false,
                    );
                    this.hasNewPassword.emit(false);
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