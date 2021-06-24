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
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * a collapsible section. the content is rendere as <ng-content> in the template
 */
@Component({
    selector: "system-section",
    templateUrl: "./src/systemcomponents/templates/systemsection.html"
})
export class SystemSection {

    /**
     * a label to be used as title e.g. 'LBL_DETAILS'. this is rendered translated in teh current selected language
     */
    @Input() private titlelabel: string = "";

    /**
     * set if the panel shoudd be expanded or collabpesd by default
     */
    @Input() private expanded: boolean = true;

    /**
     * set if the panel should be always expanded (not shrinkable)
     */
    @Input() private alwaysExpanded = false;

    constructor(private language: language) {

    }

    /**
     * toggles the panel open or closed
     */
    private togglePanel() {
        this.expanded = !this.expanded;
    }

    /**
     * get the proper style for the tab if collaped or not
     */
    private getTabStyle() {
        if(!this.expanded) {
            return {
                height: "0px",
                transform: "rotateX(90deg)"
            };
        }
    }
}
