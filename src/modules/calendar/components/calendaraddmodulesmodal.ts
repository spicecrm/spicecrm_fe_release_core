/*
SpiceUI 2021.01.001

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
import {ChangeDetectionStrategy, Component, EventEmitter} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from "../services/calendar.service";

/**
 * Displays a modal with a list of possible modules to add calendar event.
 */
@Component({
    templateUrl: './src/modules/calendar/templates/calendaraddmodulesmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarAddModulesModal {
    /**
     * emit the selected module when
     */
    public module$ = new EventEmitter<any>();
    /**
     * reference of this component to be destroyed
     */
    private self: any = {};

    constructor(private language: language, private calendar: calendar) {
    }

    /**
     * close the modal and emit false
     */
    private close() {
        this.module$.emit(false);
        this.self.destroy();
    }

    /**
     * emit the selected module and close the modal
     * @param module
     */
    private save(module) {
        this.module$.emit(module);
        this.self.destroy();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    private trackByFn(index, item) {
        return item.id;
    }
}
