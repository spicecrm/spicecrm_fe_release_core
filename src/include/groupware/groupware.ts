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
 * @module ModuleGroupware
 */
import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {GroupwareService} from './services/groupware.service';

import /*embed*/ {GroupwarePaneBean} from './components/groupwarepanebean';
import /*embed*/ {GroupwarePaneAttachment} from './components/groupwarepaneattachment';
import /*embed*/ {GroupwareReadPane} from './components/groupwarereadpane';
import /*embed*/ {GroupwareReadPaneHeader} from './components/groupwarereadpaneheader';
import /*embed*/ {GroupwareReadPaneAttachments} from './components/groupwarereadpaneattachments';
import /*embed*/ {GroupwareReadPaneBeans} from './components/groupwarereadpanebeans';
import /*embed*/ {GroupwareReadPaneLinked} from './components/groupwarereadpanelinked';
import /*embed*/ {GroupwareReadPaneSearch} from './components/groupwarereadpanesearch';
import /*embed*/ {GroupwareDetailPane} from './components/groupwaredetailpane';
import /*embed*/ {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import {loginCheck} from "../../services/login.service";
import {ObjectFields} from "../../objectfields/objectfields";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        DirectivesModule,
        ObjectFields,
        RouterModule.forRoot([
            {path: 'mailitem', component: GroupwareReadPane, canActivate: [loginCheck]},
            {path: 'details', component: GroupwareDetailPane, canActivate: [loginCheck]},
        ])
    ],
    declarations: [
        GroupwarePaneBean,
        GroupwarePaneAttachment,
        GroupwareReadPane,
        GroupwareReadPaneHeader,
        GroupwareReadPaneAttachments,
        GroupwareReadPaneBeans,
        GroupwareReadPaneLinked,
        GroupwareReadPaneSearch,
        GroupwareDetailPane,
        GroupwareDetailPaneBean,
    ]
})
export class ModuleGroupware {
}
