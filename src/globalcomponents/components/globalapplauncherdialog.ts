/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialog.html'
})
export class GlobalAppLauncherDialog {

    private searchTerm: string = '';
    public self: any = undefined;

    constructor(
        private metadata: metadata,
        private language: language,
        private router: Router,
        private broadcast: broadcast
    ) {
    }

    get showRoles() {
        return this.metadata.getRoles().length > 1;
    }

    private close() {
        this.self.destroy();
    }

    private getRoleName() {
        return this.metadata.getActiveRole().name;
    }

    private getRoles() {
        return this.metadata.getRoles();
    }

    private setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.close();
    }

    private getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0))) {
                menuItems.push(module);
            }
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });

        return menuItems;
    }

    private gotoModule(module) {
        this.router.navigate(['/module/' + module]);
        this.close();
    }
}