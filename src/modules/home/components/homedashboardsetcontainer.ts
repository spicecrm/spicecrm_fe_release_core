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
 * @module ModuleHome
 */
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {language} from "../../../services/language.service";
import {navigation} from "../../../services/navigation.service";
import {backend} from "../../../services/backend.service";

declare var _;

@Component({
    selector: 'home-dashboardset-container',
    templateUrl: './src/modules/home/templates/homedashboardsetcontainer.html'
})
export class HomeDashboardSetContainer implements AfterViewInit, OnDestroy {

    public componentSubscriptions: any[] = [];
    public dashboardid: string = '';
    public dashboardcontainercomponent: any = undefined;
    public dashboardsList: any[] = [];
    public moreDashboardsList: any[] = [];
    public isLoading: boolean = false;

    @ViewChild('allDashboardsContainer', {
        read: ViewContainerRef,
        static: true
    }) private allDashboardsContainer: ViewContainerRef;
    @ViewChildren('maintabs', {read: ViewContainerRef}) private maintabs: QueryList<any>;
    @ViewChildren('moretabs', {read: ViewContainerRef}) private moretabs: QueryList<any>;
    @ViewChild('moretab', {read: ViewContainerRef, static: false}) private moretab: ViewContainerRef;
    private resizeListener: any;


    constructor(
        private broadcast: broadcast,
        private metadata: metadata,
        private language: language,
        private renderer: Renderer2,
        private navigation: navigation,
        private backend: backend,
        private elementRef: ElementRef,
        private userpreferences: userpreferences) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
        this.loadDashboardConfig();

    }

    public ngOnInit() {
        this.setNavigationHasSubTabValue('Home');
    }

    public ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
        this.resetView();
        if (this.resizeListener) this.resizeListener();
        this.setNavigationHasSubTabValue(undefined);
    }

    public ngAfterViewInit() {
        this.loadDashboards();
    }

    private setNavigationHasSubTabValue(value) {
        this.navigation.hasSubTabs = value;
    }

    private loadDashboards() {
        // set isLoading on timeout to prevent angular change detection error
        window.setTimeout(()=> this.isLoading = true);
        this.loadDashboardSetDashboards().subscribe(res => {
            this.isLoading = false;
            if (res) {
                this.dashboardsList = _.toArray(res);
                if (this.dashboardsList.length > 0) this.setActiveDashboard(this.dashboardsList[0].id);
                window.setTimeout(() => this.handleOverflow());
            }
        });
        this.resizeListener = this.renderer.listen('window', 'resize', e => this.handleOverflow());
    }

    /*
    * Handel role changes and set the role dashboard
    * @returns void
    */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.loadDashboardConfig();
                break;

        }
    }

    /*
    * @returns void
    */
    private loadDashboardConfig() {
        let homeDashboard = this.userpreferences.toUse.home_dashboard || undefined;
        let activeRole = this.metadata.getActiveRole();
        this.dashboardid = homeDashboard || activeRole.default_dashboard || '';

        // set it to the component
        if (this.dashboardcontainercomponent) {
            this.dashboardcontainercomponent.instance.dashboardid = this.dashboardid;
        }
    }

    /*
    * @param container: string
    * @returns void
    */
    private renderView() {

        this.resetView();
        this.metadata.addComponent('DashboardContainer', this.allDashboardsContainer).subscribe(component => {
            component.instance.dashboardid = this.dashboardid;
            component.instance.context = 'Home';

            this.dashboardcontainercomponent = component;
        });
    }

    /*
    * @returns void
    */
    private resetView() {
        if (this.dashboardcontainercomponent) {
            this.dashboardcontainercomponent.destroy();
            this.dashboardcontainercomponent = undefined;
        }
    }

    /*
    * @returns observable
    */
    private loadDashboardSetDashboards() {
        let dashboardSetId = this.userpreferences.toUse.home_dashboardset;
        let config = this.metadata.getComponentConfig('HomeDashboardSetContainer', 'Home');
        let params = {
            limit: -99,
            modulefilter: config.moduleFilter,
            sort: {sortfield: "dashboardsets_dashboard_sequence", sortdirection: "ASC"}
        };

        return this.backend.getRequest(`module/DashboardSets/${dashboardSetId}/related/dashboards`, params);
    }

    /*
    * @param id: dashboardId
    * @returns void
    */
    private setActiveDashboard(dashboardId) {
        this.dashboardid = dashboardId;
        this.renderView();
    }

    /*
    * Handel tabs list overflow items and push the more items.
    * @returns observable
    */
    private handleOverflow() {
        this.moreDashboardsList = [];
        // make sure we set all to hidden
        this.maintabs.forEach(thisitem => {
            thisitem.element.nativeElement.classList.remove('slds-hide');
            thisitem.element.nativeElement.classList.add('slds-hidden');
        });
        this.moretab.element.nativeElement.classList.add('slds-hidden');
        this.moretab.element.nativeElement.classList.remove('slds-hide');

        // get the total width and the more tab with
        let totalwidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        let morewidth = this.moretab.element.nativeElement.getBoundingClientRect().width;
        let showmore = false;

        let usedWidth = 0;
        this.maintabs.forEach((thisitem, itemindex) => {
            let itemwidth = thisitem.element.nativeElement.getBoundingClientRect().width;
            usedWidth += itemwidth;
            if (usedWidth > totalwidth - morewidth) {
                // special handling for last element
                if (showmore || itemindex + 1 < this.maintabs.length || itemwidth > morewidth) {
                    thisitem.element.nativeElement.classList.add('slds-hide');
                    this.moreDashboardsList.push(thisitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value);
                    showmore = true;
                }
            }
            thisitem.element.nativeElement.classList.remove('slds-hidden');
        });

        // handle the more element hidden attribute
        if (showmore) {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');

            this.moretabs.forEach(moreitem => {
                if (this.moreDashboardsList.indexOf(moreitem.element.nativeElement.attributes.getNamedItem('data-dashboard').value) >= 0) {
                    moreitem.element.nativeElement.classList.remove('slds-hide');
                } else {
                    moreitem.element.nativeElement.classList.add('slds-hide');
                }
            });

        } else {
            this.moretab.element.nativeElement.classList.remove('slds-hidden');
            this.moretab.element.nativeElement.classList.add('slds-hide');
        }

    }
}
