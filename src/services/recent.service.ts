/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router}   from '@angular/router';
import {Observable, Subject, of} from 'rxjs';

@Injectable()
export class recent {
    private items: Array<any> = [];
    public moduleItems: any = {};

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                this.items.some((item, index) => {
                    if(item.module_name === message.messagedata.module && item.item_id == message.messagedata.id){
                        this.items[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });

                if(this.moduleItems[message.messagedata.module]){
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if(item.item_id == message.messagedata.id){
                            this.moduleItems[message.messagedata.module][index].item_summary = message.messagedata.data.summary_text;
                            return true;
                        }
                    });
                }

                break;
            case 'model.delete':
                this.items.some((item, index) => {
                    if(item.module_name === message.messagedata.module && item.item_id == message.messagedata.id){
                        this.items.splice(index, 1);
                        return true;
                    }
                });

                if(this.moduleItems[message.messagedata.module]){
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if(item.item_id == message.messagedata.id){
                            this.items.splice(index, 1);
                            return true;
                        }
                    });
                }

                break;
        }
    }

    public trackItem(module: string, item_id: string, item_summary: string) {
        // handle the general tracker
        this.items.some((item, index) => {
            if(item.module_name === module && item.item_id == item_id){
                this.items.splice(index, 1);
                return true;
            }
        });

        this.items.splice(0, 0, {
            item_id: item_id,
            module_name: module,
            item_summary: item_summary
        });

        while(this.items.length > 50) {this.items.pop();}

        // handle the module specific tracker
        if(this.moduleItems[module]){
            this.moduleItems[module].some((item, index) => {
                if(item.item_id == item_id){
                    this.moduleItems[module].splice(index, 1);
                    return true;
                }
            });

            this.moduleItems[module].splice(0, 0, {
                item_id: item_id,
                module_name: module,
                item_summary: item_summary
            });

            while(this.moduleItems[module].length > 5) {this.moduleItems[module].pop();}
        }
    }

    public getRecent(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('recent'+this.session.authData.sessionId)] && sessionStorage[window.btoa('recent'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            let response = this.session.getSessionData('recent');
            for (let item of response) {
                this.items.push(item);
            }
            loadhandler.next('getRecent');
        }else {
            this.backend.getRecent('', 50).subscribe(response => {
                this.session.setSessionData('recent',response);
                for (let item of response) {
                    this.items.push(item);
                }
                loadhandler.next('getRecent');
            });
        }
    }

    public getModuleRecent(module: string) {
        if(this.moduleItems[module]) {
            return of(this.moduleItems[module]);
        } else {
            let responseSubject = new Subject<Array<any>>();
            if (!this.moduleItems[module]) {
                this.backend.getRecent(module, 5) .subscribe(response => {
                    this.moduleItems[module] = [];
                    for (let item of response) {
                        this.moduleItems[module].push(item);
                    }
                    responseSubject.next(this.moduleItems[module]);
                    responseSubject.complete();
                });
            }
            return responseSubject.asObservable();
        }
    }
}
