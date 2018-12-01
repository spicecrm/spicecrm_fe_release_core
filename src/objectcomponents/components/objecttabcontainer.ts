/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

@Component({
    selector: 'object-tab-container-item-header',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritemheader.html'
})
export class ObjectTabContainerItemHeader implements AfterViewInit {
    @ViewChild('headercontainer', {read: ViewContainerRef}) headercontainer: ViewContainerRef;

    @Input() tab: any = [];

    constructor(private metadata: metadata, private language: language) {

    }

    get displayName() {
        return !this.tab.headercomponent && this.tab.name && this.tab.name != '';
    }

    ngAfterViewInit() {
        if (this.tab.headercomponent) {
            this.metadata.addComponent(this.tab.headercomponent, this.headercontainer);
        }
    }

    getTabLabel(label) {
        if (label.indexOf(':') > 0) {
            let arr = label.split(':');
            return this.language.getLabel(arr[0], arr[1])
        } else
            return this.language.getLabel(label)
    }
}


@Component({
    selector: 'object-tab-container-item',
    templateUrl: './src/objectcomponents/templates/objecttabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectTabContainerItem implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    componentRefs: any = [];
    initialized: boolean = false;
    @Input() componentset: any = [];
    @Output() taberrors = new EventEmitter();

    constructor(private metadata: metadata, private fielderrorgroup: fielderrorgrouping ) { }

    ngOnInit() {
        this.fielderrorgroup.change$.subscribe( (nr) => {
            this.taberrors.emit( nr );
        });
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
    }

    buildContainer() {
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                this.componentRefs.push(componentRef);
                componentRef.instance['componentconfig'] = component.componentconfig;
            });
        }
    }
}

@Component({
    selector: 'object-tab-container',
    templateUrl: './src/objectcomponents/templates/objecttabcontainer.html'
})
export class ObjectTabContainer implements OnInit {
    activeTab: number = 0;
    activatedTabs: Array<number> = [0];
    componentconfig: any = {
        tabs: []
    };

    tabs: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    ngOnInit() {
        if (this.getTabs().length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            } else {
                let componentconfig = this.metadata.getComponentConfig('ObjectTabContainer', this.model.module);
                let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            }
        } else {
            this.tabs = this.getTabs();
        }
    }

    getTabs() {
        try {
            return this.componentconfig.tabs ? this.componentconfig.tabs : [];
        } catch (e) {
            return [];
        }
    }

    getTabLabel(label) {
        if (label.indexOf(':') > 0) {
            let arr = label.split(':');
            return this.language.getLabel(arr[0], arr[1])
        } else
            return this.language.getLabel(label)
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.componentconfig.tabs && this.componentconfig.tabs[tabindex].forcerender);
    }

    getDisplay(tabindex) {

        if (tabindex !== this.activeTab)
            return {
                display: 'none'
            };

    }
}
