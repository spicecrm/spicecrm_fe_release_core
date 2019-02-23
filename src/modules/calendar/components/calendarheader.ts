/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, EventEmitter, OnDestroy, Output, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-header',
    templateUrl: './src/modules/calendar/templates/calendarheader.html',
})

export class CalendarHeader implements OnDestroy {
    public openPicker: boolean = false;
    public scheduleUntilDate: any = {};
    private clickListener: any;
    private showTypeSelector: boolean = false;
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
    }

    get sheetType() {
        return this.calendar.sheetType;
    }

    get isMobileView() {
        return this.calendar.isMobileView;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    set calendarDate(value) {
        this.calendar.calendarDate = new moment(value);
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    get pickerClass() {
        return !this.openPicker || !this.isMobileView ? 'slds-hidden' : '';
    }

    get titleClass() {
        return this.isMobileView ? 'slds-m-bottom--xx-small' : '';
    }

    get headerClass() {
        return this.isMobileView ? 'slds-p-around--x-small' : '';
    }

    get typeDropdownClass() {
        return this.showTypeSelector ? 'slds-is-open' : '';
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public toggleClosed() {
        this.openPicker = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private handleDatePicked(event) {
        this.datePicked.emit(event);
    }

    private shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.calendar.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.calendar.sheetType == 'Three_Days' ? 3 : 1, this.calendar.duration[this.calendar.sheetType])));
    }

    private shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.calendar.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.calendar.sheetType == 'Three_Days' ? 3 : 1, this.calendar.duration[this.calendar.sheetType])));
    }

    private addOtherCalendar() {
        this.calendar.addOtherCalendar();
    }

    private getCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        switch (this.calendar.sheetType) {
            case 'Week':
                return this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D');
            case 'Schedule':
                return focDate.format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
            case 'Three_Days':
                return focDate.format("MMM D") + ' - ' + moment(focDate.add(2, 'd')).format("MMM D");
        }
    }

    private getCompactCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        return focDate.format('MMM, YYYY');
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekStartDay);
        return focDate.format('MMM D');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekDaysCount);
        return focDate.format('MMM D');
    }

    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    private setType(sheetType) {
        this.calendar.sheetType = sheetType;
        this.calendar.refresh();
        this.showTypeSelector = false;
    }

    private goToday() {
        this.calendarDate = new moment();
    }

    private zoomin() {
        this.calendar.sheetHourHeight += 10;
    }

    private zoomout() {
        this.calendar.sheetHourHeight -= 10;
    }

    private resetzoom() {
        this.calendar.sheetHourHeight = 80;
    }

    private toggleOpen(picker, button) {
        this.openPicker = !this.openPicker;
        if (this.openPicker) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event, picker, button));
        }
    }

    private onDocumentClick(event: MouseEvent, picker, button) {
        if (this.openPicker && !picker.contains(event.target) && !button.contains(event.target)) {
            this.openPicker = false;
            this.clickListener();
        }
    }
}