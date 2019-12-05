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
 * @module AddComponentsModule
 */
import {
    Component,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    NgZone, EventEmitter
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'spice-map-selector',
    templateUrl: './src/include/spicemap/templates/spicemapselector.html'
})
export class SpiceMapSelector implements AfterViewInit {
    @ViewChild('mapelement', {read: ViewContainerRef, static: true}) private mapelement: ViewContainerRef;
    @ViewChild('headerinput', {read: ViewContainerRef, static: true}) private headerinput: ViewContainerRef;

    public self: any;

    private map: any = {};
    private circle: any = {};

    private lat: any;
    private lng: any;
    private _radius = 10;

    private searchterm: string = '';

    private geoSearchemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private zone: NgZone,
        private language: language,
        private metadata: metadata,
        private libloader: libloader
    ) {

    }

    get radius() {
        return this._radius;
    }

    set radius(newradius) {
        this._radius = newradius;
        if (this.circle) {
            this.circle.setRadius(this._radius * 1000);
        }
    }

    public ngAfterViewInit() {
        this.libloader.loadLib('maps.googleapis').subscribe(
            (next) => {
                navigator.geolocation.getCurrentPosition(position => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                    this.renderMap();
                }, () => {
                    this.renderMap();
                });
            }
        );
    }

    private renderMap() {
        let center = {lat: 48.2, lng: 16.3};
        if (this.lng && this.lat) {
            center = {
                lat: this.lat,
                lng: this.lng
            };
        }
        // this.map = new google.maps.Map(document.getElementById(this.mapId), {
        this.map = new google.maps.Map(this.mapelement.element.nativeElement, {
            center: center,
            scrollwheel: true,
            streetViewControl: false,
            zoom: 11,
            minZoom: 8
        });

        this.circle = new google.maps.Circle({
            strokeColor: 'red',
            fillColor: '#dddddd',
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            draggable: true,
            editable: true,
            zIndex: 1,
            map: this.map,
            center: center,
            radius: this._radius * 1000
        });

        google.maps.event.addListener(this.circle, 'center_changed', () => {
            this.lat = this.circle.getCenter().lat();
            this.lng = this.circle.getCenter().lng();
        });
        google.maps.event.addListener(this.circle, 'radius_changed', () => {
            this._radius = Math.round(this.circle.getRadius() / 100) / 10;
        });
    }

    /**
     * close the modal window
     */
    private close() {
        this.self.destroy();
    }

    /**
     * set the data
     */
    private set() {
        this.geoSearchemitter.emit({
            radius: this._radius,
            lat: this.lat,
            lng: this.lng
        });
        this.close();
    }

    /**
     * clear the search value
     */
    private clear() {
        this.geoSearchemitter.emit(false);
        this.close();
    }

    /**
     * fired from teh google places search input
     *
     * @param details the details on the address
     */
    private setDetails(details) {
        this.map.setCenter({lat: details.address.latitude, lng: details.address.longitude});
        this.circle.setCenter({lat: details.address.latitude, lng: details.address.longitude});
    }

    /**
     * caclulate the proper style for the map container
     */
    get mapStyle() {
        let rect = this.headerinput.element.nativeElement.getBoundingClientRect();
        return {
            width: '100%',
            height: 'calc(100% - ' + this.headerinput.element.nativeElement.getBoundingClientRect().height + 'px)'
        };
    }


}
