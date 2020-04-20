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
import {Component, AfterViewInit, ViewChild, ViewContainerRef, Renderer2} from "@angular/core";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";

/**
 * a generic component that renders a panel in teh contect of a model. This allows uploading files and also has a drag and drop functionality to cimply drop files over the component and upload the file
 */
@Component({
    selector: "object-relatedlist-files",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistfiles.html",
    providers: [modelattachments],
    animations: [
        trigger('animateicon', [
            state('open', style({transform: 'scale(1, 1)'})),
            state('closed', style({transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ]),
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ]
})
export class ObjectRelatedlistFiles implements AfterViewInit {

    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: true}) private fileupload: ViewContainerRef;

    /**
     * @ignore
     *
     * passed in component config
     */
    private componentconfig: any = {};

    /**
     * @ignore
     *
     * keeps if the modal is open or not
     */
    private isopen: boolean = true;

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param language
     * @param model
     * @param renderer
     * @param toast
     * @param footer
     * @param metadata
     * @param modalservice
     */
    constructor(private modelattachments: modelattachments, private language: language, private model: model, private renderer: Renderer2, private toast: toast, private footer: footer, private metadata: metadata, private modalservice: modal) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    private loadFiles() {
        this.modelattachments.getAttachments();
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        setTimeout(() => this.loadFiles(), 10);
    }

    /**
     * toggle open and closed .. called from teh template button
     */
    private toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
    }

    /**
     * handler for the dragover event.- Checks if we only have files dragged over the div
     *
     * @param event
     */
    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.hasOneItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();

            // ensure we are copying the element
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    /**
     * helper to check if all elements of the drag over event are files
     *
     * @param items the items from the event
     */
    private hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'file') {
                return true;
            }
        }

        return false;
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private fileDrop(files) {
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * triggers a file upload. From the select button firing the hidden file upload input
     */
    private selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.fileupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * does the upload oif the files
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    /**
     * @deprecated
     *
     * helper function to take a foto
     */
    private takeFoto() {
        this.modalservice.openModal("SystemCaptureImage").subscribe(modal => {
            modal.instance.model = this.model;
            modal.instance.response$.subscribe(file => {
                this.modelattachments.files.push(file);
            });
        });
    }
}
