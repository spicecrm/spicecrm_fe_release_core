/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'field-file',
    templateUrl: './src/objectfields/templates/fieldfile.html'
})
export class fieldFile extends fieldGeneric{

    @ViewChild('fileupload', {read: ViewContainerRef}) fileupload: ViewContainerRef;
    showUploadModal: boolean = false;
    theFile: string = '';
    theProgress: number = 0;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configurationService: configurationService, private session: session) {
        super(model, view, language, metadata, router);
    }

    uploadFile(){
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    doupload(files){
        this.showUploadModal = true;
        this.theFile = files[0].name;
        this.uploadAttachments(files).subscribe((retVal: any) => {
            if (retVal.progress) {
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100
            } else if (retVal.complete) {
                this.value = this.theFile;
            }
        }, error => {

            this.closeUploadPopup();
        }, () => this.closeUploadPopup());
    }

    removeFile(){
        this.value = '';
    }

    closeUploadPopup() {
        this.showUploadModal = false;
    }

    uploadAttachments(files): Observable<any> {
        if (files.length === 0)
            return;

        let retSub = new Subject<any>();


        var data = new FormData();
        data.append('file', files[0], files[0].name);

        var request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function (scope: any = this) {
            if (request.readyState == 4) {
                try {
                    retSub.next({complete: true});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
            }
        };

        request.upload.addEventListener('progress', function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
            // console.log('progress' + e.loaded + '/' + e.total + '=' + Math.ceil(e.loaded/e.total) * 100 + '%');
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment', true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

    downloadAttachment(id) {
        let params: Array<string> = [];
        params.push('sessionid=' + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment/download?' + params.join('&'),
            '_blank' // <- open in a new window
        );
    }

    preventdefault(event: any) {
        if((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1)
            this.doupload(files);
    }
}