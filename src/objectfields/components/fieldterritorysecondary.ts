/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Renderer2, ViewChild, ViewContainerRef, ElementRef, OnInit, Pipe} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {territories} from '../../services/territories.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Pipe({
    name: 'fieldterritorysecondarypipe',
    pure: false
})
export class fieldTerritorySecondaryPipe {

    transform(territories, primary_territory_id) {
        let retValues = [];

        for (let territory of territories)
            if(territory.id != primary_territory_id)
            retValues.push(territory);

        return retValues;
    }
}


@Component({
    templateUrl: './src/objectfields/templates/fieldterritorysecondary.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldTerritorySecondary extends fieldGeneric {

    isAdding: boolean = false;
    //territories: Array<any> = [];
    territorySearchOpen: boolean = false;
    territorySearchTerm: string = '';
    clickListener: any;
    currentHash = '';

    @ViewChild('addAddressInput', {read: ViewContainerRef}) addAddressInput: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private renderer: Renderer2, private elementRef: ElementRef, private territoriesService: territories) {
        super(model, view, language, metadata, router);

    }

    get primary_territory_id(){
        return this.model.getFieldValue('spiceacl_primary_territory');
    }

    get territories(){
        try {
            return JSON.parse(this.model.data.spiceacl_secondary_territories)
        } catch(e){
            return [];
        }
    }

    set territories(value){
        this.model.data.spiceacl_secondary_territories = JSON.stringify(value ? value : []);
    }

    private onClick() {
        this.isAdding = true;
    }

    private onBlur() {
        if (this.territorySearchTerm == '')
            this.isAdding = false;
    }

    private removeTerritory(e, territoryid) {
        // stop the event here
        e.preventDefault();
        e.stopPropagation();

        // handle the deletion

        let territories = this.territories;
        territories.some((territory, index) => {
            if (territory.id == territoryid) {
                territories.splice(index, 1);
                return true;
            }
        })
        this.territories = territories;

    }


    closeSearchDialog() {
        // close the cliklistener sine the component is gone
        this.clickListener();
        this.territorySearchOpen = false;
    }

    private handleClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchDialog();
            this.territorySearchTerm = '';
            this.isAdding = false;
        }
    }

    private addTerritory(territory) {
        let territories = this.territories;
        if(territories == '') territories = [];
        territories.push(territory);
        this.territories = territories;
        this.territorySearchTerm = '';
        this.isAdding = false;

    }

    territoryName(territoryId) {
        return this.territoriesService.getTerritoryName(this.model.module, territoryId);
    }
}
