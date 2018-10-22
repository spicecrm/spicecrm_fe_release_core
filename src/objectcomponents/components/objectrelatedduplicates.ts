/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, AfterViewInit, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicates.html'
})
export class ObjectRelatedDuplicates implements AfterViewInit {
    componentconfig: any = {};
    displayitems: number = 5;

    duplicates: Array<any> = [];
    hideDuplicates: boolean = true;

    constructor(private language: language, private model: model, private toast: toast) {

    }

    ngAfterViewInit() {
        this.checkDuplicates();
    }

    toggleDuplicates(){
        this.hideDuplicates = !this.hideDuplicates;
    }

    getToggleIcon(){
        return this.hideDuplicates ? 'down' : 'up';
    }

    merged(merged){
        if(merged) this.checkDuplicates();
    }

    get showMergeButton(){
        return this.duplicates.length > 0 && this.model.checkAccess('edit');
    }

    checkDuplicates(){
        this.duplicates = [];
        this.model.duplicateCheck().subscribe(data => {
            this.duplicates = data;
        });
    }
}