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
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * a component that is rendered as part of a system-modal. it represents the header
 */
@Component({
    selector: 'system-modal-header',
    templateUrl: './src/systemcomponents/templates/systemmodalheader.html'
})
export class SystemModalHeader {
    /**
     * if a module name is specified the header will render a module icon on the left side of the modal header
     */
    @Input() private module: string = '';

    /**
     * if set to true no close icon will be rendered in the upper right corner
     */
    @Input() private hiddenCloseButton = false;

    /**
     * an event emitter that indicates that the modal shoudl close. Subscribe to this in your implementation of a modal handling the close event
     */
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language, private layout: layout) {

    }

    /**
     * simple getter that returns true if the screen size is small to render close button in the header
     */
    get isSmall(){
        return this.layout.screenwidth == 'small';
    }

    /**
     * set the border radius to 0px in full screen mode
     */
    get headerStyle(){
        if(this.layout.screenwidth == 'small'){
            return {
                'border-radius': '0px'
            };
        }
        return {};
    }
}
