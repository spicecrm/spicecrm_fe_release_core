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
 * @module ModuleGroupware
 */
import {Component} from '@angular/core';

import {backend} from "../../../services/backend.service";

/**
 * Search component. Returns a list of beans found using the search terms.
 */
@Component({
    selector: 'groupware-read-pane-search',
    templateUrl: './src/include/groupware/templates/groupwarereadpanesearch.html'
})
export class GroupwareReadPaneSearch {
    /**
     * Input string used for searching.
     */
    private searchTerm: string = "";
    private beans: any[] = [];
    /**
     * A list of found beans.
     */
    private searchResults: any[] = [];
    /**
     * A boolean used to indicate if a search is currently running.
     */
    private searching: boolean = false;

    private searchTimeOut: any = undefined;

    constructor(
        private backend: backend,
    ) {}

    /**
     * Handles the keyboard input into the search field.
     * @param _e
     */
    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                if (this.searchTerm.length) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.searchSpice();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.searchSpice(), 1000);
                break;
        }
    }

    /**
     * Performs the search in SpiceCRM.
     */
    private searchSpice() {
        this.searching = true;
        this.searchResults = [];

        let searchParams = {
            aggregates: {},
            modules: "",
            owner: false,
            records: 10,
            searchterm: this.searchTerm,
            sort: {},
        };

        this.backend.postRequest('module/Emails/groupware/search', {}, searchParams).subscribe(
            (res: any) => {
                this.searchResults = res;
                this.searching = false;
            },
            (err) => {
                this.searching = false;
            }
        );
    }
}
