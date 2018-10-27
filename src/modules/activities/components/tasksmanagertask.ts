/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tasks-manager-task',
    templateUrl: './src/modules/activities/templates/tasksmanagertask.html',
    providers: [model, view]
})
export class TasksManagerTask implements OnInit{

    @Input() task: any = {};
    @Input() focus: string = '';
    @Output() taskselected: EventEmitter<string> = new EventEmitter<string>();

    fielsetFields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private modelutilities: modelutilities, private view: view) {
        let componentconfig = this.metadata.getComponentConfig('TasksManagerTask', 'Tasks');
        if(componentconfig.fieldset){
            this.fielsetFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
    }

    ngOnInit(){
        this.model.module = 'Tasks';
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice('Tasks', this.task);
    }

    get isCompleted(){
        return this.model.data.status == 'Completed';
    }

    get canEdit(){
        return this.model.data.acl.edit;
    }

    get nameStyle(){
        let styles = {};

        if(this.isCompleted)
            styles['text-decoration'] = 'line-through';

        return styles;
    }

    get focusClass(){
        if(this.model.id == this.focus)
            return 'slds-theme--shade slds-border--right';
        else
            return '';
    }

    completeTask(){
        this.model.data.status = 'Completed';
        this.model.save();
    }

    selectTask(){
        this.taskselected.emit(this.model.id);
    }
}