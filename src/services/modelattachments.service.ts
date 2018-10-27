/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from "rxjs";

import {configurationService} from "./configuration.service";
import {session} from "./session.service";
import {backend} from "./backend.service";

@Injectable()
export class modelattachments {
    public module: string = "";
    public id: string = "";
    public items: any = [];
    public count: number = 0;
    public files: Array<any> = [];

    private serviceSubscriptions: Array<any> = [];

    constructor(
        private http: HttpClient,
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
    ) {
    }

    public getAttachments() {
        this.backend.getRequest("module/" + this.module + "/" + this.id + "/attachment/ui").subscribe(response => {
            this.resetData();
            this.files = response;
        });
    }

    public uploadAttachments(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        let params: Array<string> = [];
        // params.push("sessionid=" + this.session.authData.sessionId);

        let data = new FormData();
        data.append("file", files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function (scope: any = this) {
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

        request.upload.addEventListener("progress", function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
            // console.log("progress" + e.loaded + "/" + e.total + "=" + Math.ceil(e.loaded/e.total) * 100 + "%");
        }, false);

        request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/ui?" + params.join("&"), true);
        request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }

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


    public downloadAttachment(id, name?) {
        let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);

        this.backend.downloadFile(
            {
                route: "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download"
            }, name
        );

    }

    public openAttachment(id, name?) {
        let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download?" + params.join("&"),
            "_blank" // <- open in a new window
        );
    }

    public resetData() {
        this.items = [];
    }
}
