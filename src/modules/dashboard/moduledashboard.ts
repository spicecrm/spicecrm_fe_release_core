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
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {Subject, Observable, of, Subscription, pipe} from "rxjs";
import {take} from "rxjs/operators";
import {
    Component,
    Input,
    NgModule,
    AfterViewInit,
    AfterViewChecked,
    OnInit,
    OnDestroy,
    OnChanges,
    Renderer,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    Injectable,
    EventEmitter,
    Renderer2,
    Output,
    SimpleChanges
} from "@angular/core";
import {RouterModule, Router, Routes} from "@angular/router";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

declare var moment: any;

import {loginCheck} from "../../services/login.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {modellist} from "../../services/modellist.service";
import {modelutilities} from "../../services/modelutilities.service";
import {view} from "../../services/view.service";
import {fts} from "../../services/fts.service";
import {recent} from "../../services/recent.service";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {reminder} from "../../services/reminder.service";
import {navigation} from "../../services/navigation.service";
import {userpreferences} from "../../services/userpreferences.service";
import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {dashboardlayout} from "./services/dashboardlayout.service";
import /*embed*/ {DashboardView} from "./components/dashboardview";
import /*embed*/ {DashboardSelectPanel} from "./components/dashboardselectpanel";
import /*embed*/ {DashboardContainer} from "./components/dashboardcontainer";
import /*embed*/ {DashboardContainerHeader} from "./components/dashboardcontainerheader";
import /*embed*/ {DashboardContainerHomeHeader} from "./components/dashboardcontainerhomeheader";
import /*embed*/ {DashboardContainerBody} from "./components/dashboardcontainerbody";
import /*embed*/ {DashboardContainerElement} from "./components/dashboardcontainerelement";
import /*embed*/ {DashboardAddElement} from "./components/dashboardaddelement";
import /*embed*/ {DashboardWeatherDashlet} from "./components/dashboardweatherdashlet";
import /*embed*/ {DashboardGenericDashlet} from "./components/dashboardgenericdashlet";
import /*embed*/ {DashboardGenericDashletRow} from "./components/dashboardgenericdashletrow";
import /*embed*/ {DashboardRemindersDashlet} from "./components/dashboardremindersdashlet";
import /*embed*/ {DashboardComponentset} from "./components/dashboardcomponentset";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        DashboardView,
        DashboardSelectPanel,
        DashboardContainer,
        DashboardContainerHeader,
        DashboardContainerHomeHeader,
        DashboardContainerBody,
        DashboardContainerElement,
        DashboardAddElement,
        DashboardWeatherDashlet,
        DashboardGenericDashlet,
        DashboardGenericDashletRow,
        DashboardRemindersDashlet,
        DashboardComponentset,
    ],
    exports: [
        DashboardContainer,
    ]
})
export class ModuleDashboard {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}