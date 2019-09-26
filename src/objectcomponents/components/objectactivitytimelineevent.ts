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
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {userpreferences} from '../../services/userpreferences.service';

declare var moment: any;

/**
 * a generic component to display an event in the activity timeline
 */
@Component({
    selector: 'object-activitiytimeline-event',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineevent.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineEvent implements OnInit {
    /**
     * the activity
     */
    @Input() private activity: any = {};

    /**
     * defines if the toolset/actonset icon shoudl be displayed
     *
     * defaults to true
     */
    @Input() private showtoolset: boolean = true;

    /**
     * the fieldset to be displayed
     */
    private formFieldSet: string = '';

    /**
     * internal variable if the event pane is open or collapsed
     */
    private isopen: boolean = false;

    constructor(private model: model, private userpreferences: userpreferences, private metadata: metadata, private view: view) {

        // is by default not editable
        this.view.isEditable = false;

        this.model.module = 'Meetings';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEvent', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    private goDetail() {
        this.model.goDetail();
    }

    get subject() {
        return this.model.getField('name');
    }

    get starttime() {
        let startdate = new moment(this.model.getField('date_start'));
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get startdate() {
        let startdate = new moment(this.model.getField('date_start'));
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }


    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}