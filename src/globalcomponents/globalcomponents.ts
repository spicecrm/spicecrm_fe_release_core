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
import {FormsModule}   from "@angular/forms";
import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef, Injectable, Renderer, Renderer2, Input, ElementRef, OnDestroy, OnInit, OnChanges, EventEmitter, Output} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {RouterModule, Routes, Router, ActivationStart, NavigationStart} from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

declare var _: any;
declare var gapi: any;

import {loginService, loginCheck} from "../services/login.service";
import {session} from "../services/session.service";
import {language} from "../services/language.service";
import {configurationService} from "../services/configuration.service";
import {popup} from "../services/popup.service";
import {broadcast} from "../services/broadcast.service";
import {fts} from "../services/fts.service";
import {model} from "../services/model.service";
import {modellist} from "../services/modellist.service";
import {recent} from "../services/recent.service";
import {favorite} from "../services/favorite.service";
import {metadata} from "../services/metadata.service";
import {navigation} from "../services/navigation.service";
import {dockedComposer} from "../services/dockedcomposer.service";
import {view} from "../services/view.service";
import {toast} from "../services/toast.service";
import {footer} from "../services/footer.service";
import {cookie} from "../services/cookie.service";
import { modal } from "../services/modal.service";

import {ObjectFields}      from "../objectfields/objectfields";
import {SystemComponents}      from "../systemcomponents/systemcomponents";

import /*embed*/ {MenuService} from "./services/menu.service";

import /*embed*/ {GlobalHeader} from "./components/globalheader";
import /*embed*/ {GlobalHeaderTop} from "./components/globalheadertop";
import /*embed*/ {GlobalHeaderSearch} from "./components/globalheadersearch";
import /*embed*/ {GlobalHeaderSearchResultsItems} from "./components/globalheadersearchresultsitems";
import /*embed*/ {GlobalHeaderSearchResultsItem} from "./components/globalheadersearchresultsitem";
import /*embed*/ {GlobalHeaderSearchRecentItems} from "./components/globalheadersearchrecentitems";
import /*embed*/ {GlobalHeaderSearchRecentItem} from "./components/globalheadersearchrecentitem";
import /*embed*/ {GlobalHeaderTools} from "./components/globalheadertools";
import /*embed*/ {GlobalHeaderActions} from "./components/globalheaderactions";
import /*embed*/ {GlobalHeaderActionItem} from "./components/globalheaderactionitem";
import /*embed*/ {GlobalHeaderFavorite} from "./components/globalheaderfavorite";
import /*embed*/ {GlobalHeaderWorkbench} from "./components/globalheaderworkbench";
import /*embed*/ {GlobalFooter} from "./components/globalfooter";
import /*embed*/ {GlobalLogin} from "./components/globallogin";
import /*embed*/ {GlobalSetup} from "./components/globalsetup";
import /*embed*/ {GlobalLoginForgotPassword} from "./components/globalloginforgotpassword";
import /*embed*/ {GlobalLoginResetPassword} from "./components/globalloginresetpassword";
import /*embed*/ {GlobalNavigation} from "./components/globalnavigation";
import /*embed*/ {GlobalNavigationMenu} from "./components/globalnavigationmenu";
import /*embed*/ {GlobalNavigationMenuItem} from "./components/globalnavigationmenuitem";
import /*embed*/ {GlobalNavigationMenuItemNew} from "./components/globalnavigationmenuitemnew";
import /*embed*/ {GlobalNavigationMenuItemRoute} from "./components/globalnavigationmenuitemroute";
import /*embed*/ {GlobalNavigationMenuItemIcon} from "./components/globalnavigationmenuitemicon";
import /*embed*/ {GlobalNavigationMenuMore} from "./components/globalnavigationmenumore";
import /*embed*/ {GlobalDockedComposerContainer} from "./components/globaldockedcomposercontainer";
import /*embed*/ {GlobalDockedComposer} from "./components/globaldockedcomposer";
import /*embed*/ {GlobalDockedComposerModal} from "./components/globaldockedcomposermodal";
import /*embed*/ {GlobalDockedComposerOverflow} from "./components/globaldockedcomposeroverflow";
import /*embed*/ {GlobalComposeButton} from "./components/globalcomposebutton";
import /*embed*/ {GlobalAppLauncher} from "./components/globalapplauncher";
import /*embed*/ {GlobalAppLauncherDialog} from "./components/globalapplauncherdialog";


import /*embed*/ {GlobalUser} from "./components/globaluser";
import /*embed*/ {GlobaUserPanel} from "./components/globaluserpanel";

import /*embed*/ {GlobalRecentItems} from "./components/globalrecentitems";
import /*embed*/ {GlobalSearch} from "./components/globalsearch";
import /*embed*/ {GlobalSearchModule} from "./components/globalsearchmodule";
import /*embed*/ {GlobalSearchModuleItem} from "./components/globalsearchmoduleitem";

import /*embed*/ {GlobalNewsFeed} from "./components/globalnewsfeed";
import /*embed*/ {GlobalNewsFeedItem} from "./components/globalnewsfeeditem";
import {VersionManagerService} from "../services/versionmanager.service";

import /*embed*/ {GlobalLoginGoogle} from "./components/globallogingoogle";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        SystemComponents,
        RouterModule.forRoot([
            {path: "login", component: GlobalLogin},
            {path: "setup", component: GlobalSetup},
            {path: "recent", component: GlobalRecentItems, canActivate: [loginCheck]},
            {path: "search", component: GlobalSearch, canActivate: [loginCheck]},
        ])
    ],
    declarations: [
        GlobalNewsFeed,
        GlobalNewsFeedItem,
        GlobalHeader,
        GlobalHeaderTop,
        GlobalHeaderSearch,
        GlobalHeaderSearchResultsItems,
        GlobalHeaderSearchResultsItem,
        GlobalHeaderSearchRecentItems,
        GlobalHeaderSearchRecentItem,
        GlobalHeaderTools,
        GlobalHeaderActions,
        GlobalHeaderActionItem,
        GlobalHeaderFavorite,
        GlobalHeaderWorkbench,
        GlobalFooter,
        GlobalNavigation,
        GlobalNavigationMenu,
        GlobalNavigationMenuItem,
        GlobalNavigationMenuItemNew,
        GlobalNavigationMenuItemRoute,
        GlobalNavigationMenuItemIcon,
        GlobalNavigationMenuMore,
        GlobalLogin,
        GlobalSetup,
        GlobalLoginForgotPassword,
        GlobalLoginResetPassword,
        GlobalUser,
        GlobaUserPanel,
        GlobalAppLauncher,
        GlobalAppLauncherDialog,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerModal,
        GlobalDockedComposerOverflow,
        GlobalComposeButton,
        GlobalRecentItems,
        GlobalSearch,
        GlobalSearchModule,
        GlobalSearchModuleItem,
        GlobalLoginGoogle
    ],
    entryComponents: [
        GlobalHeader,
        GlobalNavigationMenuItem,
        GlobalNavigationMenuItemNew,
        GlobalNavigationMenuMore,
        GlobalHeaderTop,
        GlobalHeaderSearch,
        GlobalHeaderSearchResultsItems,
        GlobalHeaderSearchResultsItem,
        GlobalHeaderSearchRecentItems,
        GlobalHeaderSearchRecentItem,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerContainer],
    exports: [
        GlobalNewsFeed,
        GlobalHeader,
        GlobalFooter,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerOverflow,
        GlobalComposeButton
    ]
})
export class GlobalComponents {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
