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
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
import {NgModule} from "@angular/core";
import {RouterModule,} from "@angular/router";

/**
* @ignore
*/
declare var _: any;
/**
 * @ignore
 */
declare var gapi: any;

import {loginService, loginCheck} from "../services/login.service";
import {metadata} from "../services/metadata.service";

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
import /*embed*/ {GlobalNavigationCompact} from "./components/globalnavigationcompact";
import /*embed*/ {GlobalDockedComposerContainer} from "./components/globaldockedcomposercontainer";
import /*embed*/ {GlobalDockedComposer} from "./components/globaldockedcomposer";
import /*embed*/ {GlobalDockedComposerCall} from "./components/globaldockedcomposercall";
import /*embed*/ {GlobalDockedComposerModal} from "./components/globaldockedcomposermodal";
import /*embed*/ {GlobalDockedComposerOverflow} from "./components/globaldockedcomposeroverflow";
import /*embed*/ {GlobalComposeButton} from "./components/globalcomposebutton";
import /*embed*/ {GlobalAppLauncher} from "./components/globalapplauncher";
import /*embed*/ {GlobalAppLauncherDialog} from "./components/globalapplauncherdialog";
import /*embed*/ {GlobalAppLauncherDialogRoleTile} from "./components/globalapplauncherdialogroletile";


import /*embed*/ {GlobalUser} from "./components/globaluser";
import /*embed*/ {GlobaUserPanel} from "./components/globaluserpanel";
import /*embed*/ {GlobaUserPanelIcon} from "./components/globauserpanelicon";

import /*embed*/ {GlobalRecentItems} from "./components/globalrecentitems";
import /*embed*/ {GlobalSearch} from "./components/globalsearch";
import /*embed*/ {GlobalSearchModule} from "./components/globalsearchmodule";
import /*embed*/ {GlobalSearchModuleOnly} from "./components/globalsearchmoduleonly";
import /*embed*/ {GlobalSearchModuleItem} from "./components/globalsearchmoduleitem";

import /*embed*/ {GlobalNewsFeed} from "./components/globalnewsfeed";
import /*embed*/ {GlobalNewsFeedItem} from "./components/globalnewsfeeditem";
import {VersionManagerService} from "../services/versionmanager.service";

import /*embed*/ {GlobalLoginGoogle} from "./components/globallogingoogle";

/**
 * GlobalComponents holds records that are rendered in the global header and footer parts of the application. This includes e.g. the header menu and other components
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        DirectivesModule,
        SystemComponents,
        RouterModule.forRoot([
            // {path: "login", component: GlobalLogin},
            {path: "setup", component: GlobalSetup},
            {path: "recent", component: GlobalRecentItems, canActivate: [loginCheck]},
            {path: "search", component: GlobalSearch, canActivate: [loginCheck]},
            {path: "search/:searchterm", component: GlobalSearch, canActivate: [loginCheck]},
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
        GlobalNavigationCompact,
        GlobalLogin,
        GlobalSetup,
        GlobalLoginForgotPassword,
        GlobalLoginResetPassword,
        GlobalUser,
        GlobaUserPanel,
        GlobaUserPanelIcon,
        GlobalAppLauncher,
        GlobalAppLauncherDialog,
        GlobalAppLauncherDialogRoleTile,
        GlobalDockedComposerContainer,
        GlobalDockedComposer,
        GlobalDockedComposerCall,
        GlobalDockedComposerModal,
        GlobalDockedComposerOverflow,
        GlobalComposeButton,
        GlobalRecentItems,
        GlobalSearch,
        GlobalSearchModule,
        GlobalSearchModuleOnly,
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
        GlobalComposeButton,
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
