/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate} from '@angular/router';

import {configurationService} from './configuration.service';
import {broadcast} from './broadcast.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {Observable} from 'rxjs';
import {cookie} from './cookie.service';

declare var _: any;

@Injectable()
export class language {
    public languagedata: any = {};
    private _currentlanguage: string = '';
    public currentlanguage$: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private http: HttpClient,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
        private cookie: cookie
    ) {
    }

    set currentlanguage(val) {
        this._currentlanguage = val;

        this.cookie.setValue('spiceuilanguage', val);
    }

    get currentlanguage() {
        return this._currentlanguage;
    }

    public getLanguage(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('languageData' + this.session.authData.sessionId)] && sessionStorage[window.btoa('languageData' + this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            let response = this.session.getSessionData('languageData');
            this.languagedata = response;
            if (this.currentlanguage == '') {
                this.currentlanguage = response.languages.default;
            }
            loadhandler.next('getLanguage');
        } else {
            this.loadLanguage().subscribe(() => {
                loadhandler.next('getLanguage');
            });
        }
    }

    public loadLanguage(): Observable<any> {
        let retSubject = new Subject();

        let params: any = {
            modules: JSON.stringify(this.metadata.getModules())
        };

        if (this.currentlanguage == '') {
            if (this.cookie.getValue('spiceuilanguage')) {
                this.currentlanguage = this.cookie.getValue('spiceuilanguage');
            }
        }

        if (this.currentlanguage != '') {
            params.lang = this.currentlanguage;
        }

        this.http.post(
            this.configurationService.getBackendUrl() + '/module/language', {},
            {headers: this.session.getSessionHeader(), observe: "response", params}
        ).subscribe(
            (res: any) => {
                let response = res.body;
                this.session.setSessionData('languageData', response);
                this.languagedata = response;

                if (this.currentlanguage == '') {
                    this.currentlanguage = response.languages.default;
                }

                // emit that the language has changed
                this.currentlanguage$.emit(this.currentlanguage);

                retSubject.next(true);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    public getModuleLabel(module, label, length = 'default') {

        return this.getLabel(label, module, length);
    }

    public getLabel(label: string, module: string = '', length = 'default') {
        try {
            if (module != '') {
                if (typeof(this.languagedata.mod) != "undefined" && this.languagedata.mod[module] != undefined && this.languagedata.mod[module][label]) {
                    return this.languagedata.mod[module][label];
                } else {
                    return this.getAppLanglabel(label, length);
                }
            } else {
                return this.getAppLanglabel(label, length);
            }
        } catch (e) {
            return label;
        }
    }

    public getAppLanglabel(label: string, length = 'default') {
        if (this.languagedata.applang[label]) {
            if (typeof(this.languagedata.applang[label]) == 'object') {
                return this.languagedata.applang[label][length] ? this.getNestedLabel(label, length) : this.getNestedLabel(label);
            } else {
                return this.getNestedLabel(label);
            }
        } else {
            return label;
        }
    }

    /*
    * resolve nested labels indicated by{LABEL:______}
     */
    private getNestedLabel(label, length = 'default') {
        let foundlabel;

        // try to find a label
        if (this.languagedata.applang[label]) {
            if (_.isObject(this.languagedata.applang[label])) {
                foundlabel = this.languagedata.applang[label][length] ? this.languagedata.applang[label][length] : this.languagedata.applang[label].default;
            } else if (_.isString(this.languagedata.applang[label])) {
                foundlabel = this.languagedata.applang[label];
            }
        }

        // check for nested labels
        if (foundlabel) {
            let matches = this.getNestedTags(foundlabel);
            if (matches) {
                for (let thismatch of matches) {
                    foundlabel = foundlabel.replace('{LABEL:' + thismatch + '}', this.getNestedLabel(thismatch, length));
                }
            }
        }

        // return the label
        return foundlabel ? foundlabel : label;
    }

    private getNestedTags(label) {
        let curpos = label.indexOf('{LABEL:');
        let matches = [];
        while (curpos >= 0) {
            if (curpos >= 0) {
                let endpos = label.indexOf('}', curpos);
                if (endpos >= 0) {
                    matches.push(label.substring(curpos + 7, endpos));
                    curpos = label.indexOf('{LABEL:', endpos);
                } else {
                    curpos = -1;
                }
            }
        }
        return matches;
    }

    public getLabelFormatted(label: string, replacements: any, module: string = '') {
        let replArray: string[];
        if (Array.isArray(replacements)) replArray = replacements;
        else replArray = new Array(replacements);
        let x = 0;
        return this.getLabel(label, module)
            .replace(/%(s|%)/g, (...args) => {
                return args[1] === 's' ? replArray[x++] : (args[1] === '%') ? '%' : args[0];
            });
    }

    /*
    * get the name for a module
    * todo: someday remove legacy support for applist strings
     */
    public getModuleName(module, singular = false, labellength = 'default') {
        try {
            let module_defs = this.metadata.getModuleDefs(module);
            if (singular) {
                if (module_defs.singular_label) {
                    return this.getAppLanglabel(module_defs.singular_label, labellength);
                }

                if (this.languagedata.applist.moduleListSingular[module]) {
                    return this.languagedata.applist.moduleListSingular[module];
                }
            } else {
                if (module_defs.module_label) {
                    return this.getAppLanglabel(module_defs.module_label, labellength);
                }
            }
            return this.languagedata.applist.moduleList[module];
        } catch (e) {
            return module;
        }
    }

    public getFieldDisplayName(module: string, fieldname: string, fieldconfig: any = {}, length = 'default') {
        let label = '';
        if (fieldconfig.label) {
            if (fieldconfig.label.indexOf(':') > 0) {
                let labeldata = fieldconfig.label.split(':')
                label = this.getLabel(labeldata[1], labeldata[0]);
            } else {
                label = this.getLabel(fieldconfig.label, module, length);
            }
        } else {
            label = this.getModuleLabel(module, this.metadata.getFieldlabel(module, fieldname), length);
        }

        // return the value
        if (label === '') {
            if (fieldconfig.label) {
                return fieldconfig.label;
            } else {
                return fieldname;
            }
        } else {
            return label
        }
    }

    public getFieldDisplayOptions(module: string, field: string, formatted: boolean = false): any[] {
        let options = this.metadata.getFieldOptions(module, field);
        if (options !== false) {
            try {
                let ret = this.languagedata.applist[options];
                // format the return value for the use in enum fields...
                if (formatted) {
                    let tmp_ret = ret;
                    ret = [];
                    for (let option in tmp_ret) {
                        ret.push({
                            value: option,
                            display: tmp_ret[option],
                        })
                    }
                }
                return ret;
            } catch (e) {
                return [];
            }
        } else {
            return [];
        }
    }

    /**
     * used for fields with no module defined in backend
     * @param {string} idx = index in dictionary
     * @param {boolean} formatted
     * @returns {any}
     */
    public getDisplayOptions(idx: string, formatted: boolean = false) {
        let ret = this.languagedata.applist[idx];
        // format the return value for the use in enum fields...
        if (formatted) {
            let tmp_ret = ret;
            ret = [];
            for (let option in tmp_ret) {
                ret.push({
                    value: option,
                    display: tmp_ret[option],
                });
            }
        }
        return ret;
    }

    public getFieldDisplayOptionValue(module: string, field: string, value: string): string {
        let options = this.metadata.getFieldOptions(module, field);
        if (options !== false) {
            try {
                return this.languagedata.applist[options][value];
            } catch (e) {
                return value;
            }
        } else {
            return value;
        }
    }

    /**
     * why does this function not return the language object as it is in the database?
     * whats the benefit to remap the fields?
     * @param {boolean} systemonly
     * @returns {any[]}
     */
    public getAvialableLanguages(systemonly = false) {
        let languages = [];
        for (let language of this.languagedata.languages.available) {

            if (systemonly && (!language.system_language || language.system_language == 0)) continue;

            languages.push({
                language: language.language_code,
                text: language.language_name,
                system_language: language.system_language,
                communication_language: language.communication_language,
                default_language: language.language_code == this.languagedata.languages.default
            });
        }
        return languages;
    }

    /*
    * adds or set a specific language .. input shoudl be int eh frmat of syslangs as returned from the backend
     */
    public addAvailableLanguage(languagedata) {

        let langfound = false;
        this.languagedata.languages.available.some(language => {
            if (language.language_code == languagedata.language_code) {
                // set the relevant data
                language.system_language = languagedata.system_language;
                language.default_language = languagedata.default_language;

                if (languagedata.default_language) {
                    this.setDefaultLanguage(languagedata.language_code);
                }

                langfound = true;
                return true;
            }
        });

        if (!langfound) this.languagedata.languages.available.push(languagedata);
    }

    public removeAvailableLanguage(language_code) {
        this.languagedata.languages.available.some(language => {
            if (language.language_code == language_code) {
                // set the relevant data
                language.system_language = false;
                return true;
            }
        });
    }

    public getDefaultLanguage() {
        return this.languagedata.languages.default;
    }

    public setDefaultLanguage(languagecode) {
        this.http.post(
            this.configurationService.getBackendUrl() + '/syslanguages/setdefault/'+languagecode, {},
            {headers: this.session.getSessionHeader(), observe: "response"}
        ).subscribe(
            (res: any) => {
                let response = res.body;
                if(response.success){
                    this.languagedata.languages.default = languagecode;
                }
            }
        );
    }


    public getLangText(language) {
        let langText = language;
        this.languagedata.languages.available.some((thislang) => {
            if (thislang.language_code == language) {
                langText = thislang.language_name;
                return true;
            }
        });
        return langText;
    }
}
