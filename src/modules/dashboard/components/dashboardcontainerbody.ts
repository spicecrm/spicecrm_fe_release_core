/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-body',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerbody.html',
    styles: [
        `.slds-button--icon {color: #eeeeee}
        .slds-button--icon:hover {color: #5B5B5B}`
    ]
})
export class DashboardContainerBody implements AfterViewInit, OnInit, OnDestroy, OnChanges {
    @ViewChild('bodycontainer', {read: ViewContainerRef}) bodycontainer: ViewContainerRef;
    @Input() dashboardid: string = '';
    resizeListener: any = {};

    constructor(private dashboardlayout: dashboardlayout, private language: language, private elementRef: ElementRef, private renderer: Renderer2) {
        this.resizeListener = this.renderer.listen('window', 'resize', () => this.calculateGrid());
        this.renderer.listen('window', 'mousemove',(event)=> {
            if (this.dashboardlayout.editMode&& this.dashboardlayout.isMoving){
                if (event.pageY < (this.dashboardlayout.mainContainer.top + 20) && this.bodycontainer.element.nativeElement.scrollTop > 0)
                    this.bodycontainer.element.nativeElement.scrollTop -= ((this.dashboardlayout.mainContainer.top + 20) - event.pageY) * ((this.dashboardlayout.mainContainer.top + 20) - event.pageY);
                if (event.pageY > (this.dashboardlayout.mainContainer.bottom - 20))
                    this.bodycontainer.element.nativeElement.scrollTop += (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20)) * (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20));
            }
        });
    }

    ngOnInit() {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    ngOnChanges(){
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    ngAfterViewInit() {
        this.calculateGrid();
    }

    ngOnDestroy() {
        this.resizeListener();
    }

    get isEditing(){
        return this.dashboardlayout.editMode === true ? true : false;
    }

    get bodyContainerStyle(){
        return {
            height: 'calc(97vh - ' + this.bodycontainer.element.nativeElement.getBoundingClientRect().top + 'px)',
            border: this.dashboardlayout.editMode ? '1px dashed #ca1b21' : '0',
            'padding-right': this.dashboardlayout.paddingRight + 'px'
        };
    }

    calculateGrid() {
        this.dashboardlayout.mainContainer = this.elementRef.nativeElement.getBoundingClientRect();
        this.dashboardlayout.calculateGrid();
    }

    addDashlet(column){
        this.dashboardlayout.addDashlet(column);
    }

}