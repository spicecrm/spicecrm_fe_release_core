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
    Component,
    ElementRef, Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';
import {ObjectListViewFilterPanelExportTargetlist} from "./objectlistviewfilterpanelexporttargetlist";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'object-listview-filter-panel-export-button',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelexportbutton.html',
})
export class ObjectListViewFilterPanelExportButton {

    exportfilterOpen: boolean = false;
    clickListener: any;


    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private modal: modal, private renderer: Renderer2, private backend: backend) {
    }

    toggleFilterOpen(event) {

        event.stopPropagation();
        event.preventDefault();

        this.exportfilterOpen = !this.exportfilterOpen;

        // toggle the listener
        if (this.exportfilterOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }


    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.exportfilterOpen = false;
        }
    }

    get exportdisabled(){
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    export() {
        this.exportfilterOpen = false;

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            let params = {
                listid: this.modellist.currentList.id,
                sortfield: this.modellist.sortfield,
                sortdirection: this.modellist.sortdirection,
                fields: JSON.stringify(this.modellist.lastFields)
            }

            // generate filename
            let filename = this.model.module + '_' + this.modellist.currentList.name + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';

            this.backend.downloadFile({
                route: '/module/' + this.model.module + '/export',
                method: "POST",
                body: params
            }, filename).subscribe(loaded =>{
                loadingRef.instance.self.destroy();
            });
        });

    }

    exportTargetList() {
        this.exportfilterOpen = false;
        this.modal.openModal('ObjectListViewFilterPanelExportTargetlist').subscribe(modalRef => {
            modalRef.instance.listId = this.modellist.currentList.id;
        });
    }

}