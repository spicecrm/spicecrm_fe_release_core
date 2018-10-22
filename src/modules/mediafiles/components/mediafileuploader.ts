/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import { Component, Input, Renderer, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'media-file-uploader',
    templateUrl: './src/modules/mediafiles/templates/mediafileuploader.html',
    providers: [ mediafiles ],
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}'
    ]
    //styles: [ 'img.thumb { background-color: #fff; border: 1px solid #d8dde6; padding: 1px; margin-right: 3px; width: 32px; height: 32px; }' ]
})
export class MediaFileUploader implements AfterViewInit {

    theProgress: number = 0;
    uploadFinished = false;
    filedata: any = {};
    statustext: string;
    noMetaData: boolean = false;
    fileIsSelected: boolean = false;
    category: string;

    answer: Observable<boolean> = null;
    answerSubject: Subject<boolean> = null;

    self: any;

    @ViewChild( 'fileupload', { read: ViewContainerRef }) fileupload: ViewContainerRef;

    constructor ( private mediafiles: mediafiles, private backend: backend, private language: language, private toast:toast, private renderer: Renderer ) {
        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();
    }

    ngAfterViewInit() {
        this.triggerFileSelectionDialog();
    }

    triggerFileSelectionDialog() {
        // triggers file selection dialog of the browser (using the hidden input field)
        let event = new MouseEvent( 'click', { bubbles: true } );
        this.renderer.invokeElementMethod( this.fileupload.element.nativeElement, 'dispatchEvent', [event] );
    }

    fileSelected() {
        let files = this.fileupload.element.nativeElement.files;
        this.fileIsSelected = files.length > 0;
        this.statustext = 'Uploading ' + files[0].name + ' …';
        this.mediafiles.uploadFile( files ).subscribe((retVal: any) => {
            if ( retVal.progress )
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100;
            else
                this.filedata = retVal.filedata;
        }, error => {
            this.toast.sendToast( this.language.getLabel( 'ERR_UPLOAD_FAILED' ));
            this.cancel();
        }, () => {
            this.uploadFinished = true;
            this.filedata.category = this.category;
            if ( this.noMetaData ) {
                this.filedata.name = this.filedata.id;
                this.finishDataInput();
            } else {
                this.filedata.name = files[0].name;
                this.statustext = this.language.getLabel( 'MSG_IMGUPLOADED_INPUTDATA' );
                this.mediafiles.loadCategories();
            }
        });
    }

    finishDataInput() {
        this.filedata.upload_completed = 1;
        this.backend.postRequest('module/MediaFiles/'+this.filedata.id, null, this.filedata );
        this.answerSubject.next( this.filedata.id );
        this.answerSubject.complete();
        this.self.destroy();
    }

    cancel() {
        // todo: Spezial-POST-Request um Datei tatsächlich wieder zu löschen - und Datensatz, aber nur wenn this.uploadFinished === true
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    onModalEscX() {
        this.cancel();
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

}