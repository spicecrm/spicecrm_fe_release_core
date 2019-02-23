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
    AfterViewInit,
    OnInit,
    ComponentFactoryResolver,
    Component,
    ViewChild,
    ViewContainerRef,
    Renderer2, OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details',
    templateUrl: './src/objectcomponents/templates/objectrecorddetails.html',
    providers: [view]
})
export class ObjectRecordDetails implements OnInit {
    private componentSet: string = '';
    private componentconfig: any = {};

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language, private renderer: Renderer2) {
        this.view.isEditable = true;

        this.buildContainer();
    }

    public ngOnInit() {
        // check if readonly
        if (this.componentconfig.readonly) {
            this.view.isEditable = false;
        }
    }

    private buildContainer() {
        // if we do not have a coimponentset from external check the default config
        if (!this.componentconfig.componentset) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        } else {
            this.componentSet = this.componentconfig.componentset;
        }
    }

    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    private save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    private getBoxStyle() {
        if (this.view.isEditMode()) {
            return {
                'box-shadow': '0 2px 4px 4px rgba(0,0,0,.16)',
                'border-radius': '.25rem'
            };
        } else if (this.componentconfig.displayborder) {
            return {
                'border': '1px solid #dddbda',
                'border-radius': '.25rem'
            };
        }
    }

    get showHeader() {
        return this.componentconfig.header ? true : false;
    }

    get header() {
        return this.language.getLabel(this.componentconfig.header, this.model.module);
    }
}
