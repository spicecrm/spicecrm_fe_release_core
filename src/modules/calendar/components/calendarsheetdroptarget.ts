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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-drop-target',
    templateUrl: './src/modules/calendar/templates/calendarsheetdroptarget.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetDropTarget {

    /**
     * @input day: moment
     */
    @Input() private day: any;
    /**
     * @input hour: number
     */
    @Input() private hour: number = 0;

    private minutes: number = 0;

    constructor(private calendar: calendar, private cdr: ChangeDetectorRef, public elementRef: ElementRef) {
    }

    /**
     * @return date: moment
     */
    get date() {
        return this.day ? moment(this.day.date) : this.calendar.calendarDate;
    }

    /**
     * @Input hourPart: number
     * @param value: number
     * @set minutes
     */
    @Input()
    private set hourPart(value: number) {
        this.minutes = value ? 15 * value : 0;
    }

    /**
     * @call ChangeDetectorRef.detach
     */
    public ngAfterViewInit() {
        this.cdr.detach();
    }

    /**
     * @emit date by pickerDate$
     * @emit date by addingEvent$
     */
    private addEvent() {
        const date = moment(this.date);
        date.hour(this.hour).minute(this.minutes).second(0);
        if (this.calendar.asPicker) {
            this.calendar.pickerDate$.emit(date);
        } else {
            this.calendar.addingEvent$.emit(date);
        }
    }
}
