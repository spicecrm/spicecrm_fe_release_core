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
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.02.001
 * date: 2021-06-24 11:36:53
 * build: 2021.02.001.1624527413323
 **/
"use strict";var __extends=this&&this.__extends||function(){var s=function(e,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}(),__decorate=this&&this.__decorate||function(e,t,o,s){var n,i=arguments.length,a=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,o):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,s);else for(var l=e.length-1;0<=l;l--)(n=e[l])&&(a=(i<3?n(a):3<i?n(t,o,a):n(t,o))||a);return 3<i&&a&&Object.defineProperty(t,o,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleDocuments=exports.DocumentCreateRevisionModal=exports.DocumentCreateRevisionButton=exports.fieldDocumentRevisionStatus=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),services_1=require("../../services/services"),moduleoutputtemplates_1=require("../../modules/outputtemplates/moduleoutputtemplates"),rxjs_1=require("rxjs"),platform_browser_1=require("@angular/platform-browser"),fieldDocumentRevisionStatus=function(d){function fieldDocumentRevisionStatus(e,t,o,s,n,i,a,l,r){var c=d.call(this,e,o,s,n,i)||this;return c.model=e,c.navigation=t,c.language=s,c.metadata=n,c.router=i,c.modal=a,c.relatedmodels=l,c.backend=r,c}var e;return __extends(fieldDocumentRevisionStatus,d),fieldDocumentRevisionStatus.prototype.ngOnInit=function(){var t=this;d.prototype.ngOnInit.call(this),this.parent=this.navigation.getRegisteredModel(this.model.data.document_id,"Documents"),this.subscriptions.add(this.parent.observeFieldChanges("status_id").subscribe(function(e){"Expired"==e&&(t.value="a")}))},fieldDocumentRevisionStatus.prototype.getValue=function(){return this.language.getFieldDisplayOptionValue(this.model.module,this.fieldname,this.value)},Object.defineProperty(fieldDocumentRevisionStatus.prototype,"canActivate",{get:function(){return!this.model.isEditing&&"c"==this.value&&this.model.checkAccess("edit")&&"Expired"!=this.parent.getField("status_id")},enumerable:!1,configurable:!0}),fieldDocumentRevisionStatus.prototype.activateRevision=function(){var t=this;this.modal.prompt("confirm",this.language.getLabel("MSG_ACTIVATE_REVISION","","long")).subscribe(function(e){e&&(t.model.startEdit(),t.value="r",t.model.save().subscribe(function(e){t.parent&&t.parent.setField("revision",t.model.data.revision)}))})},fieldDocumentRevisionStatus=__decorate([core_1.Component({template:'<field-label *ngIf="displayLabel" [fieldname]="fieldname" [fieldconfig]="fieldconfig"></field-label><field-generic-display [fielddisplayclass]="fielddisplayclass" [editable]="isEditable()" [fieldconfig]="fieldconfig" [fieldid]="fieldid"><div class="slds-grid slds-grid--vertical-align-center"><span>{{getValue()}}</span> <button *ngIf="canActivate" class="slds-button slds-button--icon slds-theme--warning slds-m-left--x-small" (click)="activateRevision()"><system-button-icon icon="light_bulb"></system-button-icon></button></div></field-generic-display>'}),__metadata("design:paramtypes",[services_1.model,services_1.navigation,services_1.view,services_1.language,services_1.metadata,"function"==typeof(e=void 0!==router_1.Router&&router_1.Router)?e:Object,services_1.modal,services_1.relatedmodels,services_1.backend])],fieldDocumentRevisionStatus)}(objectfields_1.fieldGeneric);exports.fieldDocumentRevisionStatus=fieldDocumentRevisionStatus;var DocumentCreateRevisionButton=function(r){function DocumentCreateRevisionButton(e,t,o,s,n,i,a){var l=r.call(this,e,t,o,s,n,i)||this;return l.language=e,l.model=t,l.modal=o,l.backend=s,l.configuration=n,l.viewContainerRef=i,l.relatedmodels=a,l.subscriptions=new rxjs_1.Subscription,l}var e;return __extends(DocumentCreateRevisionButton,r),DocumentCreateRevisionButton.prototype.openOutput=function(){var o=this;0<this.templates.length?(this.templates.sort(function(e,t){return e.name>t.name?1:-1}),this.modal.openModal("DocumentCreateRevisionModal",!0,this.viewContainerRef.injector).subscribe(function(e){var t=new core_1.EventEmitter;e.instance.templates=o.templates,e.instance.modalTitle="LBL_CREATE_REVISION",e.instance.handBack=t,o.subscriptions.add(t.subscribe(function(e){o.backend.postRequest("module/Documents/"+o.model.id+"/revisionfrombase64","",{file_name:e.name+".pdf",file:e.content,file_mime_type:"application/pdf",documentrevisionstatus:"r"}).subscribe(function(e){o.relatedmodels.getData()})}))})):this.modal.info("No Templates Found","there are no Output templates defined for the Module")},DocumentCreateRevisionButton.prototype.ngOnDestroy=function(){this.subscriptions.unsubscribe()},DocumentCreateRevisionButton=__decorate([core_1.Component({selector:"document-create-revision-button",template:'<system-label label="LBL_CREATE_REVISION"></system-label>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.modal,services_1.backend,services_1.configurationService,"function"==typeof(e=void 0!==core_1.ViewContainerRef&&core_1.ViewContainerRef)?e:Object,services_1.relatedmodels])],DocumentCreateRevisionButton)}(moduleoutputtemplates_1.ObjectActionOutputBeanButton);exports.DocumentCreateRevisionButton=DocumentCreateRevisionButton;var DocumentCreateRevisionModal=function(c){function DocumentCreateRevisionModal(e,t,o,s,n,i,a,l){var r=c.call(this,e,t,o,s,n,i,a,l)||this;return r.language=e,r.model=t,r.metadata=o,r.modal=s,r.view=n,r.backend=i,r.sanitizer=a,r.viewContainerRef=l,r}var e,t;return __extends(DocumentCreateRevisionModal,c),DocumentCreateRevisionModal.prototype.create=function(){this.handBack.emit({name:this.selected_template.name,content:this.contentForHandBack}),this.close()},DocumentCreateRevisionModal=__decorate([core_1.Component({selector:"object-action-output-bean-modal",template:'<system-modal size="large"><system-modal-header (close)="close()">{{modalTitle}}</system-modal-header><system-modal-content margin="none"><div class="slds-modal__content"><div class="slds-form-element__control slds-grid slds-grid--vertical-align-center slds-p-around--small"><label class="slds-col slds-p-right--x-small"><system-label label="LBL_TEMPLATE"></system-label></label><select class="slds-col slds-select slds-grow" [(ngModel)]="selected_template" [disabled]="templates.length == 0"><option *ngFor="let templ of templates" [ngValue]="templ">{{templ.name}} ({{templ.language}})</option></select></div><div class="slds-grid" style="height: 70vh;"><div class="slds-p-around--small" style="height: 100%; width: 200%" [@slideInOut]="expanded? \'open\': \'closed\'"><div class="slds-m-top--small slds-border--top slds-border--right slds-border--left slds-border--bottom" style="width: 100%; height: calc(100% - 50px);"><iframe *ngIf="selected_format === \'html\' && !loading_output && selected_template" frameBorder="0" style="width: 100%;height: 100%;" [srcdoc]="sanitizedTemplated"></iframe><object *ngIf="selected_format === \'pdf\' && !loading_output && blobUrl" [data]="blobUrl" type="application/pdf" width="100%" height="100%"></object><div *ngIf="loading_output" class="slds-align--absolute-center" style="height: 100%;"><system-spinner></system-spinner></div><div *ngIf="!selected_template && !loading_output" class="slds-align--absolute-center" style="height: 100%;"><system-label label="LBL_SELECT_TEMPLATE"></system-label></div></div></div></div></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CANCEL"></system-label></button> <button [disabled]="!selected_template || loading_output" class="slds-button slds-button--brand" (click)="create()"><system-label label="LBL_CREATE"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.metadata,services_1.modal,services_1.view,services_1.backend,"function"==typeof(e=void 0!==platform_browser_1.DomSanitizer&&platform_browser_1.DomSanitizer)?e:Object,"function"==typeof(t=void 0!==core_1.ViewContainerRef&&core_1.ViewContainerRef)?t:Object])],DocumentCreateRevisionModal)}(moduleoutputtemplates_1.ObjectActionOutputBeanModal);exports.DocumentCreateRevisionModal=DocumentCreateRevisionModal;var ModuleDocuments=function(){function ModuleDocuments(){}return ModuleDocuments=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[fieldDocumentRevisionStatus,DocumentCreateRevisionButton,DocumentCreateRevisionModal]})],ModuleDocuments)}();exports.ModuleDocuments=ModuleDocuments;