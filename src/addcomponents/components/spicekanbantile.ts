/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, AfterViewInit, ViewChild, ViewContainerRef, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modellist} from '../../services/modellist.service';
import {modelutilities} from '../../services/modelutilities.service';
import {broadcast} from '../../services/broadcast.service';
import {spiceprocess} from '../services/spiceprocess';

@Component({
    selector: '[spice-kanban-tile]',
    templateUrl: './src/addcomponents/templates/spicekanbantile.html',
    providers: [model, view],
    host: {
        '[class]': "'slds-item'",
        '(dragstart)': "ondragstart($event)",
        '(drop)': "ondrop($event)"
    }
})
export class SpiceKanbanTile implements OnInit, OnDestroy {
    @Input() item: any = {};
    componentconfig: any = {};
    componentFields: any = {};
    dropsubscription: any = {};

    constructor(private broadcast: broadcast, private modellist: modellist, private model: model, private view: view, private modelutilities: modelutilities, private metadata: metadata, private spiceprocess: spiceprocess) {
        this.componentconfig = this.metadata.getComponentConfig('SpiceKanbanTile', this.modellist.module);
        this.componentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        this.dropsubscription =  this.spiceprocess.drop$.subscribe(dropdata => {this.handelDrop(dropdata)});

        // display short labels
        this.view.labels = 'short';
    }

    ngOnDestroy(){
        this.dropsubscription.unsubscribe();
    }

    handelDrop(dropdata){
        if(dropdata.id == this.model.id){
            this.model.startEdit()
            this.model.data.sales_stage = dropdata.stage;
            this.model.edit();
        }
    }

    ngOnInit() {
        // initialize the model
        this.model.module = this.modellist.module;
        this.model.id = this.item.id;
        this.model.data = this.modelutilities.backendModel2spice(this.modellist.module, this.item);
    }

    goDetail() {
        this.model.goDetail();
    }

    ondragstart(ev) {
        ev.dataTransfer.setData("text", this.model.id);
    }

    allowDrop(ev) {
        ev.preventDefault();
    }
    dragleave(ev) {
        ev.preventDefault();
    }

    ondrop(ev){
        let data = ev.dataTransfer.getData("text");
        this.spiceprocess.dropitem(data, this.model.data.sales_stage);
    }

}