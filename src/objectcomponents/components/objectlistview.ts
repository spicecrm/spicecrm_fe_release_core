/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/


import {AfterViewInit, Component, ViewChild, ViewContainerRef, Input, OnInit} from '@angular/core';
import { ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';


@Component({
    selector: 'object-listview',
    templateUrl: './src/objectcomponents/templates/objectlistview.html',
    providers: [modellist, model]
})
export class ObjectListView implements OnInit, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    moduleName: any = '';
    initialized: boolean = false;

    componentRefs: any = [];
    componentconfig: any = {lists:[]};

    currentList: string = '';
    currentListComponent: any = undefined;

    constructor(private navigation: navigation, private activatedRoute: ActivatedRoute, private metadata: metadata, private modellist: modellist, private model: model) {

        // get the module from teh activated route
        this.moduleName = this.activatedRoute.params['value']['module'];
        this.model.module = this.moduleName;

        // set the navigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // set the module and get the list
        this.modellist.setModule(this.moduleName);

        if (this.initialized)
            this.buildContainer();
    }

    ngOnInit(){
        if(this.lists.length == 0){
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
                this.componentconfig.defaultlist = this.componentconfig.lists[0].component;
            }
        }
    }

    get lists(){
        try{
            return this.componentconfig.lists ? this.componentconfig.lists : [];
        } catch(e){
            return [];
        }
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.currentList = this.componentconfig.defaultlist;
        this.buildContainer();
    }

    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
        if (this.componentconfig.defaultlist) {
            this.metadata.addComponent(this.currentList, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
            });
        }
    }

    getContainerStyle(){
        let rect = this.container.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top +'px)',
            'overflow-y': 'hidden'
        }
    }

    /*
     * tied to the oputput fromthe header to tolggle the event wnhn the list type changes
     */
    handleHeaderEvent(event){
        if(event.event && event.event == 'changelist') {
            this.currentList = event.list;
            this.buildContainer();
        }
    }
}