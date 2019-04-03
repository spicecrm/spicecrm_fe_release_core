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
import {Component, Input, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-list-item]',
    templateUrl: './src/objectcomponents/templates/objectlistitem.html',
    providers: [model, view],
    styles: [
        ':host /deep/ field-container global-button-icon {display:none;}',
        ':host:hover /deep/ field-container global-button-icon {display:inline;}',
    ]
})
export class ObjectListItem implements OnInit {

    @Input() private rowselect: boolean = false;
    @Input() private rowselectdisabled: boolean = false;
    @Input() private listFields: any[] = [];
    @Input() private listItem: any = {};
    @Input() private inlineedit: boolean = false;
    @Input() private displaylinks: boolean = true;

    // input param to determine if theaction menu is shown for the model
    @Input() private showActionMenu: boolean = true;

    constructor(private model: model, private modelutilities: modelutilities, private modellist: modellist, private view: view, private router: Router, private language: language) {
    }

    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.id = this.listItem.id;
        this.model.data = this.modelutilities.backendModel2spice(this.modellist.module, this.listItem);
        this.model.initializeFieldsStati();

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
        this.view.displayLinks = this.displaylinks;
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}
