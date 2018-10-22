/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter,
    OnInit, OnChanges
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-week',
    templateUrl: './src/modules/calendar/templates/calendarsheetweek.html',
})
export class CalendarSheetWeek implements OnChanges, AfterViewInit {

    @ViewChild('calendarsheet', {read: ViewContainerRef}) calendarsheet: ViewContainerRef;
    @Input() setdate: any = {};
    @Output() navigateday: EventEmitter<any> = new EventEmitter<any>();

    sheetTimeWidth: number = 80;

    sheetDays: Array<any> = [];

    //get sheetDays(): Array<any> {
    buildSheetDays(){
        let sheetDays = [];

        // build the days
        let i = 0;
        while (i < 7) {
            let focDate = new moment(this.setdate);
            focDate.day(i);
            sheetDays.push({
                index: i,
                text: focDate.format('ddd D'),
                date: focDate
            });
            i++;
        }

        return sheetDays;
    };

    sheetHours: Array<any> = [];

    sheetTopMargin: number = 0;
    sheetHourHeight: number = 60;

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

        // some initialization
        this.buildHours();

        this.sheetDays = this.buildSheetDays();

        // this.calendar.sheetHourHeight = this.calendar.sheetHourHeight;
    }

    calendarevents: Array<any> = [];

    getOffset(){
        return moment().utcOffset()
    }

    getEventStyle(event) {
        // get the day of the week
        let startday = event.start.day();
        let startminutes = event.start.hour() * 60 + event.start.minute();
        let endminutes = event.end.hour() * 60 + event.end.minute();

        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7) / (event.maxOverlay > 0 ? event.maxOverlay : 1);

        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * startday) + (itemWidth *  event.displayIndex) + 'px',
            width: event.dragging ? itemWidth / 2 :  itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * ( endminutes - startminutes ) + 'px'
        }
    }

    ngAfterViewInit(){
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    ngOnChanges() {

        this.sheetDays = this.buildSheetDays();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).day(0).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(7, 'd'));
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if(events.length > 0)
                this.calendarevents = this.calendar.arrangeEvents(events);
        });
    }

    getTimeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        }
    }

    getDayColStyle() {
        return {
            width: 'calc((100% - ' + this.sheetTimeWidth + 'px) / 7)'
        }
    }

    buildHours() {
        this.sheetHours = [];
        let i = 0;
        while (i <= 24) {
            this.sheetHours.push(i);
            i++;
        }
    }

    getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        }
    }

    getHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px'
        }
    }

    getHalfHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + this.calendar.sheetHourHeight / 2 + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        }
    }

    notLastHour(hour) {
        return hour + 1 < this.sheetHours.length;
    }

    getHourLabelStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            width: this.sheetTimeWidth + 'px'
        }
    }

    getDayDividerStyle(day) {
        return {
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * day) + 'px',
            top: '0px',
            height: this.calendar.sheetHourHeight * (this.sheetHours.length - 1 ) + 'px'
        }
    }

    gotoDay(dow){
        let navigateDate = moment(this.setdate);
        navigateDate.day(dow);
        this.navigateday.emit(navigateDate);
    }

    getDropTargetStyle(hour, day){
        return{
            left: this.sheetTimeWidth + ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7 * day) + 'px',
            width: ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth) / 7) + 'px',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px',
        }
    }

    rearrangeEvents(){
        this.calendarevents = this.calendar.arrangeEvents(this.calendarevents);
    }

}