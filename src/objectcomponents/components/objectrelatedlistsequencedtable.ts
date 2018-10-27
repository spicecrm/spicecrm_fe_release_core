/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, AfterViewInit, OnInit, OnDestroy, Input, ChangeDetectionStrategy} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';
import {ObjectRelatedlistTable} from './objectrelatedlisttable';

@Component({
    selector: 'object-relatedlist-sequenced-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistsequencedtable.html'
})
export class ObjectRelatedlistSequencedTable extends ObjectRelatedlistTable {

    @Input() sequencefield: string = 'sequence_number';

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public router: Router, private backend: backend, private broadcast: broadcast) {
        super(language, metadata, relatedmodels, model, router);
    }

    get displayfields(){
        let displayfields = [];
        for(let listfield of this.listfields){
            if(listfield.fieldconfig.default){
                displayfields.push(listfield);
            }
        }
        return displayfields;
    }

    dragstart(event, item) {
        event.dataTransfer.setData("text", item.id)
    }

    dragover(event, item) {
        var data = event.dataTransfer.getData("text");
        if (data != item.id)
            event.preventDefault();
    }

    drop(event, targetitem) {
        var sourceID = event.dataTransfer.getData("text");

        // build an internal array with ids and sequence
        let itemsArray = [];
        for(let item of this.relatedmodels.items){
            itemsArray.push({id: item.id, sequence: parseInt(item[this.sequencefield])});
        }

        // sort the Array
        itemsArray.sort((a, b) => {
            return a.sequence > b.sequence ? 1 : -1;
        });

        // get the indexes of the two records
        let sourceitem = {};
        itemsArray.some((item, index) => {
            if(item.id == sourceID){
                sourceitem = itemsArray.splice(index, 1);
                return true;
            }
        })

        // get the current source element
        itemsArray.some((item, index) => {
            if(item.id == targetitem.id){
                itemsArray.splice(index, 0, sourceitem[0]);
                return true;
            }
        })

        // get the droptarget and
        let currentIndex = 0; let indexObj = {}; let updateArray = [];
        for(let item of itemsArray){
            indexObj[item.id] = currentIndex;
            updateArray.push({id: item.id, sequence_number: currentIndex});
            currentIndex++;
        }

        // transverse array to object
        for(let item of this.relatedmodels.items){
            item[this.sequencefield] = indexObj[item.id];
        }

        // resort the array
        this.relatedmodels.items.sort((a, b) => {
            return parseInt(a[this.sequencefield]) > parseInt(b[this.sequencefield]) ? 1 : -1;
        })

        // send to the backen saving the models
        this.backend.postRequest('/module/'+this.relatedmodels.relatedModule, {}, updateArray).subscribe(updated => {
            console.log('updated models');
            for(let modeldata of updated){
                this.broadcast.broadcastMessage('model.save', {
                    id: modeldata.id,
                    module: this.relatedmodels.relatedModule,
                    data: modeldata.data
                });
            }
        });
    }

}