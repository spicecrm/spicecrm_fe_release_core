/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {DomSanitizer} from '@angular/platform-browser';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-action-output-bean-modal',
    templateUrl: './src/objectcomponents/templates/objectactionoutputbeanmodal.html',
    providers: [model, view],
})
export class ObjectActionOutputBeanModal {

    self: any = undefined;
    templates = [];
    private _selected_template = null;
    compiled_selected_template: string = '';

    loading_output: boolean = false;

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private view: view,
        private backend: backend,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {
        let params = {
            searchfields:
                {
                    join: 'AND',
                    conditions: [
                        {field: 'module_name', operator: '=', value: this.model.module}
                    ]
                }
        };

        this.backend.all('OutputTemplates', params).subscribe(
            (data: any) => {
                this.templates = data;
            }
        );
    }

    set selected_template(val) {
        this.loading_output = true;
        this._selected_template = val;
        // compile the template to show the user...
        this.backend.getRequest(`OutputTemplates/${this.selected_template.id}/compile/${this.model.id}`).subscribe(
            res => {
                this.compiled_selected_template = res.content;
                this.loading_output = false;
            },
            err => {
                this.loading_output = true;
            }
        );
    }

    get selected_template() {
        return this._selected_template;
    }

    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template)
    }

    close() {
        this.self.destroy();
    }

    download() {
        let fileName = this.model.module + '_' + this.model.data.summary_text + '.pdf';
        this.modal.openModal('SystemLoadingModal').subscribe(loadingCompRef => {
            loadingCompRef.instance.messagelabel = 'MSG_GENERATING_PDF';
            this.backend.downloadFile(
                {
                    route: `OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf`
                }, fileName
            ).subscribe(
                next => {
                    loadingCompRef.instance.self.destroy();
                },
                err =>{
                    loadingCompRef.instance.self.destroy();
                }
            );

        })
    }
}