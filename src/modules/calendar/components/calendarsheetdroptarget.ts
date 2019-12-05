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
 * @module ModuleCalendar
 */
import {Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {calendar} from '../services/calendar.service';
import {take} from "rxjs/operators";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-sheet-drop-target',
    template: '',
    providers: [model]
})
export class CalendarSheetDropTarget {

    @Input() private hour: any = '';
    @Input() private set hourPart(value: number) {
        this.minutes = value ? 15* value : 0;
    }
    @Input() private day: any = undefined;

    private minutes: number = 0;

    constructor(private calendar: calendar, private model: model, private elementRef: ElementRef) {
    }

    get content() {
        return this.hour + ' ' + this.day;
    }

    @HostListener('click')
    private addEvent() {
        let date = this.day ? new moment(this.day.date) : this.calendar.calendarDate;
        date.hour(this.hour).minute(this.minutes).second(0);
        if (this.calendar.asPicker) {
            this.calendar.pickerDate$.emit(date);
        } else {
            this.calendar.addingEvent$.emit(date);
        }
    }

    @HostListener('dragover', ['$event'])
    private dragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragenter')
    @HostListener('mouseenter')
    private activateHoverStyle() {
        this.elementRef.nativeElement.style.cursor = 'pointer';
        this.elementRef.nativeElement.innerText = `${this.hour}:${(this.minutes == 0 ? '00' : this.minutes)}`;
        this.elementRef.nativeElement.classList.add('slds-text-align--center');
        this.elementRef.nativeElement.classList.add('slds-theme--shade');
    }

    @HostListener('mouseleave')
    @HostListener('dragleave')
    private deactivateHoverStyle() {
        this.elementRef.nativeElement.style.cursor = 'initial';
        this.elementRef.nativeElement.innerText = '';
        this.elementRef.nativeElement.classList.remove('slds-text-align--center');
        this.elementRef.nativeElement.classList.remove('slds-theme--shade');
    }

    @HostListener('drop', ['$event'])
    private drop(e) {
        this.deactivateHoverStyle();
        this.calendar.eventDrop$.emit({
            day: this.day,
            hour: this.hour,
            minutes: this.minutes
        });
        e.preventDefault();
        e.stopPropagation();
    }
}
