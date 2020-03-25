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
import {Component, OnInit} from '@angular/core';

import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

/**
 * a modal that allows the user to choose from fields for a report
 */
@Component({
    templateUrl: './src/modules/reports/templates/reporterdetailselectfieldsmodal.html'
})
export class ReporterDetailSelectFieldsModal implements OnInit {

    /**
     * reference to self to be able to close the modal
     */
    private self: any = {};

    /**
     * the report fields .. passed in from the view
     */
    private presentationFields: any[] = [];

    /**
     * the remaining available fields
     */
    private availableFields: any[] = [];

    /**
     * the display fields
     */
    private displayFields: any[] = [];

    /**
     * the list fo selected fields
     */
    private selectedAvailableFields: any[] = [];
    private selectedListFields: any[] = [];

    /**
     * load the modal and initlaize the fields from the modellist vs the ones available
     *
     * @param metadata
     * @param language
     * @param modellist
     */
    constructor(private metadata: metadata, private language: language, private model: model) {
    }

    /**
     * builds the field arrays
     */
    public ngOnInit(): void {
        this.availableFields = this.presentationFields.filter((field => field.display == 'no'));
        this.displayFields = this.presentationFields.filter((field => field.display == 'yes'));

        // sort the availabel fields if we have any
        if (this.availableFields.length > 0) {
            this.sortAvailableFields();
        }

        this.displayFields.sort((a, b) => parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? -1 : 1);
    }

    /**
     * sorts the available fields
     */
    private sortAvailableFields() {
        this.availableFields = this.availableFields.sort((a, b) => {
            return this.language.getLabel(a.name).toLowerCase() > this.language.getLabel(b.name).toLowerCase() ? 1 : -1;
        });
    }

    /**
     * close the modal
     */
    private close(): void {
        this.self.destroy();
    }

    /**
     * check if we can save (at least one fields needs to be selected
     */
    private canSet(): boolean {
        return this.displayFields.length > 0;
    }

    /**
     * save the fieldsettings
     */
    private set(): void {
        if (this.canSet()) {
            let sequence = 1;
            for (let displayField of this.displayFields) {
                displayField.display = 'yes';
                displayField.sequence = sequence;
                if(!displayField.width) displayField.width = 25;
                sequence++;
            }
            for (let availableField of this.availableFields) {
                availableField.display = 'no';
                availableField.sequence = sequence;
                sequence++;
            }
            this.presentationFields.sort((a, b) => parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1);
            this.close();
        }
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    /*
     select the field when clicked int he container
     */
    private selectField(container, fieldid) {
        switch (container) {
            case 'available':
                this.selectedAvailableFields = [fieldid];
                break;
            case 'list':
                this.selectedListFields = [fieldid];
                break;
        }
    }

    /*
     function to set the aria-selected attr on a field
     */
    private isSelected(container, field) {
        switch (container) {
            case 'available':
                if (this.selectedAvailableFields.indexOf(field) >= 0) {
                    return true;
                } else {
                    return false;
                }
            case 'list':
                if (this.selectedListFields.indexOf(field) >= 0) {
                    return true;
                } else {
                    return false;
                }
        }
    }

    /*
     move selected field to the othe container
     */
    private moveFields(fromContainer) {
        switch (fromContainer) {
            case 'available':
                this.selectedAvailableFields.forEach((item) => {
                    this.availableFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.displayFields.push(this.availableFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedAvailableFields = [];
                break;
            case 'list':
                this.selectedListFields.forEach((item) => {
                    this.displayFields.some((targetitem, targetindex) => {
                        if (item == targetitem.field) {
                            this.availableFields.push(this.displayFields.splice(targetindex, 1)[0]);
                            return true;
                        }
                    });
                });
                this.selectedListFields = [];
                this.sortAvailableFields();
                break;
        }
    }
}
