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
 * @module SpiceInstallerModule
 */

import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-review',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerreview.html',
})

export class SpiceInstallerReview implements AfterViewInit {
    private loading: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private spiceinstaller: spiceinstaller
    ) {

    }

    public ngAfterViewInit() {
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.steps[7] = this.spiceinstaller.selectedStep;
    }

    /**
     * sends the configuration data to the backend, sets the site data and redirects to the login
     */
    private install() {
        this.loading = true;
        this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/install`, this.spiceinstaller.configObject).subscribe(
            (response: any) => {
                let res = response;
                this.loading = false;
                if (!res.success) {
                    for (let e in res.errors) {
                        this.toast.sendAlert('Error with: ' + e, 'error');
                    }
                } else {
                    this.http.post('config/set', this.spiceinstaller.configObject.backendconfig, {}).subscribe(
                        (res: any) => {
                            let response = res;
                            if (response.success == true) {
                                this.configurationService.setSiteData(response.site);
                                this.router.navigate(['/login']);
                            }
                        },
                        (err: any) => {
                            switch (err.status) {
                                case 401:

                                    break;
                            }
                        });
                }
            });
    }
}
