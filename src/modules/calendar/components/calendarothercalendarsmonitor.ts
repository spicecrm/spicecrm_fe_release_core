/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {fts} from "../../../services/fts.service";
import {recent} from "../../../services/recent.service";
import {calendar} from "../services/calendar.service";

declare var _: any;

@Component({
    selector: 'calendar_other_calendars_monitor',
    templateUrl: './src/modules/calendar/templates/calendarothercalendarsmonitor.html'
})
export class CalendarOtherCalendarsMonitor {
    @ViewChild("inputcontainer", {read: ViewContainerRef}) private inputContainer: ViewContainerRef;

    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];

    @Output() public googleIsVisible$: EventEmitter<any> = new EventEmitter<any>();

    private googleIsVisible: boolean = true;
    public searchterm: string = "";
    public searchopen: boolean = false;
    public resultsList: any[] = [];
    public recentUsers: any[] = [];
    public timeout: any = undefined;
    public isLoading: boolean = false;

    constructor(private language: language,
                private recent: recent,
                private calendar: calendar,
                private fts: fts) {
        this.getRecent();
    }

    get loggedByGoogle() {
        return this.calendar.loggedByGoogle;
    }

    get owner() {
        return this.calendar.owner;
    }

    set searchOpen(value) {
        this.searchopen = value;
        if (value) {
            this.getRecent();
        }
    }
    get searchOpen() {
        return this.searchopen;
    }

    get lookupMenuStyle() {
        return {
            display: this.searchOpen ? "block" : "none",
            width: this.inputContainer.element.nativeElement.getBoundingClientRect().width + "px",
        };
    }

    set searchTerm(value) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.searchterm = value, 500);
        if (value == "") {
            return;
        }
        this.isLoading = true;
        this.fts.searchByModules(this.searchterm, ["Users"], 5, "", {sortfield: "name"})
            .subscribe(res => {
                this.filterResultsList(res["Users"].hits.map(user => user = user._source));
                this.isLoading = false;
            }, err => this.isLoading = false);
    }

    private getRecent() {
        this.recent.getModuleRecent("Users").subscribe(recent => this.filterRecent(recent));
    }

    get searchTerm() {
        return this.searchterm;
    }

    private filterRecent(recent) {
        this.recentUsers =  recent.filter(user => user.item_id != this.owner && _.findWhere(this.calendar.usersCalendars, {id: user.item_id}) == undefined);
    }

    private filterResultsList(resultsList) {
        this.resultsList = resultsList.filter(user => user.id != this.owner && _.findWhere(this.calendar.usersCalendars, {id: user.id}) == undefined);
    }

    private addUserCalendar(id, name) {
        this.calendar.addUserCalendar(id, name);
        this.filterRecent(this.recentUsers);
        this.filterResultsList(this.resultsList);
    }

    private removeUserCalendar(id) {
        this.calendar.removeUserCalendar(id);
    }

    private removeOtherCalendar(id) {
        this.calendar.removeOtherCalendar(id);
    }

    private toggleVisible(id, type) {
        switch (type) {
            case "Users":
                this.calendar.usersCalendars.some(calendar => {
                    if (calendar.id == id) {
                        calendar.visible = !calendar.visible;
                        this.calendar.setUserCalendars(this.calendar.usersCalendars.slice());
                        return true;
                    }
                });
                break;
            case "Other":
                this.calendar.otherCalendars.some(calendar => {
                    if (calendar.id == id) {
                        calendar.visible = !calendar.visible;
                        this.calendar.setOtherCalendars(this.calendar.otherCalendars.slice());
                        return true;
                    }
                });
                break;
            case "Google":
                this.googleIsVisible = !this.googleIsVisible;
                this.googleIsVisible$.emit(this.googleIsVisible);
        }
    }

    private setColor(id, color, type) {
        this.calendar.setColor(id, color, type);
    }
}
