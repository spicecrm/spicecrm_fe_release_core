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
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {animate, style, transition, trigger} from "@angular/animations";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
    ],
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectModalModuleLookup implements OnInit, OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('headercontent', {read: ViewContainerRef, static: true}) private headercontent: ViewContainerRef;

    public allSelected: boolean = false;
    public searchTerm: string = '';
    public searchTermOld: string = '';
    public searchTimeOut: any = undefined;
    public self: any = {};
    public multiselect: boolean = false;
    public module: string = '';
    public modulefilter: string = '';

    /**
     * a guid to kill the autocomplete
     */
    private autoCompleteKiller: string;

    private modellistsubscribe: any;

    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model) {
        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        // set a random id so no autocomplete is triggered on the field
        this.autoCompleteKiller = this.modelutilities.generateGuid();
    }

    /**
     * get the style for the content so the table can scroll with fixed header
     */
    private contentStyle() {
        let headerRect = this.headercontent.element.nativeElement.getBoundingClientRect();

        return {
            height: `calc(100% - ${headerRect.height}px)`
        };
    }

    /**
     * a getter that builds teh request fields from the listfields from the modellistservice
     */
    get requestfields() {
        let requestfields = [];
        for (let listfield of this.modellist.listfields) {
            if (requestfields.indexOf(listfield.field) != -1) {
                requestfields.push(listfield.field);
            }
        }
        return requestfields;
    }

    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {

        // this.model.module = this.module;
        this.modellist.module = this.module;
        this.modellist.modulefilter = this.modulefilter;

        // set hte module on the model
        this.model.module = this.module;

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        } else {
            this.searchTerm = this.modellist.searchTerm;
            this.searchTermOld = this.modellist.searchTerm;
            // load the list if the view of the cached entry is different
            if (this.modellist.listData.listcomponent != 'ObjectList') {
                this.modellist.getListData(this.requestfields);
            }
        }
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        if (this.modellistsubscribe) this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the change of listtype
     */
    private switchListtype() {
        if (this.modellist.module) {
            this.modellist.reLoadList();
        }
    }

    /**
     * tigger the search
     */
    private doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.requestfields);
    }

    /**
     * trigger the search immediate or with a delay
     *
     * @param _e
     */
    private triggerSearch(_e) {
        if (this.searchTerm === this.searchTermOld) return;
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTerm.length > 0) {
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.doSearch();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    /**
     * scroll event handler for the infinite scrolling in the window
     * @param e
     */
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * closes the popup
     */
    private closePopup() {
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }


    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    public clickRow(event, item) {
        if (!this.multiselect) {
            this.selectedItems.emit([item]);
            this.usedSearchTerm.emit(this.searchTerm);
            this.self.destroy();
        }
    }

    private onModalEscX() {
        this.closePopup();
    }

    /**
     * a getter for the aggregates
     */
    private getAggregates() {
        let aggArray = [];
        for (let aggregate in this.modellist.searchAggregates) {
            if (aggregate != 'tags' && this.modellist.searchAggregates.hasOwnProperty(aggregate)) {
                aggArray.push(this.modellist.searchAggregates[aggregate]);
            }
        }

        return aggArray;
    }


    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.modellist.setSortField(field.field);
        }
    }
}
