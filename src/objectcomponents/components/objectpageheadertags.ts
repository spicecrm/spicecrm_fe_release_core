/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component, ElementRef, ViewChild, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {footer} from '../../services/footer.service';
import { language } from "../../services/language.service";
import { modal } from '../../services/modal.service';

@Component({
    selector: 'object-page-header-tags',
    templateUrl: './src/objectcomponents/templates/objectpageheadertags.html',
    styles: [
        '.badgeListContainer { overflow-y: hidden; margin-bottom: -0.125rem; }',
        'ul { line-height: 1.7; }',
        'li { margin-bottom: 0.125rem; }',
        '.badgeListContainer.open { overflow-y: visible; height: auto !important; }',
        '.slds-badge { text-transform: none; font-size: 0.75rem; padding-top: 0.1875rem; line-height: 2.333; }', // 0.75rem == slds-text-body_small
    ]
})
export class ObjectPageHeaderTags {

    @ViewChild('badgeList') badgeList: ElementRef;
    @ViewChild('badgeListContainer') badgeListContainer: ElementRef;

    listIsExpanded = false;
    tags = [ ' ' ];

    heightOfBadge: number = null;

    constructor( private model: model, private metadata: metadata, private footer: footer, private cd: ChangeDetectorRef, private language: language, private modalservice: modal )  {    }

    ngOnInit() {
        if ( this.model.isLoading )
            this.model.data$.subscribe( () => { this.parseTags(); } );
        else
            this.parseTags();
    }

    ngAfterViewChecked() {
        if ( this.heightOfBadge === null && this.badgeList && this.badgeList.nativeElement && this.badgeList.nativeElement.children[0] ) {
            this.heightOfBadge = this.getHeightOfBadge();
            this.badgeListContainer.nativeElement.style.height = this.heightOfBadge + 'px';
            // if ( !this.model.isLoading ) this.parseTags();
            this.cd.detectChanges();
        }
    }

    get taggingEnabled() {
        return this.metadata.checkTagging( this.model.module );
    }

    parseTags() {
        if( !this.model.data.tags || this.model.data.tags === '' ) this.tags = [];
        else {
            try {
                this.tags = JSON.parse( this.model.data.tags );
            } catch( e ) {
                this.tags = [];
            }
        }
    }

    get listIsExpandable() {
        if ( this.heightOfBadge !== null )
            return this.heightOfBadge !== this.getHeightOfBadgeList();
        else return false;
    }

    editTags(){
        this.modalservice.openModal('ObjectPageHeaderTagPicker').subscribe(cmp => {
            cmp.instance.model = this.model;
        });
        this.listIsExpanded = false;
    }

    getHeightOfBadge() {
        return Number( getComputedStyle( this.badgeList.nativeElement.children[0], null ).height.replace( /px$/, '' ))
            + Number( getComputedStyle( this.badgeList.nativeElement.children[0], null ).marginBottom.replace( /px$/, '' ));
    }

    getHeightOfBadgeList() {
        return Number( getComputedStyle( this.badgeList.nativeElement, null ).height.replace( /px$/, '' ));
    }

}