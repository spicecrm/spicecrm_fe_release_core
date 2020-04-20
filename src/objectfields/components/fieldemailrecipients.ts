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
 * @module ObjectFields
 */
import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    templateUrl: './src/objectfields/templates/fieldemailrecipients.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldEmailRecipients extends fieldGeneric implements OnInit {

    public searchResults: any[] = [];
    private isAdding: boolean = false;
    private addAddress: string = '';
    private searchTimeOut: any = undefined;
    private showSearchResults: boolean = false;
    private searchResultsLoading: boolean = false;
    private clickListener: any;

    @ViewChild('addAddressInput', {read: ViewContainerRef, static: true}) private addAddressInput: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private renderer: Renderer2, private elementRef: ElementRef) {
        super(model, view, language, metadata, router);
    }

    get addresstype() {
        return this.fieldconfig.addresstype ? this.fieldconfig.addresstype : 'from';
    }

    get inputSize() {
        if (this.addAddress.length > 20) {
            return this.addAddress.length < 55 ? this.addAddress.length + 5 : 55;
        }
        return 20;
    }

    get addrArray() {
        let addressArray = [];
        if (this.model.data.recipient_addresses) {
            for (let recipient_addresse of this.model.data.recipient_addresses) {
                if (recipient_addresse.address_type == this.addresstype && recipient_addresse.deleted != '1') {
                    addressArray.push(recipient_addresse);
                }
            }
        }
        return addressArray;
    }

    public ngOnInit() {
        super.ngOnInit();

        // try to determine addresses from Parent
        try {
            if (this.addresstype == 'to' && this.model.data.recipient_addresses.length == 0 && this.model.getField('parent_type') && this.model.getField('parent_id')) {
                this.backend.getRequest(`module/${this.model.getField('parent_type')}/${this.model.getField('parent_id')}`).subscribe(parentdata => {
                    if (parentdata.email1) {
                        this.model.data.recipient_addresses = [{
                            parent_type: this.model.getField('parent_type'),
                            parent_id: this.model.getField('parent_id'),
                            email_address: parentdata.email1,
                            id: this.model.generateGuid(),
                            address_type: 'to'
                        }];
                    }
                });
            }
        } catch (e) {
            this.model.data.recipient_addresses = [];
        }
    }

    private closeSearchDialog() {
        // close the cliklistener sine the component is gone
        if (this.clickListener) {
            this.clickListener();
        }
        this.searchResults = [];
        this.showSearchResults = false;
    }

    private onClick() {
        this.isAdding = true;
    }

    private onBlur() {
        if (this.addAddress == '') this.isAdding = false;
    }

    private removeAddress(e, removeid) {
        // stop the event here
        e.preventDefault();
        e.stopPropagation();

        // handle the deletion
        for (let address of this.model.data.recipient_addresses) {
            if (address.id == removeid) {
                address.deleted = '1';
                return;
            }
        }
    }

    private onKeyUp(event) {
        // handle the key pressed
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.checkEmailAddress();
                break;
            case ',':
                this.addAddress = this.addAddress.substring(0, this.addAddress.length - 1);
                this.checkEmailAddress();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    // click outside -> check validation -> insert email
    @HostListener('document:click')
    public clickout() {
        this.checkEmailAddress();
    }

    private checkEmailAddress() {

        // clear timeout if one is set
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        // if the atring is an email address add it .. else do search
        if (this.validateEmail(this.addAddress)) {
            if (!this.model.data.recipient_addresses) {
                this.model.data.recipient_addresses = [];
            }

            this.model.data.recipient_addresses.push({
                id: this.model.generateGuid(),
                address_type: this.addresstype,
                email_address: this.addAddress
            });

            // clear the address string, the resuklts and hide the show dialog
            this.addAddress = '';
            this.closeSearchDialog();


        } else {
            this.doSearch();
        }
    }

    private doSearch() {
        if (this.addAddress !== '') {
            this.searchResults = [];
            this.showSearchResults = true;
            this.searchResultsLoading = true;

            this.clickListener = this.renderer.listen('document', 'click', (event) => this.handleClick(event));

            this.backend.postRequest('EmailAddresses/' + this.addAddress).subscribe(results => {
                if (results.length > 0) {
                    this.searchResults = results;
                } else {
                    this.closeSearchDialog();
                }

                this.searchResultsLoading = false;
            });
        }
    }

    private handleClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchDialog();
            this.addAddress = '';
            this.isAdding = false;
        }
    }

    private selectAddress(address) {

        if (!this.model.data.recipient_addresses) {
            this.model.data.recipient_addresses = [];
        }

        this.model.data.recipient_addresses.push({
            id: this.model.generateGuid(),
            address_type: this.addresstype,
            email_address: address.email_address,
            email_address_id: address.email_address_id,
            parent_type: address.module,
            parent_id: address.id
        });
        // lear the search sting
        this.addAddress = '';

        // hid teh input box
        this.isAdding = false;

        // close the search dropdown
        this.closeSearchDialog();
    }

    private validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
