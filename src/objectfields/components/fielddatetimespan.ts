/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, Renderer, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

declare var moment: any;

@Component({
    selector: 'field-date-time-span',
    templateUrl: './src/objectfields/templates/fielddatetimespan.html'
})
export class fieldDateTimeSpan extends fieldGeneric implements OnInit {
    private isValid: boolean = true;
    private errorMessage: String = '';

    get fieldstart() {
        return this.fieldconfig.field_start ? this.fieldconfig.field_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    public ngOnInit() {
        this.calculateEndDate();
    }

    get duration() {
        let hours = this.model.getFieldValue(this.fieldhours);
        let minutes = this.model.getFieldValue(this.fieldminutes);

        return parseInt(hours, 10) * 60 + parseInt(minutes, 10) * 60;
    }

    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    set startDate(date) {
        this.model.setField(this.fieldstart, date);
        this.calculateEndDate();
        // console.log('start set');
    }

    get endDate() {
        return this.model.getField(this.fieldend);
    }

    set endDate(date) {
        // if startdate is not set .. set it ...
        if (!this.model.getFieldValue(this.fieldstart)) {
            this.startDate = new moment(date).subtract(this.duration, 'minutes');
        }

        if (date.isBefore(this.model.getFieldValue(this.fieldstart))) {
            this.isValid = false;
            this.errorMessage = 'enddate cannot be before startdate';
            this.model.setFieldMessage('error', 'enddate cannot be before startdate', this.fieldname, 'sequencecheck');
            // this.calculateEndDate();
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'sequencecheck');
            this.model.setField(this.fieldend, date);
            this.calculateDuration();
            this.isValid = true;
        }
    }

    private calculateEndDate() {
        if (this.startDate && this.duration) {
            this.endDate = new moment(this.startDate).add(this.duration, 'minutes');
        }
    }

    private calculateDuration() {
        // set the seconds to 0
        this.model.data[this.fieldend].seconds(0);
        this.model.data[this.fieldstart].seconds(0);

        let duration = moment.duration(this.model.data[this.fieldend].diff(this.model.data[this.fieldstart]));
        let hours = Math.floor(duration.asHours());
        let minutes = duration.asMinutes() - 60 * hours;

        this.model.data[this.fieldhours] = hours;
        this.model.data[this.fieldminutes] = minutes;
    }
}
