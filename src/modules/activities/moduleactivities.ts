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
 * @module ModuleActivities
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {TasksManager} from './components/tasksmanager';
import /*embed*/ {TasksManagerView} from './components/tasksmanagerview';
import /*embed*/ {TasksManagerHeader} from './components/tasksmanagerheader';
import /*embed*/ {TasksManagerTasks} from './components/tasksmanagertasks';
import /*embed*/ {TasksManagerTask} from './components/tasksmanagertask';
import /*embed*/ {TasksManagerTaskDetails} from './components/tasksmanagertaskdetails';
import /*embed*/ {TasksAssitantTileClose} from './components/tasksassitanttileclose';

import /*embed*/ {ActivityTimelineSaveButton} from "./components/activitytimelinesavebutton";
import /*embed*/ {ActionActivityCloseButton} from "./components/actionactivityclosebutton";
import /*embed*/ {ActionActivityCloseCreateButton} from "./components/actionactivityclosecreatebutton";
import /*embed*/ {ActivityCloseModal} from "./components/activityclosemodal";
import /*embed*/ {ActivityCloseCreateModal} from "./components/activityclosecreatemodal";

import /*embed*/ {ActivitiesPopoverAddBar} from "./components/activitiespopoveraddbar";
import /*embed*/ {ActivitiesPopoverAddBarButton} from "./components/activitiespopoveraddbarbutton";
import /*embed*/ {fieldActivitiesAddActions} from "./components/fieldactivitiesaddactions";
import /*embed*/ {fieldActivitiesAddActionsButton} from "./components/fieldactivitiesaddactionsbutton";
import /*embed*/ {fieldActivitiesTaskWithCloseCheckbox} from "./components/fieldactivitiestaskwithclosecheckbox";

import /*embed*/ {ActivityTimeline} from './components/activitytimeline';
import /*embed*/ {ActivityTimelineFilter} from "./components/activitytimelinefilter";
import /*embed*/ {ActivityTimelineContainer} from './components/activitytimelinecontainer';
import /*embed*/ {ActivityTimelineItemContainer} from './components/activitytimelineitemcontainer';
import /*embed*/ {ActivityTimelineAddTabContainer} from './components/activitytimelineaddtabcontainer';
import /*embed*/ {ActivityTimelineItem} from './components/activitytimelineitem';
import /*embed*/ {ActivityTimelineStencil} from './components/activitytimelinestencil';
import /*embed*/ {ActivityTimelineAddContainer} from './components/activitytimelineaddcontainer';
import /*embed*/ {ActivityTimelineAddItem} from './components/activitytimelineadditem';
import /*embed*/ {ActivityTimelineAddEmail} from './components/activitytimelineaddemail';
import /*embed*/ {ActivityTimelineSummary} from './components/activitytimelinesummary';
import /*embed*/ {ActivityTimelineAggregates} from './components/activitytimelineaggregates';
import /*embed*/ {ActivityTimelineSummaryItemView} from './components/activitytimelinesummaryitemview';
import /*embed*/ {ActivityTimelineSummaryButton} from './components/activitytimelinesummarybutton';
import /*embed*/ {ActivityTimelineSummaryAggregates} from './components/activitytimelinesummaryaggregates';

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
        TasksManager,
        TasksManagerView,
        TasksManagerHeader,
        TasksManagerTasks,
        TasksManagerTask,
        TasksManagerTaskDetails,
        TasksAssitantTileClose,
        ActivityTimelineSaveButton,
        ActionActivityCloseButton,
        ActionActivityCloseCreateButton,
        ActivityCloseModal,
        ActivityCloseCreateModal,
        ActivitiesPopoverAddBar,
        ActivitiesPopoverAddBarButton,
        fieldActivitiesAddActions,
        fieldActivitiesAddActionsButton,
        fieldActivitiesTaskWithCloseCheckbox,
        ActivityTimeline,
        ActivityTimelineFilter,
        ActivityTimelineContainer,
        ActivityTimelineItemContainer,
        ActivityTimelineAddTabContainer,
        ActivityTimelineItem,
        ActivityTimelineStencil,
        ActivityTimelineAddContainer,
        ActivityTimelineAddItem,
        ActivityTimelineAddEmail,
        ActivityTimelineSummary,
        ActivityTimelineAggregates,
        ActivityTimelineSummaryItemView,
        ActivityTimelineSummaryButton,
        ActivityTimelineSummaryAggregates
    ],
    exports: [
        ActivityTimelineItemContainer,
        ActivityTimelineStencil
    ]
})
export class ModuleActivities {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
