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
 * @module GlobalComponents
 */
import {ElementRef, Component, NgModule, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-search',
    templateUrl: './src/globalcomponents/templates/globalsearch.html',
    providers: [fts]
})
export class GlobalSearch implements OnDestroy {

    private searchScope: string = '*';
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private routeSubscription: any;

    constructor(navigation: navigation, private elementref: ElementRef, router: Router, private activatedRoute: ActivatedRoute, private fts: fts, private language: language) {
        this.routeSubscription = this.activatedRoute.params.subscribe(params => {
            if (params.searchterm) {
                // try to base 64 decode .. but can also be plain string
                try {
                    this.searchTerm = atob(decodeURIComponent(params.searchterm));
                } catch (e) {
                    this.searchTerm = params.searchterm;
                }

                this.doSearch();
                navigation.setActiveModule('search', 'search: ' + this.searchTerm);
            }
        });
    }

    public ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.fts.searchTerm = this.searchTerm;
                this.doSearch();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    get totalcount() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            total += modres.data.total;
        }
        return total;
    }

    get totalmodules() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            if (modres.data.total > 0) total++;
        }
        return total;
    }

    private doSearch(): void {
        if (this.searchScope === '*') {
            this.fts.searchByModules({searchterm: this.searchTerm});
        } else {
            this.fts.searchByModules({searchterm: this.searchTerm, modules: [this.searchScope], size: 50});
        }
    }

    private getScopeClass(scope): string {
        if (scope === this.searchScope) {
            return 'slds-is-active';
        }
    }

    private setSearchScope(scope): void {
        if (scope === this.searchScope) return;

        this.searchScope = scope;
        this.doSearch();
    }

    private infiniteScroll(): boolean {
        if (this.searchScope === '*') {
            return false;
        } else {
            return true;
        }
    }
}