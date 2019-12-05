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
import {
    Component, Input, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modalwindow} from "../../services/modalwindow.service";

/**
 * renders a modal window to add or edit an object record
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objecteditmodal.html',
    providers: [view, modalwindow]
})
export class ObjectEditModal implements OnInit {
    /**
     * a reference to the modal content to have a reference to scrolling
     */
    @ViewChild('modalContent', {read: ViewContainerRef, static: true}) private modalContent: ViewContainerRef;
    /**
     * the componentconfig that gets passed in when the modal is created
     */
    private componentconfig: any = {};
    /**
     * the actionset items to be rendered in the modal
     */
    private actionSetItems: any = [];

    /**
     * ToDo: add documentation what we need this for
     */
    private actionSubject: Subject<any> = new Subject<any>();

    /**
     * this emits the data ... is referenced from the modal save button that handles this
     */
    public action$: Observable<any> = new Observable<any>();

    /**
     * set to true (default) to have the modal check for duplicates
     * ToDo: implement this as config paramater
     */
    private doDuplicateCheck: boolean = true;

    /**
     * local copy of the dfuplicates from the model
     */
    private duplicates: any[] = [];

    /**
     * indicates if the user has chosen to display duplicates.
     */
    private showDuplicates: boolean = false;

    /**
     * set if the known duplicates table should be shown
     */
    private showDuplicatesTable: boolean = false;

    @Input() public preventGoingToRecord = false;

    /**
     * a reference to the modal itself so the modal cann close itself
     */
    private self: any = {};

    constructor(
        private router: Router,
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal,
        private modalwindow: modalwindow
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
        this.model.isEditing = true;

        this.action$ = this.actionSubject.asObservable();
    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
        this.actionSetItems = this.metadata.getActionSetItems(this.componentconfig.actionset);

        // set the reference to self ..
        // helper service so buttons can destroy the window
        this.modalwindow.self = this.self;
    }

    get actionset() {
        return this.componentconfig.actionset;
    }

    private closeModal() {
        // cancel Edit
        this.model.cancelEdit();

        // emit that we saved;
        this.actionSubject.next(false);
        this.actionSubject.complete();

        // destroy the component
        this.self.destroy();
    }

    /**
     * a getter for the modal header which text shoudl be displayed
     */
    get modalHeader() {
        return this.model.module != '' ? this.language.getModuleName(this.model.module, true) : '';
    }

    /**
     * returns the grow entry from teh componentconfig
     */
    get grow() {
        return this.componentconfig.grow;
    }

    /**
     * handles the event emitted by the actionset
     *
     * @param event
     */
    private handleAction(event) {
        switch (event) {
            case 'savegodetail':
                this.actionSubject.next(event);
                this.model.goDetail();
                break;
            case 'save':
                this.actionSubject.next(event);
                break;
            default:
                this.actionSubject.next(false);
        }
        this.actionSubject.complete();
        this.self.destroy();
    }

    /**
     * saves the data and if not done before does a duplicate check before saving
     *
     * @param goDetail if set to true the system will naviaget to the detail fo teh record after saving
     */

    /*
    private save(goDetail: boolean = false) {
        if (this.preventGoingToRecord) goDetail = false;
        if (this.model.validate()) {
            if (this.model.isNew && this.doDuplicateCheck && !this.showDuplicatesTable && this.duplicateCheckEnabled) {
                this.model.duplicateCheck(true).subscribe(dupdata => {
                    if (dupdata.length > 0) {
                        this.model.duplicates = dupdata;
                        this.modalContent.element.nativeElement.scrollTop = 0;
                        this.showDuplicatesTable = true;
                    } else {
                        this.saveModel(goDetail);
                    }
                });
            } else {
                this.saveModel(goDetail);
            }
        } else {
            console.warn(this.model.messages);
        }
    }

     */

    /**
     * returns if the duplicate check iss enabled for the module. Used for the visiblity of he duplicates button in the view
     */
    get duplicateCheckEnabled() {
        return this.metadata.getModuleDuplicatecheck(this.model.module);
    }

    /**
     * save the model but without duplicate check
     *
     * @param goDetail if set to true the system will naviaget to the detail fo teh record after saving
     */
    /*
    private saveModel(goDetail: boolean = false) {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.model.save(true).subscribe(status => {
                    this.model.isEditing = false;
                    if (status) {
                        // emit that we saved;
                        this.actionSubject.next(this.model.data);
                        this.actionSubject.complete();

                        /// if go Deail go to record)
                        if (goDetail) {
                            this.model.goDetail();
                        }

                        // destroy the component
                        this.self.destroy();
                    }
                    modalRef.instance.self.destroy();
                },
                error => {
                    modalRef.instance.self.destroy();
                });
        });
    }
    */

    /*
    private saveToRelated(related_module: string) {
        if (!this.model.validate()) {
            return false;
        }

        this.model.save().subscribe(
            status => {
                let parent = this.model.clone(); // has to be BEFORE closeModal()!
                this.closeModal();

                this.model.reset();
                this.model.module = related_module;

                this.model.initialize(parent);
                this.model.data.acl = {edit: true}; // bwuäh...
                this.model.isNew = true;
                this.model.edit();
            }
        );
    }

    private saveAndGoToRelated(related_module: string, related_id) {
        if (!this.model.validate()) {
            return false;
        }

        this.model.save().subscribe(status => {
            this.closeModal();
            this.router.navigate(['/module/' + related_module + '/' + related_id]);
        });
    }
    */

    /*
    private setModule(module) {
        this.model.module = module;
    }
    */

}
