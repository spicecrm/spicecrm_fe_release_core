/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Output, EventEmitter, ElementRef, Renderer2, forwardRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: "system-googleplaces-search",
    templateUrl: "./src/systemcomponents/templates/systemgoogleplacessearch.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemGooglePlacesSearch),
            multi: true
        }
    ]
})
export class SystemGooglePlacesSearch implements ControlValueAccessor {
    @Output() private details: EventEmitter<any> = new EventEmitter<any>();

    private onChange: (value: string) => void;
    private onTouched: () => void;

    private isenabled: boolean = false;
    private autocompletesearchterm: string = '';
    private autocompleteTimeout: any = undefined;
    private autocompleteResults: any[] = [];
    private autocompleteClickListener: any = undefined;
    private displayAutocompleteResults: boolean = false;
    private isSearching: boolean = false;

    constructor(private language: language, private backend: backend, private configuration: configurationService, private elementref: ElementRef, private renderer: Renderer2) {
        let googleAPIConfig = this.configuration.getCapabilityConfig('google_api');
        if (googleAPIConfig.key && googleAPIConfig.key != '') {
            this.isenabled = true;
        }
    }

    get searchterm() {
        return this.autocompletesearchterm;
    }

    set searchterm(value) {
        this.autocompletesearchterm = value;
        this.onChange(value);

        if (this.isenabled) {
            // set the timeout for the search
            if (this.autocompleteTimeout) {
                window.clearTimeout(this.autocompleteTimeout);
            }
            this.autocompleteTimeout = window.setTimeout(() => this.doAutocomplete(), 500);
        }
    }

    get placeholder() {
        if (this.isenabled) {
            return this.language.getLabel('LBL_SEARCH');
        } else {
            return '';
        }
    }

    private onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults();
        }
    }

    private openSearchResults() {
        this.displayAutocompleteResults = true;
        this.autocompleteClickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementref.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchResutls();
        }
    }

    private closeSearchResutls() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
        this.displayAutocompleteResults = false;
        this.autocompleteResults = [];
    }

    private doAutocomplete() {
        if (this.autocompletesearchterm.length > 3) {
            this.isSearching = true;
            this.backend.getRequest('googleapi/places/search/' + this.autocompletesearchterm).subscribe(
                (res: any) => {
                    if (res.candidates && res.candidates.length > 0) {
                        this.autocompleteResults = res.candidates;
                        this.openSearchResults();
                        this.isSearching = false;
                    } else {
                        this.autocompleteResults = [];
                        this.closeSearchResutls();
                        this.isSearching = false;
                    }
                },
                error => {
                    this.isSearching = false;
                });
        }
    }

    private getDetails(placedetails) {
        this.displayAutocompleteResults = false;
        this.autocompleteResults = []

        // set the value and emit to the model
        this.autocompletesearchterm = placedetails.name;
        this.onChange(placedetails.name);

        this.isSearching = true;

        this.backend.getRequest('googleapi/places/' + placedetails.place_id).subscribe((res: any) => {
                this.details.emit({
                    address: {
                        street: res.address.street,
                        city: res.address.city,
                        postalcode: res.address.postalcode,
                        state: res.address.state,
                        country: res.address.country,
                        latitude: parseFloat(res.address.location.lat),
                        longitude: parseFloat(res.address.location.lng)
                    },
                    formatted_phone_number: res.formatted_phone_number,
                    international_phone_number: res.international_phone_number,
                    website: res.website,
                });
                this.isSearching = false;
            },
            error => {
                this.isSearching = false;
            });
    }

    // for the valueaccessor
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.autocompletesearchterm = value ? value : '';
    }
}
