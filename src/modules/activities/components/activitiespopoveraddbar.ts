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
import {
    Component,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    templateUrl: './src/modules/activities/templates/activitiespopoveraddbar.html',
})
export class ActivitiesPopoverAddBar implements OnInit{

    /**
     * the component config
     */
    private componentconfig: any;

    /**
     * an array with the names of the mopdules to be displayxed as quick add buttons
     */
    private modules: string[] = [];

    constructor(private model: model, private language: language, private metadata: metadata) {
    }

    public ngOnInit(): void {
        if(this.componentconfig.modules){
            let modules = this.componentconfig.modules.split(',');
            for(let module of modules){
                if(this.metadata.checkModuleAcl(module, 'create')){
                    this.modules.push(module);
                }
            }
        }
    }
}
