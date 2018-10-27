/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, AfterViewInit} from "@angular/core";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {Router}   from "@angular/router";
import {modelattachments} from "../../services/modelattachments.service";

@Component({
    selector: "[object-related-card-file]",
    templateUrl: "./src/objectcomponents/templates/objectrelatedcardfile.html"
})
export class ObjectRelatedCardFile {

    @Input() private file: any = {};


    constructor(private modelattachments: modelattachments) {

    }

    private humanFileSize() {
        let thresh = 1024;
        let bytes: number = this.file.filesize;
        if (Math.abs(this.file.filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    private determineFileIcon() {
        if (this.file.file_mime_type) {
            let fileTypeArray = this.file.file_mime_type.split("/");
            // check the application
            switch (fileTypeArray[0]) {
                case "image":
                    return "image";
                case "text":
                    return "txt";
                default:
                    break;
            }

            // check the type
            switch (fileTypeArray[1]) {
                case "xml":
                    return "xml";
                case "pdf":
                    return "pdf";
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "excel";
                case "vnd.oasis.opendocument.text":
                    return "word";
                case "vnd.oasis.opendocument.presentation":
                    return "ppt";
                case "x-zip-compressed":
                    return "zip";
                case "x-msdownload":
                    return "exe";
                default:
                    break;
            }
        }

        return "unknown";
    }

    private downloadFile() {
        this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
    }
}
