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
 * @module ModuleSpicePath
 */
import {
    Component,
    Pipe,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {currency} from '../../../services/currency.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'spice-kanban',
    templateUrl: './src/include/spicepath/templates/spicekanban.html'
})
export class SpiceKanban implements OnInit, OnDestroy {
    @ViewChild('kanbanContainer', {read: ViewContainerRef, static: true}) private kanbanContainer: ViewContainerRef;

    private componentconfig: any = {};
    private modellistsubscribe: any = undefined;
    private requestedFields: string[] = [];
    private stages: any[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private configuration: configurationService, private metadata: metadata, private userpreferences: userpreferences, private language: language, private currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.model.module);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        this.currencies = this.currency.getCurrencies();

    }

    /**
     * load ths stage data and build the buckts we are searching for to build the kanban board
     */
    public ngOnInit() {
        let confData = this.configuration.getData('spicebeanguides')[this.model.module];
        let stages = confData.stages;

        let bucketitems = [];
        for (let stage of stages) {
            // if not in kanban continue
            if (stage.stagedata.not_in_kanban == '1') continue;

            // push to stages
            this.stages.push(stage);

            // push the bucket item
            bucketitems.push({
                bucket: stage.stagedata.secondary_stage ? stage.stagedata.stage + ' ' + stage.stagedata.secondary_stage : stage.stage,
                value: 0,
                items: 0
            });
        }

        this.requestedFields = ['name', 'account_name', 'account_id', 'sales_stage', 'amount_usdollar', 'amount'];

        this.modellist.buckets = {
            bucketfield: confData.statusfield,
            bucketitems: bucketitems
        }

        // set limit to 10 .. since this is retrieved bper stage
        this.modellist.loadlimit = 10;

        this.modellist.getListData(this.requestedFields, false);
    }

    /**
     * destry any subscriptuon and reset the modellist buckets
     */
    public ngOnDestroy() {
        // unsubscribe
        this.modellistsubscribe.unsubscribe();

        // reset buckets
        this.modellist.buckets = {};
    }

    /**
     * gets the data for a given stage
     *
     * @param stage the stage
     */
    private getStageData(stage): any {
        let stagedata = this.stages.find(thisStage => stage == thisStage.stage);
        return stagedata.stagedata;
    }


    private switchListtype() {
        let requestedFields = [];
        this.modellist.getListData(this.requestedFields);
    }

    /**
     * a getter retruning if the sum should be shown
     */
    get showSum() {
        return this.componentconfig.sum !== '';
    }

    /**
     * the size class
     */
    get sizeClass() {
        return 'slds-size--1-of-' + this.stages.length;
    }

    /**
     * get the count from the bucket in the modellist
     *
     * @param stagedata
     */
    private getStageCount(stagedata) {
        let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
        let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);
        return item ? item.total : 0;
    }

    /**
     * get the sum for the stage bucket
     *
     * @param stagedata
     */
    private getStageSum(stagedata) {
        let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
        let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);

        return item && item.value ? this.userpreferences.formatMoney(item.value, 0) : 0;
    }

    /**
     * get all items for a stage
     *
     * @param stage
     */
    private getStageItems(stage) {
        let stageData = this.getStageData(stage);
        let items: any[] = [];
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0) {
                items.push(item);
            }
        }
        return items;
    }

    /**
     * format the number as money
     *
     * @param amount the amount
     */
    private getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    /**
     * react to the scroll event and if possible reload the list
     *
     * @param e
     */
    private onScroll(e) {
        let element = this.kanbanContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {

            // check if there are still buckets that have potentially more items
            let loadmore = false;
            for (let bucket of this.modellist.buckets.bucketitems) {
                if (bucket.total > bucket.items) {
                    loadmore = true;
                    break;
                }
            }

            if (loadmore) {
                this.modellist.loadMoreList();
            }
        }
    }

    /**
     * returns the name for the stage to be displayed
     *
     * @param stagedata
     */
    private getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return this.language.getLabel(stagedata.stage_label);
        } else {
            return stagedata.stage_name;
        }
    }

    /**
     * helper to get the currency symbol
     */
    private getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;

        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }
}
