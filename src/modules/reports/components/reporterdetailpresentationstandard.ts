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
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, ViewChildren, QueryList, Injector, OnDestroy
} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {toast} from '../../../services/toast.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../services/reporterconfig';
import {SystemResizeDirective} from "../../../directives/directives/systemresize";
import {Subscription} from "rxjs";

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-standard',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationstandard.html'
})
export class ReporterDetailPresentationStandard implements AfterViewInit, OnInit, OnDestroy {

    /**
     * reference to the footer. this is needed to set the height of the element for the view
     */
    @ViewChild('tablefooter', {read: ViewContainerRef, static: true}) private tablefooter: ViewContainerRef;

    /**
     * holds the resize directive elements - table header
     */
    @ViewChildren(SystemResizeDirective) private resizeElements: QueryList<SystemResizeDirective>;

    /**
     * holds the presentation params decoded as set in the report
     */
    public presParams: any = {};

    /**
     * holds the presentation Data as retuirned form the backend
     */
    public presData: any = {};


    public fieldsData: any = {};
    public totalWidth: number = 0;
    public showFooter: boolean = true;

    private currentPage: number = 1;

    /**
     * indicates that the view is loading
     */
    public isLoading: boolean = true;

    /**
     * hold the current set sort data with the field and the sort direction
     */
    public sortData: any = {
        sortField: '',
        sortDirection: ''
    }

    /**
     * holds any subscription
     */
    private subscriptions = new Subscription();

    constructor(public language: language, public model: model, public modal: modal, public injector: Injector, public backend: backend, public reporterconfig: reporterconfig, public toast: toast) {
        this.subscriptions.add(this.reporterconfig.refresh$.subscribe(event => {
                this.getPresentation();
            })
        );
    }


    public ngOnInit() {
        this.presParams = this.model.getField('presentation_params');
    }

    public ngAfterViewInit() {
        this.getPresentation();
    }

    /**
     * unsubscribe from any subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns if a field is sortable
     *
     * @param field
     */
    private isSortable(field) {
        return field.sort && field.sort != '-';
    }

    /**
     * gets additonalö display classes for the header field
     *
     * @param field
     */
    private displayClasses(field) {
        let classes = [];

        if (this.isSortable(field)) {
            classes.push('slds-is-sortable');
            if (field.fieldid == this.sortData.sortField) {
                classes.push('slds-is-sorted');
                if (this.sortData.sortDirection == 'asc') {
                    classes.push('slds-is-sorted_asc');
                }
            }
        }

        switch (field.type) {
            case 'currency':
            case 'currencyint':
                classes.push('slds-grid--align-end')
                break;
            case 'enum':
                classes.push('slds-grid--align-center')
                break;
        }

        return classes.join(' ');
    }

    /**
     * toggles the sort field
     *
     * @param field
     */
    private toggleSort(field) {
        if (this.isSortable(field)) {
            if (this.sortData.sortField == field.fieldid) {
                if (this.sortData.sortDirection == 'asc') {
                    this.sortData.sortDirection = 'desc';
                } else {
                    this.sortData.sortField = '';
                    this.sortData.sortDirection = '';
                }
                this.getPresentation();
            } else {
                this.sortData.sortField = field.fieldid;
                this.sortData.sortDirection = 'asc';
                this.getPresentation();
            }
        }
    }

    /**
     * returns the style for the rpesentation data table container
     */
    private getContainerStyle(): any {
        if (this.showFooter) {
            let rectf = this.tablefooter.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100% - ' + rectf.height + 'px)'
            };
        }
    }

    /**
     * returns the set listentries from the pres params if set ... by default 25
     */
    get listEntries() {
        try {
            return this.presParams.pluginData.standardViewProperties.listEntries;
        } catch (e) {
            return 25;
        }
    }

    /**
     * returns a formatted string for the records from and to that are to be displayed
     */
    get displayRecords() {
        let startRecords = (this.currentPage - 1) * this.listEntries + 1;
        let endRecords = this.currentPage * this.listEntries;

        return startRecords + ' - ' + (endRecords > this.presData.count ? this.presData.count : endRecords);
    }

    /**
     * returns the total number of records
     */
    get totalRecords() {
        return this.presData.count;
    }

    /**
     * fetches the presentation with the set dynamic filters
     */
    public getPresentation() {
        this.isLoading = true;

        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }

        let body = {
            start: (this.currentPage - 1) * this.listEntries,
            limit: this.listEntries,
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: this.model.getField('parentBeanId'),
            parentbeanModule: this.model.getField('parentBeanModule'),
            sort: undefined
        };

        if (this.sortData.sortField) {
            body.sort = JSON.stringify([{
                direction: this.sortData.sortDirection.toUpperCase(),
                property: this.sortData.sortField
            }]);
        }

        this.backend.postRequest(`KReporter/${this.model.id}/presentation/dynamicoptions`, {}, body).subscribe((presData: any) => {

            // get field width if not previous set
            if (this.totalWidth == 0) {
                for (let field of presData.reportmetadata.fields) {
                    this.fieldsData[field.fieldid] = field;
                    this.totalWidth += field.width;
                }
            }

            this.presData = presData;

            this.processPresData();

            this.isLoading = false;
        });
    }

    /**
     * public method that can be overwritten
     */
    public processPresData() {
        return;
    }

    /**
     * returns the fields that should be displayed
     */
    private getFields() {
        try {
            return this.presData.reportmetadata.fields.filter(field => field.display == 'yes');
        } catch (e) {
            return [];
        }
    }

    /**
     * returns the records from the presentation data
     */
    public getRecords() {
        try {
            return this.presData.records;
        } catch (e) {
            return [];
        }
    }


    /**
     * handles the resize event and recalculates the width of the various columns
     */
    private onresize() {
        let elementWidths = {}
        let totalwidth = 0;

        this.resizeElements.forEach(element => {
            let elementWidth = element.getElementWidth();
            totalwidth += elementWidth;
            elementWidths[element.resizeid] = element.getElementWidth();
        });

        for (let fieldid in this.fieldsData) {
            this.fieldsData[fieldid].width = Math.round((elementWidths[fieldid] / totalwidth) * 100);
        }

        this.totalWidth = 100;
    }

    /**
     * checks if the user has edit right on the report
     */
    get canSave() {
        return this.model.checkAccess('edit');
    }

    /**
     * saves the current layout
     */
    private saveLayout() {
        if (this.model.checkAccess('edit')) {
            let layoutdata = [];
            for (let field of this.model.getField('listfields').filter(field => field.display != 'hidden')) {
                layoutdata.push({
                    dataIndex: field.fieldid,
                    width: this.fieldsData[field.fieldid].width,
                    sequence: parseInt(this.fieldsData[field.fieldid].sequence, 10),
                    isHidden: this.fieldsData[field.fieldid].display == 'yes' ? false : true
                });
            }
            this.backend.postRequest('KReporter/core/savelayout/' + this.model.id, {}, {layout: layoutdata}).subscribe(result => {
                if (result.success) {
                    this.toast.sendToast('Layout saved');
                }
            });
        }
    }

    /**
     * returns the field width for a given field id
     *
     * @param fieldid
     */
    private getFieldWidth(fieldid) {
        return Math.round(this.fieldsData[fieldid].width / this.totalWidth * 100) + '%';
    }

    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    private getSortIcon(fieldid): string {
        return 'arrowdown';
        //    return 'arrowup';
    }

    /**
     * check function if the previous button should be disabled
     */
    get prevDisbaled() {
        return this.currentPage <= 1;
    }

    /**
     * navigate tot he first page
     */
    private firstPage() {
        this.currentPage = 1;
        this.getPresentation();
    }

    /**
     * navigate to the previous page
     */
    private prevPage() {
        this.currentPage--;
        this.getPresentation();
    }

    /**
     * check function if the next button should be disabled
     */
    get nextDisabled() {
        return this.currentPage * this.listEntries >= this.presData.count;
    }

    /**
     * navigate to the next page
     */
    private nextPage() {
        this.currentPage++;
        this.getPresentation();
    }

    /**
     * navigate to the last page
     */
    private lastPage() {
        this.currentPage = Math.ceil(this.totalRecords / this.listEntries);
        this.getPresentation();
    }

    /**
     * opens the select fields modal
     */
    private selectFields() {
        this.modal.openModal('ReporterDetailSelectFieldsModal', true, this.injector).subscribe(modalref => {
            modalref.instance.presentationFields = this.presData.reportmetadata.fields;
        });
    }
}
