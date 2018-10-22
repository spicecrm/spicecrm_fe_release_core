/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'dashboard-view',
    templateUrl: './src/modules/dashboard/templates/dashboardview.html',
    providers: [model, modellist]
})
export class DashboardView implements OnInit {

    @ViewChild('dashboardcontainer', {read: ViewContainerRef}) dashboardcontainer: ViewContainerRef;

    currentDashboard: string = '';
    currentComponent: any = null;

    dashboardFilter: string = '';

    constructor(private metadata: metadata, private userpreferences: userpreferences, private navigation: navigation, private language: language, private renderer: Renderer2, private elementRef: ElementRef, private model: model, private modellist: modellist) {

    }

    ngOnInit() {
        let lastDashboard = this.userpreferences.getPreference('last_dashboard');
        if (lastDashboard)
            this.currentDashboard = lastDashboard;

        this.model.module = 'Dashboards';
        this.modellist.module = 'Dashboards';
        this.modellist.getListData(['name', 'global']).subscribe(listdata => {
            if (this.currentDashboard) {
                this.modellist.listData.list.some(dashboard => {
                    if (dashboard.id == this.currentDashboard) {
                        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
                            this.currentComponent = component;
                            component.instance['dashboardid'] = this.currentDashboard;
                            component.instance['editable'] = true;
                        })
                        return true;
                    }
                })
            }
        });

        this.navigation.setActiveModule('Dashbords');
    }

    get dashboards(): Array<any> {
        let dashboards: Array<any> = [];
        for (let dashboard of this.modellist.listData.list) {
            if (dashboard.id == this.currentDashboard || this.dashboardFilter == '' || (this.dashboardFilter != '' && dashboard.name.toLowerCase().indexOf(this.dashboardFilter.toLowerCase()) != -1)) {
                dashboards.push(dashboard);
            }
        }
        return dashboards;
    }

    get viewStyle() {
        return {
            height: 'calc(100vh - ' + this.elementRef.nativeElement.getBoundingClientRect().top + 'px)'
        };
    }

    getActiveClass(id) {
        return id == this.currentDashboard ? 'slds-is-active' : '';
    }

    setDashboard(id) {
        this.currentDashboard = id;

        // save the preference
        this.userpreferences.setPreference('last_dashboard', id);

        if (this.currentComponent)
            this.currentComponent.destroy();

        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
            this.currentComponent = component;
            component.instance['dashboardid'] = id;
            component.instance['editable'] = true;
        })

    }

    addDashboard() {
        this.model.module = 'Dashboards';
        this.model.addModel();
    }

}