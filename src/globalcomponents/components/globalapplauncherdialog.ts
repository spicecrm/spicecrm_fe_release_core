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
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialog.html',
    host: {
        'class': 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncherDialog {

    searchTerm: string = '';
    self: any = undefined;
    toggleShowRoles: boolean = true;
    toggleShowModules: boolean = true;

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

    toggleShow(section) {
        switch (section){
            case 'roles':
                this.toggleShowRoles = !this.toggleShowRoles;
                break;
            case 'modules':
                this.toggleShowModules = !this.toggleShowModules;
                break;
        }
    }

    hideAppLauncher() {
        this.self.destroy();
    }

    getRoleName() {
        return this.metadata.getActiveRole().name;
    }

    getRoleLabel(roleid, label) {
        let roles = this.getRoles();
        let role = undefined;
        roles.some(thisrole => {
            if (thisrole.id == roleid) {
                role = thisrole;
                return true;
            }
        });

        if (role.label && role.label != '') {
            switch (label) {
                case 'identifier':
                    return this.language.getAppLanglabel(role.label, 'short');
                case 'name':
                    return this.language.getAppLanglabel(role.label);
                case 'description':
                    return this.language.getAppLanglabel(role.label, 'long');
            }
        } else {
            return role[label];
        }
    }

    getRoles() {
        return this.metadata.getRoles();
    }

    setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        // this.router.navigate(['/module/Home']);
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.hideAppLauncher();
    }

    getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0)))
                menuItems.push(module);
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });

        return menuItems;
    }

    gotoModule(module) {
        this.hideAppLauncher();
        this.router.navigate(['/module/' + module]);
    }
}