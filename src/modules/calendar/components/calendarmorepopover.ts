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
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/modules/calendar/templates/calendarmorepopover.html',
    providers: [calendar]
})
export class CalendarMorePopover implements OnInit {
    public events: any[] = [];
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public styles = null;
    public isMobileView: boolean = false;
    public sheetDay: any = {};
    public parentElementRef: any = null;
    public self: any = null;
    private hidePopoverTimeout: any = {};
    @ViewChild('popover', {read: ViewContainerRef}) private popover: ViewContainerRef;
    private heightcorrection = 30;
    private widthcorrection = 30;

    constructor(private metadata: metadata, private calendar: calendar, private language: language) {
    }

    get shortDate() {
        let navigateDate = moment(this.calendar.calendarDate);
        return navigateDate.month(this.sheetDay.month).date(this.sheetDay.day).format('D MMM,');
    }

    get popoverStyle() {
        if (this.isMobileView) {
            return {left: 0, bottom: 0, width: '100%'};
        }

        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + this.heightcorrection > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        }
    }

    public ngOnInit() {
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    public closePopover(force = false) {
        if (force) {
            this.self.destroy();
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    private onMouseOut() {
        this.closePopover(true);
    }

    private getNubbinClass() {
        return (this.popoverside == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverpos;
    }
}
