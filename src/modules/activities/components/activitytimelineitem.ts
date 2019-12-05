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
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {session} from '../../../services/session.service';
import {metadata} from '../../../services/metadata.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {activitiyTimeLineService} from "../../../services/activitiytimeline.service";

declare var moment: any;
declare var _: any;

@Component({
    selector: 'activitytimeline-item',
    templateUrl: './src/modules/activities/templates/activitytimelineitem.html',
    providers: [model, view]
})
export class ActivityTimelineItem implements OnInit {
    @Input() private activity: any = {};
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';

    private headerFieldSet: string;
    private headerFieldSetItems: any[] = [];

    private subheaderFieldSet: string;
    private subheaderFieldSetItems: any[] = [];

    private isopen: boolean = false;

    public componentconfig: any = {};

    /**
     * the module to be displayed
     */
    @Input() private module: string;

    constructor(private model: model, private metadata: metadata, private view: view, private userpreferences: userpreferences, private session: session) {
        this.view.isEditable = false;
        this.view.displayLabels = true;
    }

    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns the subject
     */
    get subject() {
        let subject = this.model.getField('summary_text');
        return subject ? subject : '-- no subject --';
    }

    /**
     * gets the activity time and returns it formatted
     */
    get starttime() {
        let startdate = new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    /**
     * gets the activity date and returns it formatted
     */
    get startdate() {
        let startdate = new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    /**
     * returns if the date shoudl be highlighted since it is in the past
     */
    get highlightdate() {
        return this.module == 'Activities' && new moment().hour(0).minute(0).second(0) >  new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
        this.model.module = this.activity.module;

        let defaultcomponentconfig = this.metadata.getComponentConfig('ActivityTimelineItem', this.model.module);

        // get the header fieldset
        this.headerFieldSet = this.componentconfig.headerfieldset ? this.componentconfig.headerfieldset : defaultcomponentconfig.headerfieldset;

        // get the subheader fieldset
        this.subheaderFieldSet = this.componentconfig.subheaderfieldset ? this.componentconfig.subheaderfieldset : defaultcomponentconfig.subheaderfieldset;

        // set the fieldset
        this.formFieldSet = this.componentconfig.fieldset;
    }

    /**
     * returns true if no fieldset for the expanded form is set and thus expanding is not possible
     */
    get cantexpand() {
        return this.formFieldSet == '';
    }

    /**
     * checks modsl ACL rules and if allowed enables get details
     */
    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    /**
     * navigate to the records
     */
    private goDetail() {
        if (this.enableDetail) this.model.goDetail();
    }

    /**
     * toggles teh state between expanded and collapsed
     */
    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}
