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
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnDestroy, ViewChildren, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';
import {ObjectActionContainerItem} from "./objectactioncontaineritem";
import {SystemResizeDirective} from "../../directives/directives/systemresize";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html'
})
export class ObjectList implements OnDestroy {

    /**
     * the element reference for the content of the view
     */
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;

    /**
     * all fields that are available
     */
    private allFields: any[] = [];

    /**
     * the subscription to the modellist
     */
    private modellistsubscribe: any = undefined;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * returns the actionset from the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    constructor(private router: Router, private metadata: metadata, private modellist: modellist, private language: language, private layout: layout) {

        // get the confih
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // load the list and initialize from sesson data if this is set
        this.loadList(true);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());
    }

    /**
     * getter if the listconfig allows inline editing
     */
    get inlineedit() {
        return this.componentconfig.inlineedit;
    }

    /**
     * a getter if the view is considered small
     * to render the view properly
     */
    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the sortfield from the config
     */
    get sortfield() {
        return this.componentconfig.sortfield;
    }

    /**
     * returns the sortdirection from the componentconfig
     */
    get sortdirection() {
        return this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC';
    }

    /**
     * unsubscribe from the modellist subscription
     */
    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the listtype when this is switched and reload the listdefs and the listdata
     */
    private switchListtype() {
        this.loadList();
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     *
     * @param loadfromcache
     */
    private loadList(loadfromcache: boolean = false) {

        if (this.modellist.listData.listcomponent != 'ObjectList') {
            let requestedFields = [];
            for (let entry of this.allFields) {
                if (requestedFields.indexOf(entry.field) == -1) {
                    requestedFields.push(entry.field);
                }
            }
            if (this.sortfield) {
                this.modellist.setSortField(this.sortfield, this.sortdirection, false);
            }
            this.modellist.getListData(requestedFields);
        }
    }

    /**
     * manages the scroll event for the infinited Scroll
     *
     * @param e
     */
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }
}
