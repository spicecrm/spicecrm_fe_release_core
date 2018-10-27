/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    Input,
    AfterViewInit,

    OnInit,
    ViewChild,
    ViewContainerRef,
    NgZone
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {Router}   from "@angular/router";

declare var System: any;
declare var google: any;

@Component({
    selector: "spice-map",
    templateUrl: "./src/addcomponents/templates/spicemap.html"
})
export class SpiceMap implements AfterViewInit {
    @ViewChild('mapelement', {read: ViewContainerRef}) mapelement: ViewContainerRef;
    componentconfig: any = {};
    private _apiLoadingPromise: Promise<any>;
    map: any = {};
    mapBoundaries: any = {};
    modelMarker: any = {};
    surroundingFunction: any = {};
    surroundingMarkers: Array<any> = [];
    surroundingObjects: Array<any> = [];

    listfields: Array<any> = [];

    constructor(private zone:NgZone, private language: language, private model: model, private modelutilities: modelutilities, private configuration: configurationService, private backend: backend, private router: Router, private metadata: metadata) {

    }

    getListFields() {
        return this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    ngAfterViewInit() {

        if (!this.isApiLoaded()) {
            this.loadApi()
            this._apiLoadingPromise.then(() => {
                this.renderMap();
            });
        } else {
            this.renderMap();
        }
    }

    renderMap() {
        let center = {lat: 48.2, lng: 16.3};
        if (this.model.data[this.componentconfig.key + '_address_longitude'] && this.model.data[this.componentconfig.key + '_address_latitude'])
            center = {
                lat: this.model.data[this.componentconfig.key + '_address_latitude'],
                lng: this.model.data[this.componentconfig.key + '_address_longitude']
            };

        // this.map = new google.maps.Map(document.getElementById(this.mapId), {
        this.map = new google.maps.Map(this.mapelement.element.nativeElement, {
            center: center,
            scrollwheel: true,
            zoom: 14,
            minZoom: 8
        });

        // add the element on the map
        if (this.model.data[this.componentconfig.key + '_address_longitude'] && this.model.data[this.componentconfig.key + '_address_latitude']) {
            this.modelMarker = new google.maps.Marker({
                position: center,
                map: this.map,
                // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                icon: 'http://maps.google.com/mapfiles/ms/micons/red-dot.png',
                title: this.model.data.summary_text
            });
        }

        this.map.addListener('bounds_changed', () => {
            this.mapBoundaries = this.map.getBounds();
            if (this.surroundingFunction) window.clearTimeout(this.surroundingFunction);
            this.surroundingFunction = window.setTimeout(() => this.getSurrounding(), 500);
        });

    }

    reCenter() {
        this.map.setCenter(this.modelMarker.position);
    }

    private _loadScript(): void {
        let script = (<any>document).createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=__onGoogleLoaded&key=' + this.configuration.data.googleAPI;
        script.type = 'text/javascript';

        (<any>document).getElementsByTagName('head')[0].appendChild(script);
    }

    isApiLoaded(): boolean {
        return (<any>window).google && (<any>window).google.maps ? true : false;
    }

    loadApi(): void {
        if (!this._apiLoadingPromise) {
            this._apiLoadingPromise = new Promise((resolve) => {
                (<any>window)['__onGoogleLoaded'] = (ev) => {
                    resolve('google maps api loaded');
                }

                this._loadScript();
            })
        }
    }

    getSurrounding() {

        // clear all curent markers
        for (let marker of this.surroundingMarkers) {
            marker.setMap(null);
        }
        this.surroundingMarkers = [];

        // get boundaries
        let ne = this.mapBoundaries.getNorthEast();
        let sw = this.mapBoundaries.getSouthWest();

        let searchfields = {
            join: 'AND',
            conditions: [
                {
                    field: 'id',
                    operator: '<>',
                    value: this.model.id
                }, {
                    field: this.componentconfig.key + '_address_longitude',
                    operator: '<',
                    value: ne.lng()
                }, {
                    field: this.componentconfig.key + '_address_latitude',
                    operator: '<',
                    value: ne.lat()
                }, {
                    field: this.componentconfig.key + '_address_longitude',
                    operator: '>',
                    value: sw.lng()
                }, {
                    field: this.componentconfig.key + '_address_latitude',
                    operator: '>',
                    value: sw.lat()
                }
            ]
        };

        let params = {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(['id', 'name', this.componentconfig.key + '_address_longitude', this.componentconfig.key + '_address_latitude'])
        };

        this.backend.getRequest('module/' + this.model.module, params).subscribe((response: any) => {
            for (let itemIndex in response.list) {
                for (let fieldName in response.list[itemIndex]) {
                    response.list[itemIndex][fieldName] = this.modelutilities.backend2spice(this.model.module, fieldName, response.list[itemIndex][fieldName]);
                }


                let thisMarker = new google.maps.Marker({
                    position: {
                        lat: response.list[itemIndex][this.componentconfig.key + '_address_latitude'],
                        lng: response.list[itemIndex][this.componentconfig.key + '_address_longitude']
                    },
                    map: this.map,
                    title: response.list[itemIndex].summary_text,
                    icon: 'http://maps.google.com/mapfiles/ms/micons/green.png',
                    sugarId: response.list[itemIndex].id,
                    sugarModule: this.model.module,
                });

                this.surroundingMarkers.push(thisMarker)
            }

            this.surroundingObjects = response.list;

            // trigger change detection
            this.zone.run(()=>{
            });
        });

    }

    mouseOver(id){
        this.surroundingMarkers.some(marker => {
            if(marker.sugarId === id){
                marker.setIcon('http://maps.google.com/mapfiles/ms/micons/yellow-dot.png')
                return true;
            }
        })
    }
    mouseOut(id){
        this.surroundingMarkers.some(marker => {
            if(marker.sugarId === id){
                marker.setIcon('http://maps.google.com/mapfiles/ms/micons/green.png')
                return true;
            }
        })
    }
}