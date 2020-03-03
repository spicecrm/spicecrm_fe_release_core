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
 * @module services
 */
import {EventEmitter, Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

import {configurationService} from "./configuration.service";
import {session} from "./session.service";
import {backend} from "./backend.service";
import {toast} from "./toast.service";
import {language} from "./language.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * handles the model attachments. Can be instantiated in the contect of a model with an id and allows the dsplay as well as manipulation of attachments
 */
@Injectable()
export class modelattachments {
    /**
     * the module of the parent object this is linked to
     */
    public module: string = "";

    /**
     * the id of the parent bean
     */
    public id: string = "";

    /**
     * the toal attachment count
     */
    public count: number = 0;

    /**
     * the files loaded
     */
    public files: any[] = [];

    /**
     * inidcates that the list of files is being loaded
     */
    public loading: boolean = false;

    /**
     * an emitter that emits when the atatchments are loaded
     */
    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
        private toast: toast,
        private language: language
    ) {
    }

    /**
     * returns the count of the attachments
     */
    public getCount(): Observable<any> {
        let retSubject = new Subject();
        this.backend.getRequest("module/" + this.module + "/" + this.id + "/attachment/count").subscribe(
            response => {
                // set the count
                this.count = response.count;
                retSubject.next(this.count);
                retSubject.complete();
            },
            error => {
                retSubject.complete();
            });
        return retSubject.asObservable();
    }

    /**
     * loads the attachments
     */
    public getAttachments(): Observable<any> {
        let retSubject = new Subject();

        this.files = [];
        this.loading = true;
        this.backend.getRequest("module/" + this.module + "/" + this.id + "/attachment/ui").subscribe(
            response => {
                for (let attId in response) {
                    response[attId].date = new moment(response[attId].date);
                    this.files.push(response[attId]);
                }

                // set the count
                this.count = this.files.length;

                this.loading = false;
                // this.files = response;

                // close the subject
                retSubject.next(this.files);
                retSubject.complete();

                // emit on the service
                this.loaded$.emit(true);
            },
            error => {
                this.loading = false;

                // close the subject
                retSubject.error(error);
                retSubject.complete();
            });

        return retSubject.asObservable();
    }

    /**
     * returns the human readable file size fort the display
     *
     * @param filesize
     */
    public humanFileSize(filesize) {
        let thresh = 1024;
        let bytes: number = filesize;
        if (Math.abs(filesize) < thresh) {
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

    /*
    * deprecated: replaces by uploadAttachmentsBase64
    */

    /*
    public uploadAttachments(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        // let params: Array<string> = [];
        // params.push("sessionid=" + this.session.authData.sessionId);

        let data = new FormData();
        data.append("file", files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = (scope: any = this) => {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next({files: retVal});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: "error",
                        data: "Unknown error occurred: [" + request.responseText + "]"
                    };
                }
            }
        };

        request.upload.addEventListener("progress", (e: any) => {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/ui", true);
        request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }
    */

    /**
     * upload files from teh files passed back from a drop or a file select input
     *
     * @param files
     */
    public uploadAttachmentsBase64(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        for (let file of files) {

            // check max filesize
            if (maxSize && file.size > maxSize) {
                this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.humanFileSize(maxSize)]), 'error');
                continue;
            }

            let newfile = {
                date: new moment(),
                file: '',
                file_mime_type: file.type ? file.type : 'application/octet-stream',
                filesize: file.size,
                filename: file.name,
                id: '',
                text: '',
                thumbnail: '',
                user_id: '1',
                user_name: 'admin',
                uploadprogress: 0
            };
            this.files.unshift(newfile);

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            let retVal = JSON.parse(request.response);

                            newfile.id = retVal[0].id;
                            newfile.thumbnail = retVal[0].thumbnail;
                            newfile.user_id = retVal[0].user_id;
                            newfile.user_name = retVal[0].user_name;
                            delete (newfile.uploadprogress);

                            retSub.next({files: retVal});
                            retSub.complete();
                        } catch (e) {
                            resp = {
                                status: "error",
                                data: "Unknown error occurred: [" + request.responseText + "]"
                            };
                        }
                    }
                };

                request.upload.addEventListener("progress", e => {
                    newfile.uploadprogress = Math.round(e.loaded / e.total * 100);
                    retSub.next({progress: {total: e.total, loaded: e.loaded}});
                }, false);

                request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment", true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type ? file.type : 'application/octet-stream'
                };

                request.send(JSON.stringify(fileBody));
            });
        }

        return retSub.asObservable();
    }

    /**
     * upload a file from  a base 64 string directly
     *
     * @param filecontent
     * @param filename
     * @param filetype
     */
    public uploadFileBase64(filecontent: string, filename: string, filetype: string): Observable<any> {

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        // check max filesize
        if (maxSize && atob(filecontent).length > maxSize) {
            this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [filename, this.humanFileSize(maxSize)]), 'error');
            return;
        }

        let newfile = {
            date: new moment(),
            file: '',
            file_mime_type: filetype ? filetype : 'application/octet-stream',
            filesize: atob(filecontent).length,
            filename: filename,
            id: '',
            text: '',
            thumbnail: '',
            user_id: '1',
            user_name: 'admin',
            uploadprogress: 0
        };
        this.files.unshift(newfile);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = (scope: any = this) => {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);

                    newfile.id = retVal[0].id;
                    newfile.thumbnail = retVal[0].thumbnail;
                    newfile.user_id = retVal[0].user_id;
                    newfile.user_name = retVal[0].user_name;
                    delete (newfile.uploadprogress);

                    retSub.next({files: retVal});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: "error",
                        data: "Unknown error occurred: [" + request.responseText + "]"
                    };
                }
            }
        };

        request.upload.addEventListener("progress", e => {
            newfile.uploadprogress = Math.round(e.loaded / e.total * 100);
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment", true);
        request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        let fileBody = {
            file: filecontent,
            filename: filename,
            filemimetype: filetype ? filetype : 'application/octet-stream'
        };

        request.send(JSON.stringify(fileBody));

        return retSub.asObservable();
    }


    /**
     * loads the file locally using the HTML5 FileReader
     * @param file
     */
    private readFile(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader = new FileReader();
        reader['file'] = file;
        reader.onloadend = (e) => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);

            let file = reader['file'];
            file.filecontent = filecontent;
            responseSubject.next(file);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    /**
     * delete an attachment
     *
     * @param id
     */
    public deleteAttachment(id) {
        this.backend.deleteRequest("module/" + this.module + "/" + this.id + "/attachment/" + id)
            .subscribe(res => {
                this.files.some((item, index) => {
                    if (item.id == id) {
                        this.files.splice(index, 1);
                        return true;
                    }
                });
            });
    }


    /**
     * doanloads an attachment int he local browser
     *
     * @param id
     * @param name
     */
    public downloadAttachment(id, name?) {
        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            let blob = this.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = fileData.filename;
            a.type = fileData.file_mime_type;
            a.click();
            a.remove();
        });
    }

    public getAttachment(id): Observable<any> {
        let retSubject = new Subject();

        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            retSubject.next(fileData.file);
            retSubject.complete();
        });

        return retSubject.asObservable();
    }

    /**
     * helper to convert a base64 string to a BLOB the browser can use
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    private b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    public openAttachment(id, name?) {
        /*let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download?" + params.join("&"),
            "_blank" // <- open in a new window
        );*/
        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            let blob = this.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        });
    }

}
