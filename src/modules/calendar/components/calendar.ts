/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar]
})
export class Calendar {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;

    showTypeSelector: boolean = false;
    calendarDate: any = {};
    sheetType: string = 'Week';

    duration: any = {
        Day : 'd',
        Week : 'w',
        Month : 'M',
    }

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

        this.calendarDate = new moment();
    }

    getOffset(){
        return moment().utcOffset()
    }

    setDateChanged(event){
        this.calendarDate = new moment(event);
    }

    toggleTypeSelector(){
        this.showTypeSelector = !this.showTypeSelector;
    }

    setType(sheetType){
        this.sheetType = sheetType;
        this.showTypeSelector = false;
    }

    goToday(){
        this.calendarDate = new moment();
    }

    gotToDayView(date){
        this.calendarDate = date;
        this.sheetType = 'Day';
    }

    goToWeekView(){
        this.sheetType = 'Week';
    }

    shiftPlus(){
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(1, this.duration[this.sheetType])));
    }
    shiftMinus(){
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(1, this.duration[this.sheetType])));
    }

    getCalendarHeader(){
        let focDate = new moment(this.calendarDate);
        switch(this.sheetType){
            case 'Week':
                return 'Week ' + this.getCalendarWeek() + ': ' + this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D, YYYY');
        }
    }

    getCalendarWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(1);
        return focDate.isoWeek();
    }

    getFirstDayOfWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(0);
        return focDate.format('MMMM D, YYYY')
    }

    getLastDayOfWeek(){
        let focDate = new moment(this.calendarDate);
        focDate.day(7);
        return focDate.format('MMMM D, YYYY')
    }

    getContentStyle(){
        return{
            height: 'calc(100vh - ' + this.calendarcontent.element.nativeElement.offsetTop  + 'px)'
        }
    }

    zoomin(){
        this.calendar.sheetHourHeight += 10;
    }

    zoomout(){
        this.calendar.sheetHourHeight -= 10;
    }

    resetzoom(){
        this.calendar.sheetHourHeight = 80;
    }

}