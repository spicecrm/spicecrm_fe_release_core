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
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";

/**
 * renders a path in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-track",
    templateUrl: "./src/include/spicepath/templates/spicepathtrack.html",
})
export class SpicePathTrack {

    /**
     * holds the current active stage if the user clicks on another stage
     */
    private activeStage: string;

    /**
     * emits the curetn stage
     */
    @Output() private activeStage$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private configuration: configurationService, private model: model, private language: language) {

    }

    /**
     * returns teh stages for the module from teh configuration service
     */
    get stages() {
        return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];
    }

    /**
     * retzurns the field on the model that holds the status that is used for the path
     */
    get statusfield() {
        return this.configuration.getData('spicebeanguides')[this.model.module].statusfield;
    }

    /**
     * used as part of ngClass in the template. This function determines the status of the stage
     *
     * @param currentstage the stage to be evaluated for which the class is queried.
     */
    private stageClass(currentstage) {
        // if we are on teh first stage we are incomplete and can return
        let itemClass = 'slds-is-complete';
        for (let stage of this.stages) {
            if (stage.stage == this.model.getField(this.statusfield)) {
                itemClass = 'slds-is-current';
            } else {
                if (itemClass == 'slds-is-current') {
                    itemClass = 'slds-is-incomplete';
                }
            }

            if (stage.stage == currentstage) {
                break;
            }
        }

        // in case we are the acive item set the add class. Special handling for the current one .. both classes conflict so just set one
        if ((this.activeStage && this.activeStage == currentstage) || (!this.activeStage && this.model.getField(this.statusfield) == currentstage)) {
            if (itemClass == 'slds-is-current') {
                itemClass = 'slds-is-active';
            } else {
                itemClass += ' slds-is-active';
            }
        }

        return itemClass;
    }

    /**
     * called from the template when the stage is clicked in the path
     *
     * @param stage the selected stage
     */
    private setActiveStage(stage) {
        // set the value internally
        this.activeStage = stage;

        // emit for the parent
        this.activeStage$.emit(stage);
    }


    /**
     * returns the name for the stage to be displayed
     *
     * @param stagedata
     */
    private getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return this.language.getLabel(stagedata.stage_label);
        } else {
            return stagedata.stage_name;
        }
    }
}
