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
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges, OnDestroy,
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
import {Subscription} from "rxjs";

/**
* @ignore
*/
declare var moment: any;
/**
* @ignore
*/
declare var _: any;

@Component({
    selector: 'calendar-sheet-schedule',
    templateUrl: './src/modules/calendar/templates/calendarsheetschedule.html'
})
export class CalendarSheetSchedule implements OnChanges, OnDestroy {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @Output() public untildate$: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef, static: true}) private calendarsheet: ViewContainerRef;
    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    private allevents: any[] = [];
    private ownerEvents: any[] = [];
    private userEvents: any[] = [];
    private googleEvents: any[] = [];
    private untilDate: any = {};
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private backend: backend,
                private session: session,
                private calendar: calendar) {
        this.untilDate = new moment().hour(0).minute(0).second(0).add(1, "M");

        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                this.getUserEvents(calendar);
            })
        );
        this.subscription.add(this.calendar.usersCalendarsLoad$.subscribe(() => {
                this.getUsersEvents();
            })
        );
    }

    get allEvents() {
        return this.allevents;
    }

    get showNoneMsg() {
        return this.allEvents.length == 0 && this.calendar.isDashlet;
    }

    // tslint:disable-next-line:adjacent-overload-signatures
    set allEvents(value) {
        let events = this.groupByDay(this.ownerEvents.concat(this.userEvents, this.googleEvents));
        events.sort((a, b) => a.date - b.date);
        this.allevents = events;
    }

    get startDate() {
        return new moment(this.setdate).hour(0).minute(0).second(0);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.setUntilDate();
            this.getEvents();
            if (this.calendar.usersCalendarsLoaded) {
                this.getUsersEvents();
            }
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private trackByFnDate(index, item) {
        return index;
    }

    private setUntilDate() {
        this.untilDate = moment(this.setdate).add(1, "M");
        this.untildate$.emit(this.untilDate);
    }

    private getUntilDate() {
        return this.untilDate.format('MMM D, Y');
    }

    private groupByDay(events) {
        let days = [];
        let date = new moment(this.setdate).hour(0).minute(0).second(0);

        for (let event of events) {
            let start = new moment(event.start).hour(0).minute(0).second(0);
            let end = new moment(event.end).hour(0).minute(0).second(0);
            for (let eventDay = moment(start); eventDay.diff(end, 'days') <= 0; eventDay.add(1, 'days')) {
                let sameDay = date.year() == eventDay.year() && date.month() == eventDay.month() && date.date() == eventDay.date();

                if (eventDay.isAfter(date) || sameDay) {
                    let day = {
                        year: eventDay.year(),
                        month: eventDay.month(),
                        day: eventDay.date(),
                        date: moment(eventDay),
                        events: [event]
                    };
                    let dayIndex = -1;

                    days.some((day, index) => {
                        if (day.year == eventDay.year() && day.month == eventDay.month() && day.day == eventDay.date()) {
                            dayIndex = index;
                            return true;
                        }
                    });

                    if (days.length > 0 && dayIndex > -1) {
                        days[dayIndex].events.push(event);
                    } else {
                        days.push(day);
                    }
                }
            }
        }
        return days;
    }

    private getEvents() {
        this.ownerEvents = [];
        this.allEvents = this.allevents.slice();

        this.calendar.loadEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events;
                }
                this.allEvents = this.allevents.slice();
            });
    }

    private getGoogleEvents() {
        this.googleEvents = [];

        if (!this.googleIsVisible || this.calendar.isMobileView) {
            this.allEvents = this.allevents.slice();
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                this.googleEvents = events;
                this.allEvents = this.allevents.slice();
            });
    }

    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.allEvents = this.allevents.slice();

        if (this.calendar.isMobileView || !calendar.visible) {
            return;
        }

        this.calendar.loadUserEvents(this.startDate, this.untilDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = [...this.userEvents, ...events];
                    this.allEvents = this.allevents.slice();
                }
            });
    }

    private getUsersEvents() {
        this.userEvents = [];
        this.allEvents = this.allevents.slice();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.untilDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.userEvents = events;
                    this.allEvents = this.allevents.slice();
                }
            });
    }

    private getShortDay(date) {
        return new moment(date).format('ddd');
    }

    private getMonthDayYear(date) {
        return new moment(date).format('MMM D, YYYY');
    }

    private goToDay(date) {
        this.navigateday.emit(date);
    }

    private getTime(start, end, isMulti) {
        return !isMulti ? `${start.format('HH:mm')} - ${end.format('HH:mm')} ` : 'All Day';
    }

    private loadMore() {
        this.untilDate = moment(this.untilDate).add(1, "M");
        this.untildate$.emit(this.untilDate);
        this.getEvents();
        this.getGoogleEvents();
        this.getUsersEvents();
    }
}
