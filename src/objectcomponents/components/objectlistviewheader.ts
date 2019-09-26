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
import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'object-listview-header',
    templateUrl: './src/objectcomponents/templates/objectlistviewheader.html',
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectListViewHeader implements OnDestroy {
    @Input() private parentconfig: any = [];
    @Output() private headerevent = new EventEmitter<any>();
    private actionSet: any = {};
    private searchTimeOut: any;
    private panelButtonState: string = '';
    private listTypeSubscription: any;
    private moduleName: string = '';

    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute, private router: Router, private modellist: modellist, private language: language, private model: model) {
        /*
        this.activatedRoute.params.subscribe(params => {
            this.moduleName = params['module'];
        });
        */

        this.listTypeSubscription = this.modellist.listtype$.subscribe(list => {
            this.configChange();
        })

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    public ngOnDestroy(): void {
        this.listTypeSubscription.unsubscribe();
    }

    private configChange() {
        // in case filtering is not allowed .. hide the filterpanel
        if (this.panelButtonState === 'filter' && this.filterDisabled()) this.panelButtonState = '';

        if (this.panelButtonState === 'aggregates' && this.aggregatesDisabled()) this.panelButtonState = '';
    }


    private setPanelButton(state) {
        if (this.panelButtonState === state) {
            this.panelButtonState = '';
        } else {
            this.panelButtonState = state;
        }

    }


    private changeList(event) {
        this.headerevent.emit({event: 'changelist', list: event});
    }

    private getPanelButtonClass(state) {
        if (state === this.panelButtonState) {
            return 'slds-is-selected';
        } else {
            return '';
        }
    }

    private getFilterPanelStyle() {
        return {
            right: (this.panelButtonState === 'filter' ? '0px' : '-320px')
        };
    }

    private getAggregatesPanelStyle() {
        return {
            right: (this.panelButtonState === 'aggregates' ? '0px' : '-320px')
        };
    }

    private filterDisabled() {
        return !(this.modellist.filterEnabled());
    }

    private aggregatesDisabled() {
        return !(this.modellist.aggregatesEnabled());
    }

    private onKeyUp(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.modellist.reLoadList();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
                break;
        }
    }


}
