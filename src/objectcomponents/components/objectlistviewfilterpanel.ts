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
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';

@Component({
    selector: 'object-listview-filter-panel',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanel.html',
    providers: [listfilters]
})
export class ObjectListViewFilterPanel {

    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private renderer: Renderer2) {
        this.setBaseFilter();
        this.modellist.listtype$.subscribe(newlist => this.setBaseFilter());
    }

    setBaseFilter() {
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();

        this.listfilters.filters = this.modellist.getFilterDefs();
        this.listfilters.loadedFilters = this.modellist.getFilterDefs();
    }

    isChanged() {
        return this.listfilters.isDirty();
    }

    save() {
        this.modellist.updateListType({
            basefilter: this.listfilters.basefilter,
            filterdefs: btoa(JSON.stringify(this.listfilters.filters))
        }).subscribe(retval => {
            this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();
            this.listfilters.loadedFilters = this.modellist.getFilterDefs();
        });
    }

    cancel() {
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.filters = this.modellist.getFilterDefs();
    }

    addFilter() {
        this.listfilters.filters.push({
            id: this.model.generateGuid(),
            field: '',
            operator: '',
            filtervalue: ''
        })
    }

    removeAllFilters() {
        this.listfilters.filters = [];
    }

    getPanelStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        }
    }
}