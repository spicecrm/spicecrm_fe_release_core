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
 * @module GlobalComponents
 */
import {
    Component, ChangeDetectorRef, Renderer2
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {broadcast} from '../../services/broadcast.service';
import {cookie} from '../../services/cookie.service';
import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


/**
 * @ignore
 */
declare var _: any;

/**
 * the login component that is rendered on the login screen and prompts for usrname and password resp offers alternative login methods
 */
@Component({
    selector: 'global-login',
    templateUrl: './src/globalcomponents/templates/globallogin.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalLogin {
    private promptUser: boolean = false;

    /**
     * the username
     */
    private username: string = '';

    /**
     * the password
     */
    private password: string = '';

    /**
     * variable for the selected language
     */
    private _selectedlanguage: string = '';

    /**
     * the selected site if multiple sites are available
     */
    private selectedsite: string = '';

    // the last selected language .. loaded from the cookie
    // ToDo: should be changed to local store
    private lastSelectedLanguage: string = null;

    /**
     * determine if the forgotten password is open or not
     */
    private showForgotPass: boolean = false;

    /**
     * variable to hold if per config the extenral side bar shoudl be shown
     * ToDo: move to separate component
     */
    private externalSidebarUrl: SafeResourceUrl = null;

    /**
     * holds if the user is just trying to log in
     */
    private loggingIn: boolean = false;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private session: session,
                private cookie: cookie,
                private language: language,
                private broadcast: broadcast,
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
                    this.session.authData.renewPass = response.renewPass === '1' ? true : false;
                    this.session.authData.obtainGDPRconsent = response.obtainGDPRconsent;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    if (!this.session.authData.renewPass) {
                        // broadcast taht we have a login
                        this.broadcast.broadcastMessage('login');

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

    /**
     * registerd to the resize event that handles if the news feed shoudl be shown or not
     */
    private handleResize() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * triggers the actual login itself
     */
    private login() {
        this.loggingIn = true;
        if (this.username.length > 0 && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login().subscribe(
                success => {
                    this.loggingIn = false;
                },
                error => {
                    this.loggingIn = false;
                }
        );
        }
    }


    /**
     * setter for the selected language
     *
     * @param value the language code
     */
    set selectedlanguage(value) {
        this._selectedlanguage = value;
        this.language.currentlanguage = value;
    }

    /**
     * getter for the selected language
     */
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

    /**
     * returns the available languages for the chosen backend system
     */
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

    /**
     * private function that actually does the login is user data is set
     */
    private doLogin() {
        this.loginService.login();
    }

    /**
     * returns thecurrent site id from the configuration service
     */
    get currentSiteId() {
        return this.configuration.data.id;
    }

    /**
     * helpe to retrieve all available sites from teh configuration service
     */
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

    /**
     * setter for the new site id. This sets the site id in the configuration service and triggers detection of the baakcned extensions, languages and capabilities
     *
     * @param event
     */
    private setSite(event) {
        this.configuration.setSiteID(event.srcElement.value);
    }

    /**
     * toggles the forgotten password screen elements
     */
    private showForgotPassword() {
        if (this.showForgotPass) {
            this.showForgotPass = false;
        } else {
            this.showForgotPass = true;
        }
    }

    /**
     * a helper functions that returns if the sidebar in teh login screen shoudl be shown or not
     */
    get showSidebar() {
        return window.innerWidth >= 1024;
    }

    /**
     * a helper to return if the content of the sidebar shoudl be rendered as default or if the extenrla sidebar shoudl be shown.
     *
     * an external diebar can be added if in the config fot the site the property loginSidebarUrl is set and points to an URL. that url is loaded in teh sidebar in an iframe
     */
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
