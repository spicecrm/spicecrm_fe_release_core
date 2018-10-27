/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, OnInit, Input} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-tabbed-details',
    templateUrl: './src/objectcomponents/templates/objectrecordtabbeddetails.html',
    // providers: [view]
    styles: [
        '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectRecordTabbedDetails implements OnInit{

    componentconfig: any = {};
    activeTab: number = 0
    activatedTabs: Array<number> = [0];
    componentTabs: Array<any> = [];

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language) {
        this.view.isEditable = true;
    }

    get tabs(){
        return this.componentTabs ? this.componentTabs : [];
    }

    ngOnInit(){
        if (!this.componentconfig.tabs) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordTabbedDetails', this.model.module);
            this.componentTabs = componentconfig.tabs;
        } else {
            this.componentTabs = this.componentconfig.tabs;
        }
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    checkRenderTab(tabindex){
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1;
    }

    showTab(tabindex) {

        if (tabindex === this.activeTab)
            return  true;
        else
            return false;

    }

    getDisplay(tabindex) {

        if (tabindex !== this.activeTab)
            return {
                display: 'none'
            };

    }

    cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    showErrorsOnTab( tabindex, nrErrors ) {
        this.componentTabs[tabindex].hasErrors = nrErrors;
    }

}