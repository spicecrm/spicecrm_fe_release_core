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
 * @module GlobalComponents
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {favorite} from '../../../services/favorite.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'spice-favorites-item',
    templateUrl: './src/include/spicefavorites/templates/spicefavoritesitem.html',
    providers: [model, view]
})
export class SpiceFavoritesItem implements OnInit {

    /**
     * thjt eitem that is passed in with the data for the favorite
     */
    @Input() private item: any = {};

    /**
     * the main fieldset that is rendered in the upper line. If none is found teh summary_text is rendered
     */
    private mainfieldset: string;

    /**
     * the sub fieldset rendered in the sub-line
     */
    private subfieldsetfields: any[];

    constructor(private model: model, private language: language, private metadata: metadata, private view: view, private favorite: favorite) {
        this.view.displayLabels = false;
    }

    /**
     * initialize the model and load the config
     */
    public ngOnInit() {
        // initialize the moedl
        this.initializeModel();

        // load the config
        this.loadConfig();

    }

    /**
     * initializes the model from the input item
     */
    private initializeModel() {
        this.model.module = this.item.module_name;
        this.model.id = this.item.item_id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item.data);
    }

    /**
     * loads the componentconfig and sets the variables
     */
    private loadConfig() {

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);

        this.mainfieldset = componentconfig.mainfieldset;
        if (componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
    }

    /**
     * delete favorite
     */
    private deleteFavorite() {
        this.favorite.deleteFavorite(this.model.module, this.model.id);
    }
}
