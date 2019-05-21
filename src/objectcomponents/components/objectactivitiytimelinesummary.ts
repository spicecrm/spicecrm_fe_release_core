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
 * @module ObjectComponents
 */
import {
    Component, OnDestroy, ViewChild, ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a timeline summary with all activities from the parent record. Activities are on the left hand side, details on teh right hand side
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummary.html',
    providers: [activitiyTimeLineService, model]
})
export class ObjectActivitiyTimelineSummary implements OnDestroy {
    /**
     * a reference to the list container. Required to have a scroll handle and do the infinite scrolling
     */
    @ViewChild('listContainer', {read: ViewContainerRef}) private listContainer: ViewContainerRef;

    /**
     * the module of the selcted activitis
     */
    private activitymodule: string;

    /**
     * the id of the current selcted activitiy
     */
    private activityid: string;

    /**
     * the data of the current selcted activitiy
     */
    private activitydata: any;

    /**
     * a subscription to cath the loading event
     */
    private subscription: any;

    private componentconfig: any;

    constructor(private metadata: metadata, private parent: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute, private layout: layout) {

        // check the componentconfig wether to use fts or not
        this.componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineSummary');
        if (this.componentconfig.usefts) this.activitiyTimeLineService.usefts = true;

        this.activatedRoute.params.subscribe(params => this.initialize(params));

        this.subscription = this.activitiyTimeLineService.loading$.subscribe(loading => this.clearActivitiy());
    }

    /**
     * handles the destory and unsubscribes from the activitiy service
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * loads the activities for the parent module
     */
    get activities() {
        return this.activitiyTimeLineService.activities.History.list;
    }

    /**
     * a helper function that queries the layout service to not display a spülit screen on small devices. This shoudl not be done by media queries so the cmponent is not even rendered at all and kept hidden with an ngIf
     */
    get displayDetailsPane() {
        return this.layout.screenwidth != 'small';
    }

    get searchterm() {
        return this.activitiyTimeLineService.filters.searchterm;
    }

    set searchterm(seacrhterm) {
        this.activitiyTimeLineService.filters.searchterm = seacrhterm;
        this.activitiyTimeLineService.reload();
    }

    /**
     * reloads the list
     */
    private reload() {
        this.activitiyTimeLineService.reload();
    }

    /**
     * initializes when the activated Route returns the promise in the constructor
     *
     * @param params the Route Params returned
     */
    private initialize(params: Params) {
        // get the bean details
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.parent.getData(true, '', true);

        this.activitiyTimeLineService.parent = this.parent;
        this.activitiyTimeLineService.defaultLimit = 25;
        this.activitiyTimeLineService.modules = ['History'];
        this.activitiyTimeLineService.reload();
    }

    /**
     * handles scrolling
     *
     * @param e the event emitted from teh DOM element
     */
    private onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if (this.activitiyTimeLineService.canLoadMore('History')) {
                this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
            }
        }
    }

    /**
     * gets the proper date field for the activits
     *
     * @param activity the activitiy itself
     */
    private getDate(activity) {

        let dateField = 'date_start';
        switch (activity.module) {
            case 'Tasks':
                dateField = 'date_due';
                break;
            case 'Emails':
            case 'Notes':
                dateField = 'date_entered';
                break;
        }

        let date: Date = new moment(Date.parse(activity.data[dateField]));
        return date.format('DD.MM.YYYY');
    }

    /**
     * triggers setting the activitiy and thus updating the form on the right side with the activitiy content and details
     *
     * @param activity the activity
     */
    private setActivitiy(activity) {
        this.activitymodule = activity.module;
        this.activityid = activity.id;
        this.activitydata = activity.data;
    }

    /**
     * clears the active activitiy
     */
    private clearActivitiy() {
        this.activitymodule = '';
        this.activityid = '';
        this.activitydata = '';
    }

    /**
     * navigates to the parent model record. Used in the breadcrumbs
     */
    private goModel() {
        this.parent.goDetail();
    }

    /**
     * navigates to the parent module. Used in the breadcrumbs
     */
    private goModule() {
        this.parent.goModule();
    }
}
