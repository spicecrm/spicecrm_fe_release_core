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
 * @module ModuleMediaFiles
 */
import { Component, ViewChild } from '@angular/core';
import { mediafiles } from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import { Subject, Observable } from 'rxjs';
import { toast } from "../../../services/toast.service";
import { model } from '../../../services/model.service';
import { view } from '../../../services/view.service';
import { metadata } from '../../../services/metadata.service';
import { SystemInputMedia } from '../../../systemcomponents/components/systeminputmedia';

@Component({
    selector: 'media-file-uploader',
    templateUrl: './src/modules/mediafiles/templates/mediafileuploader.html',
    providers: [ mediafiles, model, view ],
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}',
        'field-container ::ng-deep button.slds-button.slds-button--icon { display: none; }'
    ]
})
export class MediaFileUploader {

    private theProgress: number = 0;
    private noMetaData: boolean = false;

    private answer: Observable<boolean|string> = null;
    private answerSubject: Subject<boolean|string> = null;

    private self: any;

    private isSaving = false;
    private isEditing = true;
    private tagsEditing = true;
    @ViewChild(SystemInputMedia, { static: false }) public inputMedia;

    private mediaMetaData;

    private fieldsetId: string;

    constructor( private mediafiles: mediafiles, private metadata: metadata, private backend: backend, private lang: language, private toast: toast, public model: model, public view: view ) {

        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();

        this.model.module = 'MediaFiles';
        this.model.id = this.model.generateGuid();
        this.model.initialize();

        this.model.setField('id', this.model.id );

        this.view.isEditable = true;
        this.view.setEditMode();

        let componentConfig = this.metadata.getComponentConfig('MediaFileUploader','MediaFiles');
        this.fieldsetId = componentConfig.fieldset;

    }

    private cancel(): void {
        this.model.cancelEdit();
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    private get canSave(): boolean {
        return this.mediaMetaData && !this.isSaving;
    }

    private mediaChanged( data ) {
        this.mediaMetaData = data.metaData;
        if ( !this.model.getField('name' )) this.model.setField('name', this.mediaMetaData.filename.replace(/\.[^\.]+$/, '' ).replace(/_/, ' '));
    }

    private save(): void {
        if ( !this.canSave ) return;
        this.isSaving = true;
        this.model.setField('file', this.inputMedia.getImage() );
        this.model.setField('mediatype', this.mediaMetaData.mediatype );
        this.model.setField('filetype', this.mediaMetaData.fileformat );
        this.model.savingProgress.subscribe( progress => this.theProgress = progress );
        if ( this.model.validate() ) {
            this.view.setViewMode();
            this.isEditing = false;
            this.model.save().subscribe( () => {
                this.answerSubject.next( this.model.id );
                this.answerSubject.complete();
                window.setTimeout( () => this.self.destroy(), 2000 );
            } );
        } else this.isSaving = false;
    }

    public set tagsAsString( value ) {
        this.model.setField('tags', value );
    }

    public get tagsAsString() {
        return this.model.getField('tags');
    }

    public onModalEscX() {
        if ( !this.isSaving ) this.cancel();
        return false;
    }

}
