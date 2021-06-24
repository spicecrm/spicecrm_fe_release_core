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
 * @module ModuleActivities
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {helper} from '../../../services/helper.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'tasks-assistant-tile-close',
    templateUrl: './src/modules/activities/templates/tasksassitanttileclose.html',
})
export class TasksAssitantTileClose {

    constructor(private model: model, private language: language, private helper: helper, private broadcast: broadcast) {
    }

    doAction(){
        // this.showDialog = true;
        this.helper.confirm(this.language.getLabel('LBL_COMPLETE_TASK'), this.language.getLabel('MSG_COMPLETE_TASK')).subscribe(answer =>{
            if(answer){
                this.model.data.status = 'Completed';
                this.model.save();

                // broadcast so the assitant removes it
                this.broadcast.broadcastMessage('assistant.complete', {id: this.model.id, module: 'Assistant', data: this.model.data});
            }
        });
    }
}