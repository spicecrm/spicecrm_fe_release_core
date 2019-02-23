/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output, Renderer2, OnDestroy} from "@angular/core";
import {DomSanitizer} from '@angular/platform-browser';
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";


declare var Croppie: any;

@Component({
    selector: "system-upload-image",
    templateUrl: "./src/systemcomponents/templates/systemuploadimage.html"
})
export class SystemUploadImage implements OnDestroy{
    @ViewChild("imgupload", {read: ViewContainerRef}) public imgupload: ViewContainerRef;

    @Input() public cropheight: number = 200;
    @Input() public cropwidth: number = 200;
    @Input() public croptype: 'square' | 'circle' = 'circle';
    @Input() public cropresize: boolean = false;
    @Output() public imagedata: EventEmitter<any> = new EventEmitter<any>();

    private self: any;
    private imageBase64: any;
    private croppie: any;
    private pasteListener: any;

    constructor(private language: language, private metadata: metadata, private renderer: Renderer2, private sanitizer: DomSanitizer) {
        this.pasteListener = this.renderer.listen('window', 'paste', e => {
            e.preventDefault();
            e.stopPropagation();
            let blob = e.clipboardData.items[0].getAsFile();
            let URLObj = window.URL;
            this.imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(URLObj.createObjectURL(blob));
        });
    }

    public ngOnDestroy(): void {
        this.pasteListener();
    }

    get croppiestyle() {
        return {
            height: (this.cropheight * 2) + 'px'
        };
    }

    private close(emitfalse = true) {
        if (emitfalse) this.imagedata.emit(false);
        this.self.destroy();
    }

    private showUpload() {
        let event = new MouseEvent("click", {bubbles: true});
        this.imgupload.element.nativeElement.dispatchEvent(event);
    }

    private uploadImage(event) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
            this.imageBase64 = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    private doCrop(event) {
        if (!this.croppie) {
            this.metadata.loadLibs('croppie').subscribe(
                (next) => {
                    this.croppie = new Croppie(document.getElementById('croppieimage'), {
                        enableExif: true,
                        enableOrientation: true,
                        enableZoom: true,
                        enforceBoundary: true,
                        mouseWheelZoom: true,
                        showZoomer: true,
                        enableResize: this.cropresize,
                        viewport: {
                            width: this.cropwidth,
                            height: this.cropheight,
                            type: 'circle'
                        },
                        boundary: {
                            height: this.cropheight * 2
                        }
                    });
                }
            );
        }
    }

    private getcroppedImage() {
        this.croppie.result({
            type: 'base64',
            size: 'viewport'
        }).then(resp => {
            this.imagedata.emit(resp);
            this.close(false);
        });
    }
}
