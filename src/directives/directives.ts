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
 * a set of system specific directives
 *
 * @module directives
 */
import {CommonModule} from "@angular/common";
import {NgModule,Directive, Renderer2, Input, HostListener, HostBinding, OnDestroy, ElementRef, OnInit, DoCheck, TemplateRef, ViewContainerRef, Pipe, PipeTransform, Optional, AfterViewInit} from "@angular/core";
import {Router}   from '@angular/router';

import {metadata} from '../services/metadata.service';
import {footer} from '../services/footer.service';
import {model} from '../services/model.service';
import {view} from '../services/view.service';
import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {ModelPopOverDirective} from "./directives/modelpopover";
import /*embed*/ {SpiceUIToBottomDirective} from "./directives/spiceuitobottom";
import /*embed*/ {ModelProviderDirective} from "./directives/modelprovider";
import /*embed*/ {LocalVariableDirective} from "./directives/localvariable";
import /*embed*/ {SpiceUIAutofocusDirective} from "./directives/spiceuiautofocus";
import /*embed*/ {FirstUpperCasePipe} from "./directives/firstuppercase";
import /*embed*/ {DropdownTriggerDirective} from "./directives/dropdowntrigger";
import /*embed*/ {ToBottomDirective} from "./directives/tobottom";
import /*embed*/ {TrimInputDirective} from './directives/triminput';
import /*embed*/ {ViewProviderDirective} from './directives/viewprovider';

/**
 * the angular module that collects all teh directives and can be imported by other modules to use the set of directives
 */
@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ModelPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective,
        ToBottomDirective,
        TrimInputDirective,
        ViewProviderDirective
    ],
    exports: [
        ModelPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective,
        ToBottomDirective,
        TrimInputDirective,
        ViewProviderDirective
    ]
})
export class DirectivesModule {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}