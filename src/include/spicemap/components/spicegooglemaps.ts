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
 * @module ModuleReportsMore
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'spice-google-maps',
    templateUrl: './src/include/spicemap/templates/spicegooglemaps.html'
})
export class SpiceGoogleMaps implements AfterViewInit {

    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) private mapContainer: ViewContainerRef;
    private map: any = {};

    constructor(
        private language: language,
        private model: model,
        private libLoader: libloader
    ) {}

    /**
     * @return isApiLoaded: boolean
     */
    get isApiLoaded(): boolean {
        return (window as any).google && (window as any).google.maps;
    }

    /**
     * load google maps library
     */
    public ngAfterViewInit() {
        this.libLoader.loadLib('maps.googleapis').subscribe(() => this.renderMap());
    }

    /**
     * render google map
     */
    private renderMap() {
        this.map = new google.maps.Map(this.mapContainer.element.nativeElement, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }
}
