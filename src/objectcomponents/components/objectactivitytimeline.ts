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
    Component,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimeline.html',
    providers: [activitiyTimeLineService]
})
export class ObjectActivitiyTimeline implements OnInit, OnDestroy {

    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};

    public displayAddContainer: boolean = false;

    private displayaggregates = {
        Activities: false,
        History: false
    }

    constructor(private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute) {

    }

    /**
     * getter for the searchterm
     */
    get ftsSearchTerm() {
        return this.activitiyTimeLineService.filters.searchterm;
    }

    /**
     * setter for the searchterm. When entered will also start a reload
     *
     * @param searchterm the searchterm
     */
    set ftsSearchTerm(searchterm) {
        this.activitiyTimeLineService.filters.searchterm = searchterm;
        this.activitiyTimeLineService.reload();
    }

    public ngOnInit() {
        this.parentModule = this.model.module;
        this.parentId = this.model.id;

        this.activitiyTimeLineService.parent = this.model;

        if (!this.componentconfig.hideaddcontainer) {
            this.displayAddContainer = true;
        }

        if (this.componentconfig.usefts) this.activitiyTimeLineService.usefts = true;
        if (this.componentconfig.defaultentries) this.activitiyTimeLineService.defaultLimit = this.componentconfig.defaultentries;

    }

    public ngOnDestroy() {
        this.activitiyTimeLineService.stopSubscriptions();
    }

    public reload() {
        this.activitiyTimeLineService.getTimeLineData('Activities');
        this.activitiyTimeLineService.getTimeLineData('History');
    }

    public loadMore(module) {
        this.activitiyTimeLineService.getMoreTimeLineData(module, 5);
    }
}
