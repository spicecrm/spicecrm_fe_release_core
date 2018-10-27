/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, AfterViewInit, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {broadcast} from "../../services/broadcast.service";
import {spiceprocess} from "../services/spiceprocess";

@Component({
    selector: "spice-process",
    templateUrl: "./src/addcomponents/templates/spiceprocess.html",
    providers: [spiceprocess]
})
export class SpiceProcess implements AfterViewInit, OnInit {

    public componentconfig: any = {};

    private coachingVisible: boolean = true;
    private currentStage: string = "";
    private opportunityStage: string = "";


    constructor(private broadcast: broadcast, private model: model, private spiceprocess: spiceprocess) {
        // subscribe to the broadcast service
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public ngOnInit() {
        if (this.componentconfig.defaults) {
            if (this.componentconfig.coachingVisible === false) {
                this.coachingVisible = this.componentconfig.coachingVisible;
            }
        }
    }

    public ngAfterViewInit() {
        this.spiceprocess.module = this.model.module;
        this.currentStage = this.model.data.sales_stage;
        this.spiceprocess.id = this.model.id;
        this.spiceprocess.getStages();


    }

    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module || message.messagedata.id !== this.model.id)
            return;

        switch (message.messagetype) {
            case "model.loaded":
            case "model.save":
                this.currentStage = this.model.data.sales_stage;
                this.opportunityStage = this.model.data.sales_stage;
                break;
            default:
                break;
        }
    }



    private toggleCoaching() {
        this.coachingVisible = !this.coachingVisible;
    }

    private getContainerStyle() {
        if (!this.coachingVisible) {
            return {
                "height": "0px",
                "padding-top": "0px",
                "padding-bottom": "0px",
            }
        }
    }

    private getButtonclass() {
        if (this.coachingVisible) {
            return "slds-flip--vertical";
        }
    }

    private setActive(stage) {
        this.currentStage = stage;
    }

    private getStageDescription() {
        let stagetext: string = "";
        this.spiceprocess.stages.some(stage => {
            if (this.currentStage === stage.stage) {
                stagetext = stage.stagedata.stage_description;
                return true;
            }
        });
        return stagetext;
    }

    private getStageClass(stage) {
        let pastcurrentstage = false;
        let stageClass = ""
        this.spiceprocess.stages.some(thisstage => {
            if (stage === thisstage.stage) {
                if (!pastcurrentstage) {
                    stageClass = (stage == this.opportunityStage ? "slds-is-current" : "slds-is-complete");
                } else {
                    stageClass = "slds-is-incomplete";
                }
                return true;
            }
            if (thisstage.stage === this.opportunityStage)
                pastcurrentstage = true;
        });

        // add the active one
        if (stage === this.currentStage) {
            stageClass += " slds-is-active";
        }

        return stageClass;
    }

    private getChecks() {
        let checks = []
        this.spiceprocess.stages.some(stage => {
            if (stage.stage === this.currentStage) {
                checks = stage.stagedata.checks
                return true;
            }
        })
        return checks;
    }

}