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
    OnDestroy
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
export class SpiceKanban implements OnDestroy {
    @ViewChild('kanbanContainer', {read: ViewContainerRef, static: true}) private kanbanContainer: ViewContainerRef;

    private componentconfig: any = {};
    private modellistsubscribe: any = undefined;
    private requestedFields: string[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private configuration: configurationService, private metadata: metadata, private userpreferences: userpreferences, private language: language, private currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.model.module);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        this.requestedFields = ['name', 'account_name', 'account_id', 'sales_stage', 'amount_usdollar', 'amount'];
        this.modellist.getListData(this.requestedFields);

        this.currencies = this.currency.getCurrencies();

    }

    /**
     * returns teh stages for the module from teh configuration service
     */
    get stages() {
        try {
            return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];
        } catch (e) {
            return [];
        }
    }

    private getStageData(stage): any {
        let stagedata = [];
        this.stages.some(thisStage => {
            if (stage == thisStage.stage) {
                stagedata = thisStage.stagedata;
                return;
            }
        });
        return stagedata;
    }

    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    private switchListtype() {
        let requestedFields = [];
        this.modellist.getListData(this.requestedFields);
    }

    private showSum() {
        return this.componentconfig.sum !== '';
    }

    get sizeClass() {
        return 'slds-size--1-of-' + this.stages.length;
    }

    private getStageCount(stage) {
        let stageData = this.getStageData(stage);
        let count = 0;
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0)
                count++;
        }
        return count;
    }

    private getStageSum(stage) {
        let stageData = this.getStageData(stage);
        let sum = 0;
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0) {
                sum += parseFloat(item[this.componentconfig.sum]);
            }
        }
        return this.userpreferences.formatMoney(sum, 0);
    }

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

    private getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    private onScroll(e) {
        let element = this.kanbanContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
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
