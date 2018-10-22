/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {ElementRef, Component, Renderer2} from '@angular/core';
import { modellist } from '../../services/modellist.service';
import { modal } from '../../services/modal.service';
import { language } from '../../services/language.service';
import {ObjectListViewSettingsAddlistModal} from "./objectlistviewsettingsaddlistmodal";
import {ObjectListViewSettingsSetfieldsModal} from "./objectlistviewsettingssetfieldsmodal";

@Component({
    selector: 'object-listview-settings',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettings.html',

})
export class ObjectListViewSettings{
    showMenu: boolean = false;
    showAddModal: boolean = false;
    showDeleteModal: boolean = false;
    showDisplayfieldsModal: boolean = false;
    modalMode: string = 'add';
    clickListener: any;

    constructor(
        private language: language,
        private elementRef: ElementRef,
        private modal: modal,
        private modellist: modellist,
        private renderer: Renderer2
    ){

    }

    toggleMenu(){
        this.showMenu = !this.showMenu;

        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
            this.clickListener();
        }
    }

    add(){
        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'add';
        })
    }

    edit()
    {
        if(!this.modellist.checkAccess('edit'))
            return false;

        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'edit';
        })
    }

    setfields()
    {
        if(!this.modellist.checkAccess('edit'))
            return false;

        this.modal.openModal('ObjectListViewSettingsSetfieldsModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        })
    }

    delete()
    {
        if(!this.modellist.checkAccess('delete'))
            return false;

        this.modal.openModal('ObjectListViewSettingsDeletelistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        })
    }

}