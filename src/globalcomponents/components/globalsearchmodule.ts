/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * Created by christian on 08.11.2016.
 */
import {ElementRef, Component, Input, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';

declare var _;

@Component({
    selector: '[global-search-module]',
    templateUrl: './src/globalcomponents/templates/globalsearchmodule.html',
    host: {
        '[style.display]': 'getDisplay()'
    }
})
export class GlobalSearchModule implements OnInit {
    @ViewChild('tablecontent', {read: ViewContainerRef}) tablecontent: ViewContainerRef;
    @Input() module: string = '';
    @Input() infinitescroll: boolean = false;
    listfields: Array<any> = [];

    constructor(private broadcast:broadcast, private metadata: metadata, private elementref: ElementRef, router: Router, private fts: fts, private language: language) {

    }

    ngOnInit() {
        this.listfields = [];

        // load all fields
        let componentconfig = this.metadata.getComponentConfig('GlobalSearchModule', this.module);
        // if nothing is defined, try to take the default list config...
        if(_.isEmpty(componentconfig))
            componentconfig = this.metadata.getModuleDefaultComponentConfigByUsage(this.module, 'list');

        for (let listField of this.metadata.getFieldSetFields(componentconfig.fieldset)) {
            if (listField.fieldconfig.default !== false)
                this.listfields.push(listField);
        }
    }

    getCount(): any {
        let resultCount = {};
        this.fts.moduleSearchresults.some(item => {
            if (item.module === this.module) {
                resultCount = {
                    total: item.data.total,
                    hits: item.data.hits.length
                };
                return true;
            }
        });
        return resultCount;
    }


    getDisplay(){
        if(!this.fts.runningmodulesearch && this.getCount().total > 0)
            return 'inherit';

        return 'none';
    }


    canViewMore():boolean {
        return !this.infinitescroll && this.getCount().total > 5;
    }

    getItems(): Array<any> {
        let items: Array<any> = [];
        this.fts.moduleSearchresults.some(item => {
            if (item.module === this.module) {
                items = item.data.hits;
                return true;
            }
        });
        return items;
    }

    getContainerStyle(): any {
        if(!this.infinitescroll)
            return {};
        let rect = this.tablecontent.element.nativeElement.getBoundingClientRect();
        return {
            'max-height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'scroll',
            'margin-top': '-1px'
        }

    }

    setSearchScope():void{
        this.broadcast.broadcastMessage('fts.setscope', this.module);
    }

    onScroll(e):void {
        if(this.infinitescroll) {
            let element = this.tablecontent.element.nativeElement;
            if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
                this.fts.loadMore();
            }
        }
    }
}