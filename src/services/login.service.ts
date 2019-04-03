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
 * @module services
 */
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {configurationService} from './configuration.service';
import {loader} from './loader.service';
import {session} from './session.service';
import {toast} from './toast.service';

interface loginAuthDataIf {
    userName: string;
    password: string;
}

@Injectable()
export class loginService {

    public redirectUrl: string = '';

    public authData: loginAuthDataIf = {
        userName: '',
        password: ''
    };

    public oauthToken: string = '';
    public accessToken: string = '';
    public loginSuccessful: Subject<boolean> = new Subject<boolean>();

    constructor(
        private configurationService: configurationService,
        private http: HttpClient,
        private router: Router,
        private loader: loader,
        private toast: toast,
        private session: session
    ) { }

    public login(): Observable<boolean> {
        // make sure we invalidate a session id cookie that might still be around
        // document.cookie = 'PHPSESSID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        let krestUrl: string = "";
        let options: object = {};
        let loginBy: string;
        if (this.authData.userName.length > 0 && this.authData.password.length > 0) {
            let asUsernamePos: number = this.authData.userName.indexOf('#as#');
            if (asUsernamePos > -1) {
                loginBy = this.authData.userName.slice(0, asUsernamePos);
                this.authData.userName = this.authData.userName.slice(asUsernamePos + 4);
            }
            let loginheaders = new HttpHeaders();
            loginheaders = loginheaders.set(
                'Authorization',
                'Basic ' + btoa(this.authData.userName + ':' + this.authData.password)
            );

            krestUrl = this.configurationService.getBackendUrl() + '/login';
            if (loginBy) krestUrl += '?byDev=' + encodeURIComponent(loginBy);
            options = {headers: loginheaders};
        } else if (this.oauthToken.length > 0) {
            let optionparams = {oauthToken: this.oauthToken, accessToken: this.accessToken};
            krestUrl = this.configurationService.getBackendUrl() + '/google_oauth/token';
            options = {params: optionparams};
        } else {
            throw new Error('Cannot Log In');
        }

        this.http.get(krestUrl, options)
            .subscribe(
                (res: any) => {
                    if (res.result == false) {
                        this.toast.sendToast('error authenticating', 'error', res.error);
                    }

                    let response = res;
                    this.session.authData.sessionId = response.id;
                    this.session.authData.userId = response.userid;
                    this.session.authData.userName = response.user_name;
                    this.session.authData.userimage = response.user_image;
                    this.session.authData.first_name = response.first_name;
                    this.session.authData.last_name = response.last_name;
                    this.session.authData.display_name = response.display_name;
                    this.session.authData.email = response.email;
                    this.session.authData.admin = response.admin == 1 ? true : false;
                    this.session.authData.dev = response.dev == 1 ? true : false;
                    this.session.authData.portalOnly = response.portal_only === '1' ? true : false;
                    this.session.authData.renewPass = response.renewPass === '1' ? true : false;
                    this.session.authData.googleToken = response.access_token;
                    sessionStorage['OAuth-Token'] = this.session.authData.sessionId;
                    sessionStorage[btoa(this.session.authData.sessionId + ':backendurl')] =
                        btoa(this.configurationService.getBackendUrl());
                    sessionStorage[btoa(this.session.authData.sessionId + ':siteid')] =
                        btoa(this.configurationService.getSiteId());
                    if (!this.session.authData.renewPass) {
                        this.load();
                    }

                    this.loginSuccessful.next(true);
                    this.loginSuccessful.complete();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.toast.sendToast('error authenticating', 'error', 'Wrong username and/or password');
                            break;
                    }
                    this.loginSuccessful.next(false);
                    this.loginSuccessful.error('Not logged in');
                });

        return this.loginSuccessful.asObservable();
    }

    public load() {
        this.loader.load().subscribe((val) => this.redirect(val));
    }

    public redirect(val) {
        if (val === true) {
            this.session.authData.loaded = true;

            // clear all toasts
            this.toast.clearAll();

            // see if we came from alogout and go back or go to home
            if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
                this.redirectUrl = '';
            } else {
                this.router.navigate(['/module/Home']);
            }
        }
    }

    public logout() {
        this.http.delete(
            this.configurationService.getBackendUrl() + '/login?session_id=' + this.session.authData.sessionId
        );
        this.session.endSession();
        this.loader.reset();
        this.router.navigate(['/login']);
    }


    // seems to be unused
    /*private getOptionsWithOauthToken() {

        let headers = new HttpHeaders();
        // headers.append('oauth-token', this.authData.access_token);
        let options = new RequestOptions({
            headers: headers
        });
        return options;
    }*/
}

@Injectable()
export class loginCheck implements CanActivate {
    constructor(private login: loginService, private session: session, private router: Router, private loader: loader) {
    }

    public canActivate(route, state) {
        if (!this.session || !this.session.authData.sessionId) {
            this.login.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }
}
