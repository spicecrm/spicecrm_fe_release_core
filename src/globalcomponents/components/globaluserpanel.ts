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
import {Router} from "@angular/router";
import {Component, EventEmitter, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";
import {cookie} from "../../services/cookie.service";
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';

declare var _: any;

@Component({
    selector: "global-user-panel",
    templateUrl: "./src/globalcomponents/templates/globaluserpanel.html",
})
export class GlobaUserPanel {

    private timezones: object;
    private timezoneKeys: string[];
    private isEditingTz = false;
    private compId: string = _.uniqueId();

    /**
     * emits that the popup shoudl be closed
     */
    @Output() private closepopup: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private loginService: loginService,
        private session: session,
        private router: Router,
        private language: language,
        private metadata: metadata,
        private backend: backend,
        private config: configurationService,
        private modalservice: modal,
        private cookie: cookie,
        private userprefs: userpreferences,
        private toastservice: toast
    ) {

    }

    private logoff() {
        this.loginService.logout();
    }

    private changeImage() {
        this.modalservice.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 150;
            componentref.instance.cropwidth = 150;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                    // make a backup of the image, set it to emtpy and if case call fails set back the saved image
                    let imagebackup = this.session.authData.userimage;
                    this.session.authData.userimage = '';
                    this.backend.postRequest('module/Users/' + this.session.authData.userId + '/image', {}, {imagedata: image}).subscribe(
                        response => {
                            this.session.authData.userimage = image;
                        },
                        error => {
                            this.session.authData.userimage = imagebackup;
                        });
                }
            });
        });
    }

    get displayName() {
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    get userName() {
        return this.session.authData.userName;
    }

    private goDetails() {
        this.router.navigate(["/module/Users/" + this.session.authData.userId]);
        this.close();
    }

    private changePassword() {
        this.modalservice.openModal("UserChangePasswordModal");
    }

    get userimage() {
        return this.session.authData.userimage;
    }

    private set currentTz(value) {
        if (this.userprefs.unchangedPreferences.global && this.userprefs.unchangedPreferences.global.timezone === value) return;
        this.userprefs.setPreference('timezone', value, true).subscribe((data: any) => {
            this.toastservice.sendToast('Timezone set successfully to "' + data.timezone + '".', 'success');
        }, error => {
            this.toastservice.sendToast('Error setting timezone.', 'error');
        });
        this.session.setTimezone(value); // Let the UI together with all the models and components know about the new configured timezone.
        this.close();
    }

    private get currentTz(): string {
        if (this.userprefs.unchangedPreferences && this.userprefs.unchangedPreferences.global) {
            return this.userprefs.unchangedPreferences.global.timezone;
        } else {
            return '';
        }
    }

    /**
     * closes the popup
     */
    private close() {
        this.closepopup.emit(true);
    }

}
