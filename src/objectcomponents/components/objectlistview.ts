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

import {AfterViewInit, Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
import {userpreferences} from '../../services/userpreferences.service';

/**
 * the default route set to display the list view
 */
@Component({
    selector: 'object-listview',
    templateUrl: './src/objectcomponents/templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements OnInit, AfterViewInit {
    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * the name of the module
     */
    private moduleName: any = '';

    /**
     * indicates if the view has been initialized
     */
    private initialized: boolean = false;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    private componentRefs: any = [];

    /**
     * the componentconfig as passed in or initialized
     */
    private componentconfig: any = {lists: []};

    private currentList: string = '';
    private currentListComponent: any = undefined;

    constructor(private navigation: navigation, private activatedRoute: ActivatedRoute, private metadata: metadata, private modellist: modellist, private model: model, private userpreferences: userpreferences) {

        // get the module from teh activated route
        this.moduleName = this.activatedRoute.params['value']['module'];
        this.model.module = this.moduleName;

        // set the navigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // set the module and get the list
        this.modellist.setModule(this.moduleName);

        // set so the views use the cahced results
        this.modellist.usecache = true;

        if (this.initialized) this.buildContainer();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        if (this.lists.length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.componentconfig.lists = [];
                for (let item of items) {
                    this.componentconfig.lists.push({
                        component: item.component,
                        icon: item.componentconfig.icon,
                        label: item.componentconfig.name
                    });
                }
                // set the first as default list
                this.componentconfig.defaultlist = this.componentconfig.lists[0].component;
            } else {
                let componentconfig = this.metadata.getComponentConfig('ObjectListView', this.model.module);
                let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
                this.componentconfig = {
                    lists: []
                };
                for (let item of items) {
                    this.componentconfig.lists.push({
                        component: item.component,
                        icon: item.componentconfig.icon,
                        label: item.componentconfig.name
                    });
                }
                // set the first as default list
                // this.userpreferences.setPreference('defaultlisttype', event.list, true, this.modellist.module);
                let preflist = this.userpreferences.getPreference('defaultlisttype', this.modellist.module);
                if (preflist) {
                    this.componentconfig.defaultlist = preflist;
                } else {
                    this.componentconfig.defaultlist = this.componentconfig.lists[0].component;
                }
            }
        }
    }

    get lists() {
        try {
            return this.componentconfig.lists ? this.componentconfig.lists : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.initialized = true;
        this.currentList = this.componentconfig.defaultlist;
        this.buildContainer();
    }

    /**
     * renders a compoentnset in the container
     *
     * @param forcelist set a dedicated list to be rendered
     */
    private buildContainer(forcelist: string = '') {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        if (forcelist) {
            this.metadata.addComponent(forcelist, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
            });
            return;
        }
        // get the list from teh preferences if set
        let preflist = this.userpreferences.getPreference('defaultlisttype', 'SpiceUI_' + this.modellist.module);
        if (preflist) {
            this.metadata.addComponent(preflist, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
            });
            return;
        }

        // final resort
        if (this.componentconfig.defaultlist) {
            this.metadata.addComponent(this.currentList, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
            });
        }
    }

    /**
     * a getter for the style of the container to ensure that is rendered at full hieght with overflow hidden
     *
     * ToDo: check if not a specific toBottom compoennt would be better that is not scrollable
     */
    get containerStyle() {
        let rect = this.container.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'hidden'
        };
    }

    /*
     * tied to the oputput fromthe header to tolggle the event wnhn the list type changes
     */
    private handleHeaderEvent(event) {
        if (event.event && event.event == 'changelist') {
            // set preferences
            this.userpreferences.setPreference('defaultlisttype', event.list, false, 'SpiceUI_' + this.modellist.module);

            // set the current list and rebuild the container
            this.currentList = event.list;
            this.buildContainer(event.list);
        }
    }
}
