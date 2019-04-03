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
 * @module ModuleDashboard
 */
import {Component, ElementRef, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-view',
    templateUrl: './src/modules/dashboard/templates/dashboardview.html',
    providers: [model, modellist, dashboardlayout]
})
export class DashboardView implements OnInit {

    private panelwidth = 250;
    private showpanel: boolean = false;

    constructor(private navigation: navigation, private language: language, private dashboardlayout: dashboardlayout, private userpreferences: userpreferences, private model: model, private modellist: modellist, private elementRef: ElementRef) {

    }

    get ismobile() {
        return window.innerWidth < 1024;
    }

    get dashboardstyle() {
        return {
            width: 'calc(100% - ' + (this.ismobile ? 0 : this.panelwidth) + 'px)'
        };
    }

    get panelstyle() {
        return {
            'width': this.panelwidth + 'px',
            'z-index': 1,
            'left': this.ismobile && !this.showpanel ? '-250px' : '0px'
        };
    }

    public ngOnInit() {
        // load for the selector
        let lastDashboard = this.userpreferences.getPreference('last_dashboard');
        this.model.module = 'Dashboards';
        this.modellist.module = 'Dashboards';
        this.modellist.getListData(['name', 'global'])
            .subscribe(listdata => {
                if (lastDashboard) {
                    this.modellist.listData.list.some(dashboard => {
                        if (dashboard.id == lastDashboard) {
                            this.dashboardlayout.loadDashboard(lastDashboard);
                            return true;
                        }
                    });
                }
            });

        this.navigation.setActiveModule('Dashboards');
    }

    private tooglepanel() {
        this.showpanel = !this.showpanel;
    }
}
