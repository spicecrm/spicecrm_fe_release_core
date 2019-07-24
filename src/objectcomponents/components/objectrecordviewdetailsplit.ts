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
    AfterViewInit,  Component,  ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';


@Component({
    selector: 'object-recordview-detail-split',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetailsplit.html'

})
export class ObjectRecordViewDetailsplit implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('leftcontainer', {read: ViewContainerRef, static: true}) leftcontainer: ViewContainerRef;
    @ViewChild('rightcontainer', {read: ViewContainerRef, static: true}) rightcontainer: ViewContainerRef;
    initialized: boolean = false;
    componentRefs: any = [];
    componentSubscriptions: Array<any> = [];
    listViewDefs: any = [];
    componentSets: any = {};
    componentconfig: any = {};


    constructor( private metadata: metadata, private model: model, private elementRef: ElementRef ) {

    }

    ngOnInit(){

        if (this.initialized)
            this.buildContainer();

    }

    ngOnDestroy(){
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }


    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        if(!this.componentconfig.left || !this.componentconfig.right) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetailsplit', this.model.module);
            if(!this.componentconfig.left && componentconfig.left)
                this.componentconfig.left = componentconfig.left;
            if(!this.componentconfig.right && componentconfig.right)
                this.componentconfig.right = componentconfig.right;
        }
        if (this.componentconfig.left) {
            for (let view of this.metadata.getComponentSetObjects(this.componentconfig.left)) {
                this.metadata.addComponent(view.component, this.leftcontainer).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }

        if (this.componentconfig.right) {
            for (let view of this.metadata.getComponentSetObjects(this.componentconfig.right)) {
                this.metadata.addComponent(view.component, this.rightcontainer).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }

    }
}