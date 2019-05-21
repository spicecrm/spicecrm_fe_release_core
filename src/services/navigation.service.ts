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
import {Injectable, EventEmitter} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Observable, Subject, of} from "rxjs";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {CanActivate, CanDeactivate, Router} from "@angular/router";
import {session} from "./session.service";
import {metadata} from "./metadata.service";
import {modal} from "./modal.service";
import {language} from "./language.service";

@Injectable()
export class navigation {

    public activeModule$: EventEmitter<string>;

    public activeModule: string = "Home";
    private activeId: string = "";

    private modelsEditing: any[] = [];

    constructor(private title: Title, private broadcast: broadcast, private configurationService: configurationService) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    public setActiveModule(activemodule: string, id: string = "", summaryText: string = ""): void {
        this.activeModule = activemodule;
        this.activeId = id;
        this.activeModule$.emit(activemodule);

        this.title.setTitle(this.systemName + " " + (summaryText !== "" ? summaryText : activemodule));
    }

    private get systemName() {
        return this.configurationService.data.display ? this.configurationService.data.display : "SpiceCRM";
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
            case "model.save":
                if (this.activeModule === message.messagedata.module && this.activeId === message.messagedata.id) {
                    this.title.setTitle(this.systemName + " " + message.messagedata.data.summary_text);
                }
                break;
            default:
                break;
        }
    }

    public addModelEditing(module, id, summary_text) {
        this.modelsEditing.push({module, id, summary_text});
    }

    public removeModelEditing(module, id) {
        let i = 0;
        this.modelsEditing.some(model => {
            if (model.id == id && model.module == module) {
                this.modelsEditing.splice(i, 1);
                return true;
            }
            i++;
        });
    }

    get editing() {
        return this.modelsEditing.length > 0;
    }

    public discardAllChanges() {
        this.modelsEditing = [];
    }

}

@Injectable()
export class canNavigateAway implements CanActivate {
    constructor(private navigation: navigation, private modal: modal, private language: language) {
    }

    public canActivate(route, state): Observable<boolean> {
        if (this.navigation.editing) {
            let retSubject = new Subject<boolean>();
            this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP','', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP')).subscribe(retval => {
                if (retval) {
                    this.navigation.discardAllChanges();
                }
                retSubject.next(retval)
                retSubject.complete();
            });
            return retSubject.asObservable();
        } else {
            return of(true);
        }
    }
}
