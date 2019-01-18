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
    AfterViewInit, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {session} from '../../../services/session.service';
import {backend} from '../../../services/backend.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetday.html'
})

export class CalendarSheetDay implements OnChanges, AfterViewInit {

    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('multieventscontainer', {read: ViewContainerRef}) private multiEventsContainer: ViewContainerRef;

    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    @Output() public navigateweek: EventEmitter<any> = new EventEmitter<any>();

    private sheetTopMargin: number = 0;
    private sheetDay: any = {};
    private sheetHours: any[] = [];
    private ownerEvents: any[] = [];
    private ownerMultiEvents: any[] = [];
    private userEvents: any[] = [];
    private userMultiEvents: any[] = [];
    private otherEvents: any[] = [];
    private googleEvents: any[] = [];
    private googleMultiEvents: any[] = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private cdr: ChangeDetectorRef,
                private session: session,
                private calendar: calendar) {
        this.buildHours();
    }

    get offset() {
        return moment.tz(moment.tz.guess()).format('z Z');
    }

    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
    }

    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.otherEvents, this.userMultiEvents, this.googleMultiEvents);
    }

    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    get endDate() {
        return new moment(this.startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.sheetDay = {date: changes.setdate.currentValue};
            this.getEvents();
        }
        if (changes.usersCalendars || changes.setdate) {
            this.getUsersEvents();
        }
        if (changes.otherCalendars || changes.setdate) {
            this.getOtherEvents();
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    private correctHours(events) {
        events.forEach(event => {
            if (!event.isMulti) {
                let endInRange = event.end.hour() > this.calendar.startHour && event.start.hour() < this.calendar.startHour;
                let startInRange = event.start.hour() < this.calendar.endHour && event.end.hour() > this.calendar.endHour;
                if (endInRange) {
                    event.start = event.start.hour(this.calendar.startHour).minute(0);
                }
                if (startInRange) {
                    event.end = event.end.hour(this.calendar.endHour).minute(59);
                }
            }
        });
        return events;
    }

    private getEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];

        this.calendar.loadEvents(this.startDate, this.endDate).subscribe(events => {
            if (events.length > 0) {
                events = this.correctHours(events);
                events = this.filterEvents(events);
                this.ownerEvents = events.filter(event => !event.isMulti);
                this.ownerMultiEvents = events.filter(event => event.isMulti);
            }
        });
    }

    private getGoogleEvents() {
        this.googleEvents = [];
        this.googleMultiEvents = [];
        if (!this.googleIsVisible || this.calendar.isMobileView) {return}

        this.calendar.loadGoogleEvents(this.startDate, this.endDate).subscribe(events => {
            if (events.length > 0) {
                events = this.correctHours(events);
                events = this.filterEvents(events);
                this.googleEvents = events.filter(event => !event.isMulti);
                this.googleMultiEvents = events.filter(event => event.isMulti);
            }
        });
    }

    private getUsersEvents() {
        this.userEvents = [];
        this.userMultiEvents = [];
        if (this.calendar.isMobileView) {return}

        for (let calendar of this.calendar.usersCalendars) {
            if (!calendar.visible) {continue}
            this.calendar.loadEvents(this.startDate, this.endDate, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                        }
                    });
                }
            });
        }
    }

    private getOtherEvents() {
        this.otherEvents = [];
        if (this.calendar.isMobileView) {return}

        for (let calendar of this.calendar.otherCalendars) {
            if (!calendar.visible) {continue}
            this.calendar.loadEvents(this.startDate.hour(0).minute(0).second(0), this.endDate.hour(23).minute(0).second(0), calendar.id, true).subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        event.color = calendar.color;
                        event.visible = calendar.visible;
                        this.otherEvents.push(event);
                    });
                }
            });
        }
    }

    private filterEvents(events) {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    private displayDate(format) {
        return this.setdate.format(format);
    }

    private getEventStyle(event): any {
        // get the day of the week
        let startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth)) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        return {
            left: this.sheetTimeWidth + (itemWidth * event.displayIndex) + 'px',
            width: itemWidth + 'px',
            top: this.calendar.sheetHourHeight / 60 * startminutes + 'px',
            height: this.calendar.sheetHourHeight / 60 * (endminutes - startminutes) + 'px',
            'z-index': event.resizing ? 20 : 15,
            'border-bottom': event.resizing ? '1px dotted #fff' : 0
        };

    }

    private getMultiEventStyle(index): any {
        let multiEvents = this.multiEventsContainer.element.nativeElement.getBoundingClientRect();
        return {
            height: this.calendar.multiEventHeight + "px",
            width: multiEvents.width + "px",
            top: multiEvents.top + (this.calendar.multiEventHeight * index) + "px",
            left: multiEvents.left + "px",
        };
    }

    private getMultiEventsContainerStyle() {
        return {height: this.allMultiEvents.length > 0 ? this.calendar.multiEventHeight * this.allMultiEvents.length : this.calendar.multiEventHeight};
    }

    private getTimeColStyle() {
        return {width: this.sheetTimeWidth + 'px'};
    }

    private getDayColStyle() {
        return {width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'};
    }

    private buildHours() {
        this.sheetHours = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    private isTodayStyle() {
        let today = new moment();
        let isToday = today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date()
        return {
            color: isToday ? this.calendar.todayColor : 'inherit'
        };
    }

    private getHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px'
        };
    }

    private getHalfHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + this.calendar.sheetHourHeight / 2 + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        };
    }

    private getHourLabelStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    private getDayDividerStyle() {
        return {
            left: this.sheetTimeWidth + 'px',
            top: '0px',
            height: this.calendar.sheetHourHeight * this.sheetHours.length + 'px'
        };
    }

    private gotoWeek() {
        this.navigateweek.emit();
    }

    private getDropTargetStyle(hour) {
        return {
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)',
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px',
            height: this.calendar.sheetHourHeight + 'px'
        };
    }

    private notLastHour(hour) {
        return hour < this.sheetHours.length;
    }
}
