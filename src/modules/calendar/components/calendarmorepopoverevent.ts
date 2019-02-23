/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

declare var moment: any;

@Component({
    selector: 'calendar-more-popover-event',
    templateUrl: './src/modules/calendar/templates/calendarmorepopoverevent.html',
    providers: [view, model]

})

export class CalendarMorePopoverEvent implements OnInit, OnDestroy {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;
    @Input() public event: any = {};
    @Output() public action$: EventEmitter<any> = new EventEmitter<any>();
    private modeSubscriber: Subscription = new Subscription();

    constructor(private model: model, private session: session, private userpreferences: userpreferences, private router: Router) {
        this.modeSubscriber = this.model.mode$.subscribe(mode => this.action$.emit(mode));
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
    }

    public ngOnDestroy() {
        this.modeSubscriber.unsubscribe();
    }

    private goDetails(id, module) {
        this.router.navigate([`/module/${module}/${id}`]);
        this.action$.emit(true);
    }

    private canEdit(id) {
        return this.session.authData.userId == id;
    }

    private getStartHour(event) {
        return event.data.date_start ? moment(event.data.date_start).tz(moment.tz.guess())
            .add(moment().utcOffset(), 'm').format(this.userpreferences.getTimeFormat()) : "00:00";
    }
}