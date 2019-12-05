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
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";

import {userpreferences} from "../../services/userpreferences.service";

import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ { calendar } from "./services/calendar.service";

import /*embed*/ {CalendarHeader} from "./components/calendarheader";
import /*embed*/ {Calendar} from "./components/calendar";
import /*embed*/ {CalendarSheetDay} from "./components/calendarsheetday";
import /*embed*/ {CalendarSheetThreeDays} from "./components/calendarsheetthreedays";
import /*embed*/ {CalendarSheetWeek} from "./components/calendarsheetweek";
import /*embed*/ {CalendarSheetMonth} from "./components/calendarsheetmonth";
import /*embed*/ {CalendarSheetSchedule} from "./components/calendarsheetschedule";
import /*embed*/ {CalendarSheetEvent} from "./components/calendarsheetevent";
import /*embed*/ {CalendarSheetDropTarget} from "./components/calendarsheetdroptarget";
import /*embed*/ {CalendarMorePopover} from "./components/calendarmorepopover";
import /*embed*/ {CalendarMorePopoverEvent} from "./components/calendarmorepopoverevent";
import /*embed*/ {CalendarMoreButton} from "./components/calendarmorebutton";
import /*embed*/ {CalendarAddCalendar} from "./components/calendaraddcalendar";
import /*embed*/ {CalendarAddModulesModal} from "./components/calendaraddmodulesmodal";
import /*embed*/ {CalendarOtherCalendarsMonitor} from "./components/calendarothercalendarsmonitor";
import /*embed*/ {CalendarColorPicker} from "./components/calendarcolorpicker";
import /*embed*/ {CalendarScheduleDashlet} from "./components/calendarscheduledashlet";
import /*embed*/ {CalendarDayDashlet} from "./components/calendardaydashlet";
import /*embed*/ {CalendarThreeDaysDashlet} from "./components/calendarthreedaysdashlet";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],

    declarations: [
        Calendar,
        CalendarHeader,
        CalendarSheetDay,
        CalendarSheetThreeDays,
        CalendarSheetWeek,
        CalendarSheetMonth,
        CalendarSheetSchedule,
        CalendarSheetEvent,
        CalendarSheetDropTarget,
        CalendarMorePopover,
        CalendarMorePopoverEvent,
        CalendarMoreButton,
        CalendarAddCalendar,
        CalendarAddModulesModal,
        CalendarOtherCalendarsMonitor,
        CalendarColorPicker,
        CalendarScheduleDashlet,
        CalendarDayDashlet,
        CalendarThreeDaysDashlet
    ],
    providers: [userpreferences]
})
export class ModuleCalendar {
    public version = "1.0";
    public build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
