/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-time',
    templateUrl: './src/objectfields/templates/fieldtime.html',
    providers: [popup]
})
export class fieldTime extends fieldGeneric {
    @ViewChild('timefield', {read: ViewContainerRef}) timefield: ViewContainerRef;

    public showDatePicker: boolean = false;
    public showTimePicker: boolean = false;
    private isValid: boolean = true;
    private clickListener: any = undefined;
    public dropdownTimes: Array<any> = [];

    public dateFormat: string = 'DD.MM.YYYY';
    public timeFormat: string = 'HH:mm';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private popup: popup,
        private renderer: Renderer,
        private elementRef: ElementRef
    ) {
        super(model, view, language, metadata, router);
        let i = 0;
        while (i < 24) {
            let timeString = '';
            if (i < 10)
                timeString += '0' + i + ':';
            else
                timeString = i + ':';

            this.dropdownTimes.push(timeString + '00');
            this.dropdownTimes.push(timeString + '15');
            this.dropdownTimes.push(timeString + '30');
            this.dropdownTimes.push(timeString + '45');

            i++;
        }
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */

    toggleTimePicker() {
        this.showTimePicker = !this.showTimePicker;
        if (this.showTimePicker) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickListener();
            this.showDatePicker = false;
            this.showTimePicker = false;
        }
    }

    // overwrite get Field Class
    getFieldClass() {
        let classes: Array<string> = [];
        if (!this.isValid) classes.push('slds-has-error');
        return classes;
    }

    /*
     get the positon for the time dropdown
     */
    get timefieldStyle() {
        let rect = this.timefield.element.nativeElement.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top + rect.height
        }
    }

    public getNearestDropdownTime()
    {
        for(let dt of this.dropdownTimes)
        {
            if(dt >= this.editTime)
                return dt;
        }
    }

    public getNextDropdownTime()
    {
        let dt = this.getNearestDropdownTime();
        return this.dropdownTimes[this.dropdownTimes.findIndex(e => e == dt)+1];
    }

    public getBeforeDropdownTime()
    {
        let dt = this.getNearestDropdownTime();
        return this.dropdownTimes[this.dropdownTimes.findIndex(e => e == dt)-1];
    }

    get displayTime() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = this.model.data[this.fieldname];
                if (date.isValid()) {

                    return date.format(this.timeFormat);
                }
                else
                    return '';
            }
            else
                return '';
        } catch (e) {
            return '';
        }
    }

    get editTime() {

        try {
            if (this.value) {
                let time = new moment(this.value);
                if (time.isValid())
                    return time.format('HH:mm');
                else{
                    time = '';
                    return time;
                }
            }
            else return '';
        } catch (e) {
            return '';
        }
    }

    set editTime(value) {
        let setTime = new moment(value, this.timeFormat, true);
        setTime.second(0);
        if (setTime.isValid()) {
            // set the date
            if (this.model.data[this.fieldname] && !isNaN(this.model.data[this.fieldname].year())) {
                setTime.year(this.model.data[this.fieldname].year());
                setTime.month(this.model.data[this.fieldname].month());
                setTime.date(this.model.data[this.fieldname].date());
            }

            this.value = setTime;

            // set the data so rules and emitter get triggered
            this.model.setFieldValue(this.fieldname, setTime);

            //this.isValid = true;
            this.clearFieldError();
        } else {
            if(typeof value == 'string' && value.length <= 2 && value.length > 0){
                if(parseInt(value) < 10)
                    value = `0${value}:00`;
                else
                    value = `${value}:00`;
                this.editTime = value;
                return;
            }
            //this.isValid = false;
            this.setFieldError(`${value} is not a valid time`);
        }
    }

    setTime(value) {
        this.editTime = value;
        this.showTimePicker = false;
    }
}