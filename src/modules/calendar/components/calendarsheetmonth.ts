/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter,
    OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges {

    @ViewChild('calendarsheet', {read: ViewContainerRef}) calendarsheet: ViewContainerRef;
    @Input() setdate: any = {};
    @Output() navigateday: EventEmitter<any> = new EventEmitter<any>();

    currentGrid: Array<any> = [];

    get sheetDays(): Array<any> {
        let sheetDays = [];

        // build the days
        let i = 0;
        let days = moment.weekdaysShort();
        while (i < 7) {
            sheetDays.push({
                index: i,
                text: days[i]
            });
            i++;
        }

        return sheetDays;
    };

    sheetTopMargin: number=0;

    calendarevents: Array<any> = [];

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private calendar: calendar) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Calendar');

    }

    ngOnChanges(changes: SimpleChanges){
        this.buildGrid();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).date(1).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M'));
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if(events.length > 0)
                // sort the events
                events.sort((a, b) => {
                    if (a.start < b.start)
                        return -1;
                    if (a.start === b.start) {
                        if (a.end > b.end)
                            return -1;
                        else
                            return 1;
                    }
                    return 1;
                });

                this.calendarevents = events;
        });
    }

    gotoDay(sheetday){
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetday.month).date(sheetday.day);
        this.navigateday.emit(navigateDate);
    }

    getDayColStyle() {
        return {
            width: 'calc(100% / 7)'
        }
    }

    getSheetStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarsheet.element.nativeElement.offsetTop + 'px)',
        }
    }

    getDayDividerStyle(day){
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * day) + 'px',
            top: '0px',
            height: '100%'
        }
    }

    buildGrid(){
        this.currentGrid = [];
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.setdate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(0);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            if((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (i < 7) {
                    week.push({day: fdom.date(), month: fdom.month()});

                    fdom.add(1, 'd');
                    i++;
                }
                this.currentGrid.push(week);
            }
            j++;
        }
    };

    notLastWeek(week){
        return week  < this.currentGrid.length;
    }

    notThisMonth(month){
        return month !== this.setdate.month();
    }

    getWeekDividerStyle(week) {
        return {
            top: 'calc((100% / ' + this.currentGrid.length +') * '+ week +' )'
        }
    }

    getBoxStyle(i, j, month){
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * j) + 'px',
            top: 'calc((100% / ' + this.currentGrid.length +') * '+ i +' )',
            color: this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            width: (this.calendarsheet.element.nativeElement.clientWidth / 7) + 'px',
            height: 'calc(100% / ' + this.currentGrid.length +')',
        }
    }

    getCellEvents(i, j){
        let cellEvents: Array<any> = [];
        let cellDate = this.currentGrid[i][j];
        for(let event of this.calendarevents){
            if(event.start.date() === cellDate.day && event.start.month() === cellDate.month){
                cellEvents.push(event);
            }
        }
        return cellEvents;
    }

}