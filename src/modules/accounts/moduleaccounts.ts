/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {CommonModule} from "@angular/common";
import {NgModule, Renderer2, Output, Component, Injectable, EventEmitter, OnInit, AfterViewInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {Subject, Observable} from "rxjs";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {relatedmodels} from "../../services/relatedmodels.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {ACManagerService} from "./services/acmanager.service";
import /*embed*/ { accountHierarchy } from "./services/accounthierarchy.service";

import /*embed*/ {AccountsKPIsOverview} from "./components/accountskpisoverview";
import /*embed*/ {AccountCCDetails} from "./components/accountccdetails";
import /*embed*/ {AccountCCDetailsTab} from "./components/accountccdetailstab";
import /*embed*/ {ContactCCDetails} from "./components/contactccdetails";
import /*embed*/ {ContactCCDetailsTab} from "./components/contactccdetailstab";
import /*embed*/ {AccountsContactsManager} from "./components/accountscontactsmanager";
import /*embed*/ {AccountsContactsManagerDetails} from "./components/accountscontactsmanagerdetails";
import /*embed*/ {AccountsContactsManagerList} from "./components/accountscontactsmanagerlist";
import /*embed*/ {AccountHierarchy} from "./components/accounthierarchy";
import /*embed*/ {AccountHierarchyNode} from "./components/accounthierarchynode";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        AccountsKPIsOverview,
        AccountCCDetails,
        AccountCCDetailsTab,
        ContactCCDetails,
        ContactCCDetailsTab,
        AccountsContactsManager,
        AccountsContactsManagerDetails,
        AccountsContactsManagerList,
        AccountHierarchy,
        AccountHierarchyNode,
    ],
    providers: [
        ACManagerService
    ]
})
export class ModuleAccounts {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}