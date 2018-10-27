/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, Renderer, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {reminder} from '../../services/reminder.service';
import {language} from '../../services/language.service';

declare var moment: any;

@Component({
    selector: 'object-reminder-button',
    templateUrl: './src/objectcomponents/templates/objectreminderbutton.html',
    providers: [popup]
})
export class ObjectReminderButton {

    showDialog: boolean = false;
    reminderDate: Date = new moment();
    hasReminder: boolean = false;
    clickListener: any;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private renderer: Renderer, private elementRef: ElementRef, private reminder: reminder) {
        let hasReminder = this.reminder.getReminder(this.model.module, this.model.id);
        if(hasReminder !== false){
            this.hasReminder = true;
            this.reminderDate = new moment(hasReminder);
        }
    }

    toggleDatePicker() {
        this.showDialog = !this.showDialog;

        // toggle the listener
        if (this.showDialog) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDialog = false;
        }
    }

    get isEditing(){
        return this.model.isEditing;
    }

    clearReminder() {
        this.reminder.deleteReminder(this.model.module, this.model.id);
        this.hasReminder = false;
    }

    setReminder(event) {
        this.showDialog = false;
        this.hasReminder = true;
        let reminderDate = new moment(event);
        this.reminder.setReminder(this.model, reminderDate.format('YYYY-MM-DD'));
    }

    getReminderDate() {
        // let date = new moment(this.reminderDate);
        return this.reminderDate.format('DD.MM.YYYY');
    }

}