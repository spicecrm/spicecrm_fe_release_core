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
import {HttpClient} from "@angular/common/http";
import {AfterViewInit, Component, ElementRef, EventEmitter, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";

/**
 * @ignore
 */
declare var gapi: any;

@Component({
    selector: "global-login-google",
    templateUrl: "./src/globalcomponents/templates/globallogingoogle.html"
})
export class GlobalLoginGoogle {

    private clientId: string = "";

    private visible: boolean = false;

    private scope = [
        "profile",
        "email",
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/contacts.readonly",
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
    ].join(" ");

    public auth2: any;

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private http: HttpClient,
        private loginService: loginService,
        private session: session
    ) {
        this.configuration.loaded$.subscribe((loaded) => {
            this.googleInit();
        });
    }

    public googleInit() {
        if (this.configuration.data.backendextensions.hasOwnProperty("google_oauth") &&
            this.configuration.data.backendextensions.google_oauth.config != null) {

            // load the google API
            gapi.load("auth2", () => {
                let calendar_config = JSON.parse(
                    this.configuration.data.backendextensions.google_oauth.config.calendarconfig
                );
                this.clientId = calendar_config.web.client_id;
                this.auth2 = gapi.auth2.init({
                    client_id: this.clientId,
                    cookiepolicy: "single_host_origin",
                    scope: this.scope
                });

                this.visible = true;
            });
        }
    }

    public signInClick() {
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let user_token = googleUser.getAuthResponse().id_token;
                let access_token = googleUser.getAuthResponse().access_token;
                this.loginService.oauthToken = user_token;
                this.loginService.accessToken = access_token;
                this.loginService.authData.userName = "";
                this.loginService.authData.password = "";
                // this.session.authData.sessionId = user_token;
                this.loginService.login().subscribe(
                    (res) => {
                        this.synchronize();
                    },
                    (err) => {
                        console.log(err);
                    },
                );
            })
            .catch((error: { error: string }) => {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }

    public synchronize() {
        this.backend.getRequest('/google/calendar/sync').subscribe(
            (res) => {
                console.log('Successfully Synchronized');
            },
            (err) => {
                console.log('Synchronization Error');
            },
        );
    }
}
