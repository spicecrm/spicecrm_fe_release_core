/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Subject, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {backend} from "./backend.service";

/**
 * a service class to dynamically load external libraries/scripts
 * source: https://stackoverflow.com/questions/42593604/using-external-javascript-libraries-in-angular-2-lazy-loaded-module-not-index-h
 * created and adapted by Sebastian Franz
 */

@Injectable()
export class LibLoaderService {
    private scripts = [];
    private is_ready = false;

    constructor()
    {
        // load available libraries into this.scripts...
    }

    public load(...scripts: string[]): Observable<object> {
        if( !this.is_ready ) {
            this.load();
        }
        let observables: Observable<object>[] = [];
        scripts.forEach((script) => {
            observables.push(this.loadScript(script));
        });

        let sub = new Subject();
        let cnt = 0;
        for(let o of observables)
        {
            o.subscribe(
                (res) => {
                    cnt++;
                    console.log(cnt, res);
                },
                (err) => {
                    cnt++;
                    console.error(err);
                    sub.error(err);
                },
                () => {
                    // console.log("completed...", cnt == observables.length);
                    if( cnt == observables.length ) {
                        sub.next();
                        sub.complete();
                    }
                }
            );
        }
        // is needed in case of scripts are already loaded and completed before the subject can be subscribed...
        if( cnt == observables.length ) {
            return of(sub);
        } else {
            return sub.asObservable();
        }
    }

    private loadScript(name: string): Observable<object> {
        let sub = new Subject<object>();

        // error if not found... (but how?)
        if(!this.scripts[name]) {
            return of({script: name, loaded: false, status: "Unknown"});
        } else if (this.isLibLoaded(name)) {
            return of({script: name, loaded: true, status: "Already Loaded"});
        } else {
            // load script(s)
            let script: any = document.createElement("script");
            for(let lib of this.scripts[name]) {
                script.type = "text/javascript";
                script.src = lib.src;
                if (script.readyState) {  // IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            lib.loaded = true;
                            sub.next({script: lib.src, loaded: true, status: "Loaded"});
                            sub.complete();
                        }
                    };
                } else {  // Others
                    script.onload = () => {
                        lib.loaded = true;
                        sub.next({script: lib.src, loaded: true, status: "Loaded"});
                        sub.complete();
                    };
                }
                script.onerror = (error: any) => {
                    sub.error({script: lib.src, loaded: false, status: "Failed"});
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }

        return sub.asObservable();
    }

    public isLibLoaded(name): boolean {
        if( this.scripts[name] ) {
            for(let lib of this.scripts[name])
            {
                if(!lib.loaded) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
