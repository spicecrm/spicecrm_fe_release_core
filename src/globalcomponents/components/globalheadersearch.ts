/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    NgModule,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Renderer,
    EventEmitter,
    HostListener
} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {fts} from '../../services/fts.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search',
    templateUrl: './src/globalcomponents/templates/globalheadersearch.html',
    providers: [popup],
    host:{
       //  '(document:click)': 'this.onClick($event)'
    }
})
export class GlobalHeaderSearch {
    showRecent: boolean = false;
    searchTimeOut: any = undefined;
    searchTerm: string = '';
    searchTermUntrimmed: string = '';
    clickListener: any;

    constructor(private router: Router, private broadcast: broadcast, private fts: fts, private elementRef: ElementRef, private renderer: Renderer,  private popup: popup, private language: language) {
        popup.closePopup$.subscribe(close => {
            this.closePopup();
        })
    }

    onFocus() {
        this.showRecent = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    closePopup() {
        this.clickListener();
        this.showRecent = false;
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
    }

    doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if ( this.searchTerm.length && this.searchTerm !== this.fts.searchTerm ) {
            // start the search
            this.fts.search(this.searchTerm);

            // broadcast so if searc is open also the serach is updated
            this.broadcast.broadcastMessage('fts.search', this.searchTerm);
        }
    }

    clearSearchTerm(){
        // cancel any ongoing search
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        //clear the serachterm
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
        this.fts.searchTerm = '';
    }

    search(_e) {
        // make sur ethe popup is open
        this.showRecent = true;

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if( this.searchTerm.length ){
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                    // set the searchterm .. the timeout might not have gotten it
                    this.fts.searchTerm = this.searchTerm;

                    // broadcast the searchterm
                    this.broadcast.broadcastMessage('fts.search', this.searchTerm);

                    // navigate tot he search view
                    this.router.navigate(['/search']);
                    this.popup.close();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopup()
        }
    }
}