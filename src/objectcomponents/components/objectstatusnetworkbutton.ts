/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, Renderer2, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

declare var moment: any;

@Component({
    selector: 'object-status-network-button',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbutton.html'
})
export class ObjectStatusNetworkButton implements OnInit{

    isOpen: boolean = false;
    clickListener: any;
    statusField: string = '';
    statusNetwork: Array<any> = [];
    prmiaryStatus: any = {};
    secondaryStatuses: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {

    }

    get isDisabled(){
        return this.model.isEditing || !this.model.checkAccess('edit');
    }

    get isManaged(){
        return this.statusField != '' && this.primaryItem !== false && !this.isDisabled;
    }

    get primaryItem() {
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {
                return statusnetworkitem;
            }
        }

        return false;
    }

    get secondaryItems(){
        let retArray = []; let firstHit = false;
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {

                if(firstHit){
                    retArray.push(statusnetworkitem);
                }

                if(!firstHit) firstHit = true;
            }
        }
        return retArray
    }

    ngOnInit(){
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if(statusmanaged != false){
            this.statusField = statusmanaged.statusField;
            this.statusNetwork = statusmanaged.statusNetwork;
        }
    }

    toggleOpen(){
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    private closeDropdown(){
        this.isOpen = false;
    }

    setStatus(newStatus){
        this.model.startEdit();
        this.model.setField(this.statusField, newStatus);
        if(this.model.validate()){
            this.model.save()
        } else {
            this.model.edit();
        }
    }

}