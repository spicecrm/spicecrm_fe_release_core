/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    Injectable,
    Pipe,
    PipeTransform,
    Input,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {broadcast} from '../../services/broadcast.service';
import {spiceprocess} from '../services/spiceprocess';
import {userpreferences} from '../../services/userpreferences.service';


@Pipe({name: 'spicekanbanstagepipe'})
export class SpiceKanbanStagePipe {
    constructor(private spiceprocess: spiceprocess){}
    transform(values, stage) {
        let retValues = [];
        let stageData = this.spiceprocess.getStageData(stage);
        for(let value of values){
            if (value[stageData.statusfield] && value[stageData.statusfield].indexOf(stage) == 0)
                retValues.push(value);
        }
        return retValues;
    }
}

@Component({
    selector: 'spice-kanban',
    templateUrl: './src/addcomponents/templates/spicekanban.html',
    providers: [spiceprocess]
})
export class SpiceKanban implements OnDestroy {
    @ViewChild('oppContainer', {read: ViewContainerRef}) oppContainer: ViewContainerRef;
    componentconfig: any = {};
    modellistsubscribe: any = undefined;
    requestedFields: Array<string> = [];

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private spiceprocess: spiceprocess, private metadata: metadata, private userpreferences: userpreferences ) {
        this.spiceprocess.module = this.model.module;
        this.spiceprocess.getStages();

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.model.module);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        this.requestedFields = ['name', 'account_name', 'account_id', 'sales_stage', 'amount_usdollar', 'amount'];
        this.modellist.getListData(this.requestedFields);

    }

    ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    switchListtype() {
        let requestedFields = [];
        this.modellist.getListData(this.requestedFields);
    }

    showSum() {
        return this.componentconfig.sum !== '';
    }

    getContainerStyle() {
        let rect = this.oppContainer.element.nativeElement.getBoundingClientRect();
        return {
            'margin-right': '-12px',
            'padding-right': '6px',
            'height' : 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    get sizeClass(){
        return 'slds-size--1-of-' +  this.spiceprocess.stages.length;
    }

    getColumnStyle() {
        let rect = this.oppContainer.element.nativeElement.getBoundingClientRect();
        return {
            width: rect.width / this.spiceprocess.stages.length
        }
    }

    getStageCount(stage) {
        let stageData = this.spiceprocess.getStageData(stage);
        let count = 0;
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0)
                count++;
        }
        return count;
    }

    getStageSum(stage) {
        let stageData = this.spiceprocess.getStageData(stage);
        let sum = 0;
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0)
                sum += parseFloat(item[this.componentconfig.sum]);
        }
        return this.userpreferences.formatMoney(sum, 0);
    }

    getStageItems(stage) {
        let stageData = this.spiceprocess.getStageData(stage);
        let items: Array<any> = [];
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0)
                items.push(item);
        }
        return items;
    }

    getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    onScroll(e) {
        let element = this.oppContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    ondragover(ev) {
        ev.preventDefault();
    }

    ondrop(ev, stage){
        let data = ev.dataTransfer.getData("text");
        this.spiceprocess.dropitem(data, stage);
    }
}