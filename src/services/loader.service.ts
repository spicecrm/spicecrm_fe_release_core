/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate} from '@angular/router';

import {configurationService} from './configuration.service';
import {loginService} from './login.service';
import {Router} from '@angular/router';
import {language} from './language.service';
import {territories} from './territories.service';
import {recent} from './recent.service';
import {favorite} from './favorite.service';
import {reminder} from './reminder.service';
import {metadata} from './metadata.service';
import {currency} from './currency.service';
import {userpreferences} from './userpreferences.service';


@Injectable()
export class loader {
    private module: string = '';
    private id: string = '';
    private data: any = {};
    private loaderHandler: Subject<string> = new Subject<string>();
    private loadComplete: Subject<boolean>;
    private start: any = '';
    private counterCompleted = 0;
    private progress = 0;
    private activeLoader: string = '';
    private loadPhase: string = 'primary';

    private loadElements: any = {
        primary: [
            {
                name: 'loadComponents',
                display: 'Components',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadComponents(loader.loaderHandler);
                }

            },
            {
                name: 'loadFieldSets',
                display: 'Fieldsets',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadFieldSets(loader.loaderHandler);
                }
            },
            {
                name: 'loadValidationRules',
                display: 'Validations',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadValidationRules(loader.loaderHandler);
                }
            },
            {
                name: 'loadModuleDefinitions',
                display: 'Module Definitions',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadModuleDefinitions(loader.loaderHandler);
                }
            },
            {
                name: 'loadFieldDefs',
                display: 'Field Definitions',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadFieldDefs(loader.loaderHandler);
                }
            },
            {
                name: 'getLanguage',
                display: 'Language',
                status: 'initial',
                action: (loader) => {
                    loader.language.getLanguage(loader.loaderHandler);
                }
            },
            {
                name: 'getPreferences',
                display: 'Preferences',
                status: 'initial',
                action: (loader) => {
                    loader.userpreferences.getPreferences(loader.loaderHandler);
                }
            },
            {
                name: 'loadCurrencies',
                display: 'Currencies',
                status: 'initial',
                action: (loader) => {
                    loader.currency.loadCurrencies(loader.loaderHandler);
                }
            }
        ],
        secondary: [
            {
                name: 'getTerritories',
                display: 'Territories',
                status: 'initial',
                action: (loader) => {
                    loader.territories.getTerritories(loader.loaderHandler);
                }
            },
            {
                name: 'getRecent',
                display: 'Recently viewed',
                status: 'initial',
                action: (loader) => {
                    loader.recent.getRecent(loader.loaderHandler);
                }
            },
            {
                name: 'loadFavorites',
                display: 'Favorites',
                status: 'initial',
                action: (loader) => {
                    loader.favorite.loadFavorites(loader.loaderHandler);
                }
            },
            {
                name: 'loadReminders',
                display: 'Reminders',
                status: 'initial',
                action: (loader) => {
                    loader.reminder.loadReminders(loader.loaderHandler);
                }
            },
            {
                name: 'loadHtmlStyling',
                display: 'HTML Styling',
                status: 'initial',
                action: (loader) => {
                    loader.metadata.loadHtmlStyling(loader.loaderHandler);
                }
            }
        ]
    };

    constructor(
        private http: HttpClient,
        private configurationService: configurationService,
        private language: language,
        private territories: territories,
        private metadata: metadata,
        private recent: recent,
        private favorite: favorite,
        private reminder: reminder,
        private currency: currency,
        private userpreferences: userpreferences
    ) {
        this.loaderHandler.subscribe(val => this.handleLoaderHandler());
    }

    public load(): Observable<boolean> {
        this.loadComplete = new Subject<boolean>();
        this.resetLoader();
        this.start = performance.now();
        this.handleLoaderHandler();
        return this.loadComplete.asObservable();
    }

    public reloadPrimary() {
        this.loadComplete = new Subject<boolean>();

        // set the laodphase to primary
        this.loadPhase = 'primary';

        // reset the progress
        this.progress = 0;
        this.counterCompleted = 0;

        // reset the primary load elements
        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        // start the handler
        this.start = performance.now();
        this.handleLoaderHandler();

        // return the observable
        return this.loadComplete.asObservable();
    }

    private resetLoader() {
        // reset the progress
        this.counterCompleted = 0;
        this.progress = 0;

        this.loadPhase = 'primary';

        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.secondary) {
            loaditem.status = 'initial';
        }
    }

    public reset() {
        this.counterCompleted = 0;
        this.progress = 0;

        for (let loadElement of this.loadElements) {
            loadElement.status = 'initial';
        }
    }


    private setComplete() {
        let t1 = performance.now();
        if (t1 - this.start > 500) {
            this.complete();
        } else {
            setTimeout(() => this.complete(), 500);
        }
    }

    private complete() {
        // emit true
        this.loadComplete.next(true);
        this.loadComplete.complete();
    }

    private handleLoaderHandler() {
        let loadActive = false;

        for (let loadElement of this.loadElements[this.loadPhase]) {
            if (loadElement.status === 'active') {
                loadElement.status = 'completed';
                this.progress = ++this.counterCompleted / this.loadElements.primary.length * 100;
                if (this.progress > 100) {
                    this.progress == 100;
                }
            } else if (loadElement.status === 'initial') {
                loadElement.status = 'active';
                loadElement.action(this);
                loadActive = true;
                this.activeLoader = loadElement.display;
                break;
            }
        }

        if (loadActive === false && this.loadPhase == 'primary') {
            // set complete
            this.setComplete();
            // switch to secondary phase
            this.loadPhase = 'secondary';
            this.handleLoaderHandler();

        }

    }
}
