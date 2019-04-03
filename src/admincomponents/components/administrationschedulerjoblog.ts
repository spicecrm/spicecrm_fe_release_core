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
 * @module AdminComponentsModule
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";
import {Subscription} from "rxjs";

/**
* @ignore
*/
declare var _;
/**
* @ignore
*/
declare var moment;

@Component({
    selector: 'administration-scheduler-jobs-enum',
    templateUrl: './src/admincomponents/templates/administrationschedulerjoblog.html',
    providers: [relatedmodels]
})
export class AdministrationSchedulerJobLog implements OnInit, OnDestroy {
    public schedulerLogs: any[] = [];
    private isLoading: boolean = false;
    private subscription: Subscription = new Subscription();

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public elementRef: ElementRef,
                public userpreferences: userpreferences,
                public backend: backend) {
        this.subscription = this.broadcast.message$.subscribe(res => {
            if (res.messagetype == 'scheduler.run') {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.getData();
    }

    public getData() {
        let params = {
            start: 0,
            limit: 10
        };
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = _.values(response);
                    this.schedulerLogs.sort((a, b) => {
                        return a.execute_time > b.execute_time ? -1 : 0;
                    });
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    public getMoreData() {
        let params = {
            start: this.schedulerLogs.length,
            limit: 10
        };
        this.isLoading = true;
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", params)
            .subscribe(
                (response: any) => {
                    this.schedulerLogs = [...this.schedulerLogs, ..._.values(response)];
                    this.schedulerLogs.sort((a, b) => {
                        return a.execute_time > b.execute_time ? -1 : 0;
                    });
                    this.isLoading = false;
                }, err => this.isLoading = false);
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private getResolutionClass(status) {
        switch (status) {
            case 'failure':
                return 'slds-text-color_error';
            case 'success':
                return 'slds-text-color_success';
            default:
                return 'slds-text-color--default';
        }
    }

    private displayDateValue(date) {
        if (!date) {
            return '';
        }
        date = moment(date).tz(moment.tz.guess());
        date.add(date.utcOffset(), "m");
        return date.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

    private trackByFn(index, item) {
        return item.id;
    }
}