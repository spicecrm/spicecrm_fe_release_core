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
 * @module SpiceImporterModule
 */
import {Component, EventEmitter, Output, ViewChild, ViewContainerRef,} from '@angular/core';
import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {Observable, Subject} from 'rxjs';

import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-select',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterselect.html',
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}',
            `.slds-radio--button [type=radio]:checked + .slds-radio--button__label,
        .slds-radio--button [type=radio]:checked + .slds-radio--faux,
        .slds-radio--button [type=radio]:checked + .slds-radio_button__label,
        .slds-radio--button [type=radio]:checked + .slds-radio_faux,
        .slds-radio--button [type=radio]:checked ~ .slds-radio--faux,
        .slds-radio--button [type=radio]:checked ~ .slds-radio_faux,
        .slds-radio_button [type=radio]:checked + .slds-radio--button__label,
        .slds-radio_button [type=radio]:checked + .slds-radio--faux,
        .slds-radio_button [type=radio]:checked + .slds-radio_button__label,
        .slds-radio_button [type=radio]:checked + .slds-radio_faux,
        .slds-radio_button [type=radio]:checked ~ .slds-radio--faux,
        .slds-radio_button [type=radio]:checked ~ .slds-radio_faux {
            background-color: #CA1B1F
        }`
    ]
})


export class SpiceImporterSelect {
    @Output() public templateNameSet: EventEmitter<any> = new EventEmitter<any>();
    @Output() public importActionSet: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('fileupload', {read: ViewContainerRef, static: false}) private fileupload: ViewContainerRef;
    private showUploadModal: boolean = false;
    private theProgress: number = 0;

    constructor(
        private spiceImport: SpiceImporterService,
        private toast: toast,
        private language: language,
        private session: session,
        private configurationService: configurationService,
        private model: model,
        private backend: backend
    ) {
    }

    get enclosure() {
        return this.spiceImport.enclosure;
    }

    set enclosure(enclosure) {
        this.spiceImport.enclosure = enclosure;
    }

    get separator() {
        return this.spiceImport.separator;
    }

    set separator(separator) {
        this.spiceImport.separator = separator;
    }

    get templateName() {
        return this.spiceImport.templateName;
    }

    set templateName(name) {
        this.spiceImport.templateName = name;
        this.templateNameSet.emit(name);
    }

    get importAction() {
        return this.spiceImport.importAction;
    }

    set importAction(action) {
        this.spiceImport.importAction = action;
        this.importActionSet.emit(action);
        this.spiceImport.idField = '';
        this.templateName = undefined;
        this.resetOptions();
        this.spiceImport.resetSettings();
    }

    get importTemplateAction() {
        return this.spiceImport.importTemplateAction;
    }

    set importTemplateAction(action) {
        this.spiceImport.importTemplateAction = action;

        if (action != 'choose') {
            this.spiceImport.resetSettings();
        }
    }

    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private resetOptions() {
        this.spiceImport.importDuplicateAction = 'ignore';
        this.spiceImport.importTemplateAction = 'none';
        this.spiceImport.idFieldAction = 'auto';
    }

    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1) {
            this.doupload(files);
        }
    }

    private hasSavedImports() {
        return this.spiceImport.savedImports.length > 0;
    }

    private getSavedImports() {
        return this.spiceImport.savedImports;
    }

    private setSavedImport(event) {
        this.spiceImport.setSavedImport(event.srcElement.value);
    }

    private selectFile() {
        let event = new MouseEvent('click', {bubbles: true});
        this.fileupload.element.nativeElement.dispatchEvent(event);
    }

    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    private doupload(files) {
        if (files[0] && files[0].name) {
            this.showUploadModal = true;
            this.uploadAttachments(files).subscribe((retVal: any) => {


                if (retVal.progress) {
                    this.theProgress = retVal.progress.loaded / retVal.progress.total * 100;
                } else if (retVal.files) {

                    this.spiceImport.fileName = files[0].name;
                    this.spiceImport.fileId = retVal.files[0].filemd5;
                    this.spiceImport.fileHeader = retVal.files[0].fileheader;
                    this.spiceImport.fileData = retVal.files[0].filedata;
                    this.spiceImport.fileRows = retVal.files[0].filerows;
                    this.spiceImport.fileTooBig = retVal.fileTooBig;

                    if (retVal.files[0].filedata.length === 0) {
                        this.clearFile();
                        this.toast.sendToast(this.language.getLabel('ERR_CANT_READ_FILE_DATA'), 'error', '', false);
                    }

                    if (retVal.fileTooBig && retVal.files[0].filedata.length > 0) {
                        this.toast.sendToast(this.language.getLabel('MSG_FILE_ROWS_TOO_LARGE'), 'warning', '', false);
                    }

                } else if (retVal.status === 'error') {
                    this.toast.sendToast(this.language.getLabel('ERR_UPLOAD_FAILED'), 'error', retVal.data, false);
                }
            }, error => error, () => this.closeUploadPopup());
        }
    }

    private closeUploadPopup() {
        this.showUploadModal = false;
    }

    private getBarStyle() {
        return {
            width: this.theProgress + '%'
        };
    }

    private uploadAttachments(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        let data = new FormData();
        data.append('file', files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function(scope: any = this) {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next({files: retVal.files, fileTooBig: retVal.fileTooBig});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };

                    retSub.next(resp);
                    retSub.complete();
                }
            }
        };

        request.upload.addEventListener('progress', (e: any) => {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() +
            `/modules/SpiceImports/upf?separator=${this.separator}&enclosure=${this.enclosure}`, true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);
        return retSub.asObservable();
    }

    private clearFile() {
        this.backend.deleteRequest('/modules/SpiceImports/upf', {filemd5: this.spiceImport.fileId});

        // clear the file
        this.spiceImport.fileName = '';
        this.spiceImport.fileId = '';

        // clear the laoded content
        this.spiceImport.fileHeader = [];
        this.spiceImport.fileData = [];
        this.spiceImport.fileRows = '';

        this.spiceImport.resetSettings();

    }

}
