/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, Component, OnDestroy, Input, NgZone, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _;

@Component({
    selector: 'field-html',
    templateUrl: './src/objectfields/templates/fieldhtml.html',
})
export class fieldHtml extends fieldGeneric {
    private stylesheetField: string = '';
    private useStylesheets: boolean;
    private useStylesheetSwitcher: boolean;
    private stylesheets: Array<any>;
    private stylesheetToUse: string = '';
    private _cached_html_value; // the cached sanitized html object to prevent "filckering" of the iframe
    private _cached_value; // for change detection reasons...

    @ViewChild('printframe', {read: ViewContainerRef}) printframe: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private zone: NgZone, public sanitized: DomSanitizer, private modal: modal) {
        super(model, view, language, metadata, router);
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (!_.isEmpty(fieldDefs.stylesheet_id_field)) {
            this.stylesheetField = fieldDefs.stylesheet_id_field;
        }
        this.useStylesheets = !_.isEmpty(this.stylesheetField) && !_.isEmpty(this.stylesheets);
        if (this.useStylesheets) {
            if (this.stylesheets.length === 1) {
                this.stylesheetToUse = this.stylesheets[0].id;
            } else if (!_.isEmpty(this.fieldconfig.stylesheetId)) {
                this.stylesheetToUse = this.fieldconfig.stylesheetId;
            } else {
                this.stylesheetToUse = this.metadata.getHtmlStylesheetToUse(this.model.module, this.fieldname);
            }
        }
        this.useStylesheetSwitcher = this.useStylesheets && _.isEmpty(this.stylesheetToUse);
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get htmlValue() {
        // if value changed, generate html value
        if (this.value != this._cached_value) {
            this._cached_html_value = this.sanitized.bypassSecurityTrustHtml(
                '<html><head>' + (this.useStylesheets && !_.isEmpty(this.model.data[this.stylesheetField]) ? '<style>' + this.metadata.getHtmlStylesheetCode(this.model.data[this.stylesheetField]) + '</style>' : '') + '</head><body class="spice">' + this.value + '</body></html>'
            );
            this._cached_value = this.value;
        }
        return this._cached_html_value;
    }

    get stylesheetId(): string {
        if (!_.isEmpty(this.model.data[this.stylesheetField])) {
            return this.model.data[this.stylesheetField];
        }
        return this.stylesheetId = this.stylesheetToUse;
    }

    set stylesheetId(id: string) {
        if (id) {
            this.model.setField(this.stylesheetField, id);
        }
    }

    get asiframe() {
        return this.fieldconfig.asiframe || !_.isEmpty(this.fieldconfig.stylesheetId) || !_.isEmpty(this.stylesheetField) ? true : false;
    }

    private updateField(newVal) {
        // set the model
        this.value = newVal;

        // make sure we propagate the change
        this.zone.run(() => {
        });
    }

    private updateStylesheet(stylesheetId) {
        if (!_.isEmpty(this.stylesheetField) && _.isString(stylesheetId)) {
            this.model.setField(this.stylesheetField, stylesheetId);
        }
    }

    private expand() {
        this.modal.openModal('SystemTinyMCEModal', false).subscribe(componentRef => {
            componentRef.instance.title = this.getLabel();
            componentRef.instance.content = this.value;
            componentRef.instance.stylesheetId = this.stylesheetId;
            componentRef.instance.updateContent.subscribe(update => {
                this.value = update;
            })
        });
    }

    private eventHandler(event) {
        this.value = event.srcElement.innerHTML;
        // console.log(event);
    }

    // Code from fieldlabel.ts
    private getLabel() {
        if (this.fieldconfig.label) {
            if (this.fieldconfig.label.indexOf(':') > 0) {
                let fielddetails = this.fieldconfig.label.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels)
            } else {
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels)
            }
        } else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig, this.view.labels)
        }
    }

    private print() {
        this.printframe.element.nativeElement.contentWindow.print();
    }

}