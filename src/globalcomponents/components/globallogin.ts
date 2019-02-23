/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component, ChangeDetectorRef, Renderer2
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {cookie} from '../../services/cookie.service';
import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


declare var _: any;

@Component({
    selector: 'global-login',
    templateUrl: './src/globalcomponents/templates/globallogin.html',
    host: {
        '(window:keypress)': 'this.keypressed($event)',
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalLogin {
    private promptUser: boolean = false;

    private username: string = '';
    private password: string = '';
    private _selectedlanguage: string = '';
    private selectedsite: string = '';
    private lastSelectedLanguage: string = null;
    private showForgotPass: boolean = false;
    private externalSidebarUrl: SafeResourceUrl = null;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private session: session,
                private cookie: cookie,
                private language: language,
                private sanitizer: DomSanitizer,
                private changeDetectorRef: ChangeDetectorRef
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);


            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]) {
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));
            }

            this.http.get(this.configuration.getBackendUrl() + '/login', {
                headers
            }).subscribe(
                (res: any) => {
                    let repsonse = res;
                    this.session.authData.sessionId = repsonse.id;
                    this.session.authData.userId = repsonse.userid;
                    this.session.authData.userName = repsonse.user_name;
                    this.session.authData.userimage = repsonse.user_image;
                    this.session.authData.first_name = repsonse.first_name;
                    this.session.authData.last_name = repsonse.last_name;
                    this.session.authData.display_name = repsonse.display_name;
                    this.session.authData.email = repsonse.email;
                    this.session.authData.admin = repsonse.admin == 1 ? true : false;
                    this.session.authData.dev = repsonse.dev == 1 ? true : false;
                    this.session.authData.renewPass = repsonse.renewPass === '1' ? true : false;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    if (!this.session.authData.renewPass) {
                        this.loginService.load();
                    }
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptUser = true;
                            break;
                    }
                });
        } else {
            this.promptUser = true;

            this.selectedsite = this.cookie.getValue('spiceuibackend');
            if (this.selectedsite) {
                this.configuration.setSiteID(this.selectedsite);
            }
        }

        // check the last selected language from the Cookie
        this.lastSelectedLanguage = this.cookie.getValue('spiceuilanguage');

    }

    private handleResize() {
        this.changeDetectorRef.detectChanges();
    }

    private keypressed(event) {
        if (event.keyCode === 13 && !this.showForgotPass && !this.session.authData.renewPass) {
            this.login();
        }
    }

    private login() {
        if (this.username.length > 0 && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login();
        }
    }


    set selectedlanguage(value) {
        this._selectedlanguage = value;
        this.language.currentlanguage = value;
    }

    get selectedlanguage() {
        if (!this._selectedlanguage) {
            if (this.lastSelectedLanguage) {
                this.selectedlanguage = this.lastSelectedLanguage;
            } else if (this.configuration.data.languages) {
                this.selectedlanguage = this.configuration.data.languages.default;
            }
        }
        return this._selectedlanguage;
    }

    private getLanguages() {
        let langArray = [];

        if (this.configuration.data.languages) {
            // this.selectedlanguage = this.configuration.data.languages.default;
            for (let language of this.configuration.data.languages.available) {
                langArray.push({
                    language: language.language_code,
                    text: language.language_name
                });
            }
        }
        return langArray;
    }

    private doLogin() {
        this.loginService.login();
    }

    get currentSiteId() {
        return this.configuration.data.id;
    }

    get sites() {
        return this.configuration.sites;
    }

    private getBackendUrls() {
        if (this.configuration.data.backendUrls) {
            return this.configuration.data.backendUrls;
        } else {
            return [];
        }
    }

    private setSite(event) {
        this.configuration.setSiteID(event.srcElement.value);
    }

    private showForgotPassword() {
        if (this.showForgotPass) {
            this.showForgotPass = false;
        } else {
            this.showForgotPass = true;
        }
    }

    get showSidebar() {
        return window.innerWidth >= 1024;
    }

    get showExternalSidebar() {
        try {
            let ret = !_.isEmpty(this.configuration.data.loginSidebarUrl);
            if (ret && this.externalSidebarUrl === null) {
                this.externalSidebarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuration.data.loginSidebarUrl);
            }
            return ret;
        } catch (e) {
            return false;
        }
    }

    get showNewsfeed() {
        try {
            if (!this.configuration.initialized) {
                return false;
            }
            return _.isEmpty(this.configuration.data.loginSidebarUrl);
        } catch (e) {
            return false;
        }
    }

    get showProgressBar() {
        return this.configuration.data.loginProgressBar;
    }
}
