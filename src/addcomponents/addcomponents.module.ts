/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {NgModule, NgZone, Component, Pipe, ElementRef, Renderer, Input, AfterViewInit, OnDestroy, ViewChild, ViewContainerRef, OnInit, Injectable, EventEmitter} from "@angular/core";

import { metadata } from "../services/metadata.service";
import { model } from "../services/model.service";
import { relatedmodels } from "../services/relatedmodels.service";
import { modellist } from "../services/modellist.service";
import { modelutilities } from "../services/modelutilities.service";
import { broadcast } from "../services/broadcast.service";
import { configurationService } from "../services/configuration.service";
import { session } from "../services/session.service";
import { language } from "../services/language.service";
import { view } from "../services/view.service";
import { popup } from "../services/popup.service";
import { territories } from "../services/territories.service";
import { backend } from "../services/backend.service";
import { userpreferences } from "../services/userpreferences.service";
import { footer } from "../services/footer.service";
import { VersionManagerService } from "../services/versionmanager.service";
import { LibLoaderService } from '../services/libloader.service';

import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {Router}   from "@angular/router";
import {Observable} from "rxjs";

import /*embed*/ {spiceprocess} from "./services/spiceprocess";

import  { ObjectFields }      from "../objectfields/objectfields";
import  { SystemComponents}      from "../systemcomponents/systemcomponents";
import  { ObjectComponents}      from "../objectcomponents/objectcomponents";

import /*embed*/ { SpiceProcess } from "./components/spiceprocess";
import /*embed*/ { SpiceKanban, SpiceKanbanStagePipe } from "./components/spicekanban";
import /*embed*/ { SpiceKanbanTile } from "./components/spicekanbantile";

import /*embed*/ { SpiceMap } from "./components/spicemap";
import /*embed*/ { DhtmlxDiagram } from "./components/dhtmlxdiagram";

import /*embed*/ { SpiceTimestream } from "./components/spicetimestream";
import /*embed*/ { SpiceTimestreamHeader } from "./components/spicetimestreamheader";
import /*embed*/ { SpiceTimestreamLabel } from "./components/spicetimestreamlabel";
import /*embed*/ { SpiceTimestreamItem } from "./components/spicetimestreamitem";

import /*embed*/ { SpiceTerritorriesDetail } from "./components/spiceterritorriesdetail";
import /*embed*/ { SpiceTerritorriesPrimary, SpiceTerritoriesAdditional } from "./components/spiceterritoriesadditional";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents
    ],
    declarations: [
        SpiceProcess,
        SpiceKanban,
        SpiceKanbanStagePipe,
        SpiceKanbanTile,
        SpiceMap,
        DhtmlxDiagram,
        SpiceTimestream,
        SpiceTimestreamHeader,
        SpiceTimestreamLabel,
        SpiceTimestreamItem,
        SpiceTerritorriesDetail,
        SpiceTerritorriesPrimary,
        SpiceTerritoriesAdditional
    ],
    entryComponents: [
        SpiceProcess,
        SpiceKanban,
        SpiceMap,
        SpiceTerritorriesDetail
    ],
    exports: [
        SpiceProcess,
        SpiceKanban,
        SpiceMap,
        DhtmlxDiagram
    ]
})
export class AddComponentsModule {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
