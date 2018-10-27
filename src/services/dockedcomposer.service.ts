/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate} from '@angular/router';

import {modelutilities} from './modelutilities.service';

@Injectable()
export class dockedComposer {
    showComposer: boolean = false;
    module: string = '';

    composers: Array<any> = [];
    hiddenComposers: Array<number> = []

    constructor(private modelutilities: modelutilities) {
    }

    addComposer(module, model = undefined) {

        if (model) {
            this.composers.splice(0, 0, {
                module: module,
                id: model.id,
                name: model.summary_text,
                model: {
                    module: module,
                    id: model.id,
                    data: model.data
                }
            });

        } else {
            this.composers.splice(0, 0, {
                module: module,
                id: this.modelutilities.generateGuid(),
                name: '',
                model: {}
            });
        }

    }

    focusComposer(id) {
        this.composers.some((composer, index) => {
            if (composer.id == id) {
                let movedComposer = this.composers.splice(index, 1);
                this.composers.unshift(movedComposer.shift());
                return true;
            }
        })
    }

    get maxComposers() {
        return Math.floor((window.innerWidth - 70) / 500);
    }
}
