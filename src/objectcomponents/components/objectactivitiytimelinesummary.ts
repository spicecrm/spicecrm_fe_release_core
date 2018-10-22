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
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

declare var moment: any;

@Component({
    selector: 'object-activitiytimeline-summary',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummary.html',
    providers: [model]
})
export class ObjectActivitiyTimelineSummary{
    @ViewChild('listContainer', {read: ViewContainerRef}) listContainer: ViewContainerRef;
    @ViewChild('detailContainer', {read: ViewContainerRef}) detailContainer: ViewContainerRef;
    showSummary: boolean = false;
    componentRefs: Array<any> = [];

    constructor(private metadata: metadata, private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService) {
    }

    get activities(){
        return this.activitiyTimeLineService.activities.History.list;
    }

    displaySummary() {
        this.showSummary = true;
        if(this.activitiyTimeLineService.activities.History.list.length < 25 && this.activitiyTimeLineService.canLoadMore('History'))
            this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
    }

    onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if(this.activitiyTimeLineService.canLoadMore('History'))
                this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
        }
    }

    hideSummary() {
        this.showSummary = false;
    }

    getDate(activity) {

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

    setActivitiy(activity) {
        this.model.module = activity.module;
        this.model.id = activity.id;
        this.model.data = activity.data;

        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineSummary', activity.module);
        if (componentconfig && componentconfig.componentsets) {
            for (let componentSet of componentconfig.componentsets) {
                for (let view of this.metadata.getComponentSetObjects(componentSet)) {
                    this.metadata.addComponent(view.component, this.detailContainer).subscribe(componentRef => {
                        componentRef.instance['componentconfig'] = view.componentconfig;
                        this.componentRefs.push(componentRef);
                    })
                }
            }
        }

    }
}