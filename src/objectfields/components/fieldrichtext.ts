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
 * @module ObjectFields
 */
import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {broadcast} from "../../services/broadcast.service";
import {Subscription} from "rxjs";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";

declare var _;

@Component({
    selector: 'field-richtext',
    templateUrl: './src/objectfields/templates/fieldrichtext.html',
})
export class fieldRichText extends fieldGeneric implements OnDestroy {
    private stylesheetField: string = '';
    private useStylesheets: boolean;
    private useStylesheetSwitcher: boolean;
    private stylesheets: any[];
    private stylesheetToUse: string = '';
    private subscription: Subscription = new Subscription();

    @ViewChild('printframe', {read: ViewContainerRef, static: true}) private printframe: ViewContainerRef;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public broadcast: broadcast,
                public sanitized: DomSanitizer) {
        super(model, view, language, metadata, router);
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
        this.modelChangesSubscriber();
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get htmlValue() {
        return this.sanitized.bypassSecurityTrustHtml(this.value);
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

    public ngOnInit() {
        this.setStylesheetField();
        this.setStylesheetsToUse();
        this.setHtmlValue();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private modelChangesSubscriber() {
        this.broadcast.message$.subscribe(msg => {
            switch (msg.messagetype) {
                case 'model.save':
                case 'model.loaded':
                    this.setHtmlValue();
            }
        });
    }

    private setStylesheetField() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (!_.isEmpty(fieldDefs.stylesheet_id_field)) {
            this.stylesheetField = fieldDefs.stylesheet_id_field;
        }
    }

    private setStylesheetsToUse() {
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

    private setHtmlValue() {
        let regexp = /<code>[\s\S]*?<\/code>/g;
        let match = regexp.exec(this.value);
        while (match != null) {
            this.value = this.value
                .replace(match, this.encodeHtml(match))
                .replace('&lt;code&gt;', '<code>')
                .replace('&lt;/code&gt;', '</code>');
            match = regexp.exec(this.value);
        }
    }

    private encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private updateStylesheet(stylesheetId) {
        if (!_.isEmpty(this.stylesheetField) && _.isString(stylesheetId)) {
            this.model.setField(this.stylesheetField, stylesheetId);
        }
    }

    private save(content) {
        let toSave = {
            date_modified: this.model.data.date_modified,
            [this.fieldname]: content
        };
        this.backend.save(this.model.module, this.model.id, toSave)
            .subscribe(
                (res: any) => {
                    this.model.endEdit();
                    this.model.data.date_modified = res.date_modified;
                    this.value = res[this.fieldname];
                    this.model.startEdit();
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                } ,
                error => this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message)
            );
    }
}
