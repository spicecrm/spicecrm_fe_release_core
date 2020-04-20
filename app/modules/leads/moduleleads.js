/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/*(c) aac services 2020. All Rights reserved)*/
"use strict";var __extends=this&&this.__extends||function(){var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s])})(t,e)};return function(t,e){function s(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)}}(),__decorate=this&&this.__decorate||function(t,e,s,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,o);else for(var c=t.length-1;0<=c;c--)(a=t[c])&&(n=(i<3?a(n):3<i?a(e,s,n):a(e,s))||n);return 3<i&&n&&Object.defineProperty(e,s,n),n},__metadata=this&&this.__metadata||function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),router_1=require("@angular/router"),rxjs_1=require("rxjs"),LeadConvertButton=function(){function LeadConvertButton(t,e,s,o,a,i){this.language=t,this.metadata=e,this.model=s,this.router=o,this.toast=a,this.modal=i,this.disabled=!0}return LeadConvertButton.prototype.execute=function(){var e=this;"Converted"===this.model.data.status?this.toast.sendToast("Lead already Converted","warning"):this.model.getFieldValue("account_id")?this.modal.openModal("LeadConvertOpportunityModal").subscribe(function(t){t.instance.lead=e.model,t.instance.converted.subscribe(function(t){e.model.setField("status","Converted"),e.model.setField("opportunity_id",t.id),e.model.setField("opportunity_name",t.name),e.model.setField("opportunity_amount",t.amount),e.model.save()})}):this.router.navigate(["/module/Leads/"+this.model.id+"/convert"])},LeadConvertButton.prototype.ngOnInit=function(){var e=this;this.handleDisabled(),this.model.mode$.subscribe(function(t){e.handleDisabled()}),this.model.data$.subscribe(function(t){e.handleDisabled()})},LeadConvertButton.prototype.handleDisabled=function(){this.disabled="Converted"===this.model.getFieldValue("status")||!this.model.checkAccess("edit")},LeadConvertButton=__decorate([core_1.Component({selector:"lead-convert-button",template:'<span><system-label label="LBL_CONVERT_LEAD"></system-label></span>'}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,router_1.Router,services_1.toast,services_1.modal])],LeadConvertButton)}();exports.LeadConvertButton=LeadConvertButton;var LeadConvertModal=function(){function t(t,e,s){this.language=t,this.metadata=e,this.model=s,this.saveactions=[],this.closemodal=new core_1.EventEmitter}return t.prototype.close=function(){this.closemodal.emit(!0)},t.prototype.itemBorder=function(t){return t<this.saveactions.length-1},t.prototype.getStatusLabel=function(t){return this.language.getLabel("LBL_LEADCONVERT_"+t.toUpperCase())},__decorate([core_1.Input(),__metadata("design:type",Array)],t.prototype,"saveactions",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],t.prototype,"closemodal",void 0),t=__decorate([core_1.Component({selector:"lead-convert-modal",template:'<div role="dialog" tabindex="-1" class="slds-modal slds-fade-in-open"><div class="slds-modal__container"><div class="slds-modal__header"><button class="slds-button slds-modal__close slds-button--icon-inverse" title="Close"><svg class="slds-button__icon slds-button__icon--large" aria-hidden="true" (click)="close()"><use xlink:href="./sldassets/icons/utility-sprite/svg/symbols.svg#close"></use></svg></button><h2 class="slds-text-heading--medium"><system-label label="LBL_CONVERT_LEAD"></system-label></h2></div><div class="slds-modal__content slds-p-around--medium"><div class="slds-grid slds-grid--align-spread slds-p-vertical--small" *ngFor="let saveaction of saveactions; let i = index ;" [ngClass]="{\'slds-border--bottom\' : itemBorder(i)}"><div class="slds-truncate"><system-label [label]="saveaction.label"></system-label></div><div>{{getStatusLabel(saveaction.status)}}</div></div></div></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model])],t)}();exports.LeadConvertModal=LeadConvertModal;var LeadConvert=function(){function LeadConvert(t,e,s,o,a,i,n){this.language=t,this.metadata=e,this.model=s,this.router=o,this.activatedRoute=a,this.navigationtab=i,this.toast=n,this.moduleName="Leads",this.headerFieldSets=[],this.contact=void 0,this.account=void 0,this.selectedaccount=void 0,this.createAccount=!1,this.opportunity=void 0,this.createOpportunity=!1,this.createSaveActions=[],this.convertSubject=void 0,this.showSaveModal=!1,this.currentConvertStep=0,this.convertSteps=["Account","Contact","Opportunity"];var c=this.metadata.getComponentConfig("ObjectPageHeader","Leads");this.headerFieldSets=[c.fieldset]}return LeadConvert.prototype.ngAfterViewInit=function(){var e=this;this.model.module=this.moduleName,this.model.id=this.navigationtab.activeRoute.params.id,this.model.getData(!0,"detailview").subscribe(function(t){e.navigationtab.setTabInfo({displayname:t.summary_text,displaymodule:"Leads"})})},LeadConvert.prototype.gotoLead=function(){this.router.navigate(["/module/Leads/"+this.model.id])},LeadConvert.prototype.getStepClass=function(t){var e=this.convertSteps.indexOf(t);return e==this.currentConvertStep?"slds-is-active":e<this.currentConvertStep?"slds-is-completed":void 0},LeadConvert.prototype.getStepComplete=function(t){return this.convertSteps.indexOf(t)<this.currentConvertStep},LeadConvert.prototype.getProgressBarWidth=function(){return{width:this.currentConvertStep/(this.convertSteps.length-1)*100+"%"}},LeadConvert.prototype.nextStep=function(){switch(this.currentConvertStep){case 0:this.createAccount&&this.account.validate()?this.currentConvertStep++:this.createAccount||this.currentConvertStep++,this.createAccount?(this.contact.data.account_id=this.account.id,this.contact.data.account_name=this.account.data.name,this.opportunity.data.account_id=this.account.id,this.opportunity.data.account_name=this.account.data.name):this.selectedaccount&&(this.contact.data.account_id=this.selectedaccount.id,this.contact.data.account_name=this.selectedaccount.name,this.opportunity.data.account_id=this.selectedaccount.id,this.opportunity.data.account_name=this.selectedaccount.name);break;case 1:this.contact.validate()&&this.currentConvertStep++;break;case 2:this.createOpportunity&&this.opportunity.validate()?this.convert():this.createOpportunity||this.convert()}},LeadConvert.prototype.prevStep=function(){0<this.currentConvertStep&&this.currentConvertStep--},LeadConvert.prototype.showNext=function(){return this.currentConvertStep<this.convertSteps.length-1},LeadConvert.prototype.showSave=function(){return this.currentConvertStep==this.convertSteps.length-1},LeadConvert.prototype.convert=function(){var t=this;this.createSaveActions=[],this.createAccount&&this.createSaveActions.push({action:"createAccount",label:"LBL_LEADCONVERT_CREATEACCOUNT",status:"initial"}),this.createSaveActions.push({action:"createContact",label:"LBL_LEADCONVERT_CREATECONTACT",status:"initial"}),this.createOpportunity&&this.createSaveActions.push({action:"createOpportunity",label:"LBL_LEADCONVERT_CREATEOPPORTUNITY",status:"initial"}),this.createSaveActions.push({action:"convertLead",label:"LBL_LEADCONVERT_CONVERTLEAD",status:"initial"}),this.showSaveModal=!0,this.processConvert().subscribe(function(){t.showSaveModal=!1,t.toast.sendToast(t.language.getLabel("LBL_LEAD")+" "+t.model.data.summary_text+" "+t.language.getLabel("LBL_CONVERTED"),"success","",30),t.gotoLead()})},LeadConvert.prototype.processConvert=function(){return this.convertSubject=new rxjs_1.Subject,this.processConvertActions(),this.convertSubject.asObservable()},LeadConvert.prototype.processConvertActions=function(){var e="";this.createSaveActions.some(function(t){if("initial"===t.status)return e=t.action,!0}),e?this.processConvertAction(e):(this.convertSubject.next(!0),this.convertSubject.complete())},LeadConvert.prototype.processConvertAction=function(e){var s=this;switch(e){case"createAccount":this.account.save().subscribe(function(t){s.completeConvertAction(e)});break;case"createContact":this.createAccount?this.contact.data.account_id=this.account.id:this.selectedaccount&&(this.contact.data.account_id=this.selectedaccount.id),this.contact.save().subscribe(function(t){s.completeConvertAction(e)});break;case"createOpportunity":this.createAccount?this.opportunity.data.account_id=this.account.id:this.selectedaccount&&(this.opportunity.data.account_id=this.selectedaccount.id),this.opportunity.save().subscribe(function(t){s.completeConvertAction(e)});break;case"convertLead":this.createAccount?this.model.data.account_id=this.account.id:this.selectedaccount&&(this.model.data.account_id=this.selectedaccount.id),this.createOpportunity&&(this.model.data.opportunity_id=this.opportunity.id),this.model.data.contact_id=this.contact.id,this.model.data.status="Converted",this.model.save().subscribe(function(t){s.completeConvertAction(e)})}},LeadConvert.prototype.completeConvertAction=function(e){this.createSaveActions.some(function(t){if(t.action===e)return t.status="completed",!0}),this.processConvertActions()},LeadConvert.prototype.setContact=function(t){this.contact=t},LeadConvert.prototype.setAccount=function(t){this.account=t},LeadConvert.prototype.setSelectedAccount=function(t){this.selectedaccount=t},LeadConvert.prototype.setCreateAccount=function(t){this.createAccount=t},LeadConvert.prototype.setOpportunity=function(t){this.opportunity=t},LeadConvert.prototype.setCreateOpportunity=function(t){this.createOpportunity=t},LeadConvert=__decorate([core_1.Component({selector:"lead-convert",template:'<div class="slds-page-header"><div class="slds-grid"><div class="slds-col slds-has-flexi-truncate"><div class="slds-media slds-no-space slds-grow"><system-icon [module]="\'Leads\'"></system-icon><div class="slds-media__body"><nav role="navigation" aria-label="Breadcrumbs"><ol class="slds-breadcrumb slds-list--horizontal"><li class="slds-breadcrumb__item slds-text-title--caps"><a href="javascript:void(0);" (click)="gotoLead()"><system-label-modulename [module]="model.module" [singular]="true"></system-label-modulename></a></li><li class="slds-breadcrumb__item slds-text-title--caps"><a href="javascript:void(0);"><system-label label="LBL_CONVERT_LEAD"></system-label></a></li></ol></nav><div><h1 class="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate">{{model.data.summary_text}}</h1></div></div></div></div></div><div><object-page-header-detail-row *ngFor="let headerFieldSet of headerFieldSets" [fieldSet]="headerFieldSet"></object-page-header-detail-row></div></div><div class="slds-grid slds-grid--align-spread slds-p-around--small slds-theme--shade slds-border--bottom"><button class="slds-button slds-button--neutral" (click)="prevStep()"><system-label label="LBL_PREVIOUS"></system-label></button><div class="slds-progress slds-progress--shade"><ol class="slds-progress__list"><li *ngFor="let convertStep of convertSteps" class="slds-progress__item" [ngClass]="getStepClass(convertStep)"><button class="slds-button slds-progress__marker" [ngClass]="{\'slds-button--icon slds-progress__marker--icon\': getStepComplete(convertStep)}"><span class="slds-assistive-text">{{convertStep}}</span><system-button-icon *ngIf="getStepComplete(convertStep)" [icon]="\'success\'"></system-button-icon></button></li></ol><div class="slds-progress-bar slds-progress-bar_x-small"><span class="slds-progress-bar__value" [ngStyle]="getProgressBarWidth()"></span></div></div><button *ngIf="showNext()" class="slds-button slds-button--neutral" (click)="nextStep()"><system-label label="LBL_NEXT"></system-label></button> <button *ngIf="showSave()" class="slds-button slds-button--brand" (click)="nextStep()"><system-label label="LBL_SAVE"></system-label></button></div><div class="slds-scrollable--y" system-to-bottom><lead-convert-account [lead]="model" [hidden]="currentConvertStep!==0" (account)="setAccount($event)" (selectedaccount)="setSelectedAccount($event)" (createaccount)="setCreateAccount($event)"></lead-convert-account><lead-convert-contact [lead]="model" [hidden]="currentConvertStep!==1" (contact)="setContact($event)"></lead-convert-contact><lead-convert-opportunity [lead]="model" [hidden]="currentConvertStep!==2" (opportunity)="setOpportunity($event)" (createopportunity)="setCreateOpportunity($event)"></lead-convert-opportunity></div><lead-convert-modal *ngIf="showSaveModal" [saveactions]="createSaveActions" (closemodal)="showSaveModal=false"></lead-convert-modal>',providers:[services_1.model,services_1.view],styles:[":host >>> global-button-icon svg {fill:#CA1B1F}",":host >>> .slds-progress__marker:hover global-button-icon svg {fill:#FD595D}",":host >>> .slds-progress__marker:active global-button-icon svg {fill:#FD595D}",":host >>> .slds-progress__marker:focus global-button-icon svg {fill:#FD595D}"]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,router_1.Router,router_1.ActivatedRoute,services_1.navigationtab,services_1.toast])],LeadConvert)}();exports.LeadConvert=LeadConvert;var LeadConvertContact=function(){function LeadConvertContact(t,e,s){this.view=t,this.metadata=e,this.model=s,this.lead=void 0,this.contact=new core_1.EventEmitter,this.initialized=!1,this.componentSet="",this.componentconfig={},this.componentRefs=[],this.model.module="Contacts",this.model.initializeModel(),this.view.isEditable=!0,this.view.setEditMode()}return LeadConvertContact.prototype.ngOnInit=function(){var o=this;console.log(this.model.data),this.lead.data$.subscribe(function(t){if(o.model.data.degree1=t.degree1,o.model.data.degree2=t.degree2,o.model.data.first_name=t.first_name,o.model.data.last_name=t.last_name,o.model.data.salutation=t.salutation,o.model.data.title_dd=t.title_dd,o.model.data.title=t.title,o.model.data.department=t.department,o.model.data.email1=t.email1,t.emailaddresses)for(var e=0,s=o.model.data.emailaddresses;e<s.length;e++){s[e].email_address=t.email1}o.model.data.phone_work=t.phone_work,o.model.data.phone_mobile=t.phone_mobile,o.model.data.phone_fax=t.phone_fax,t.business_sector&&(o.model.data.business_sector=t.business_sector),t.business_topic&&(o.model.data.business_topic=t.business_topic),o.model.data.primary_address_street=t.primary_address_street,o.model.data.primary_address_city=t.primary_address_city,o.model.data.primary_address_postalcode=t.primary_address_postalcode,o.model.data.primary_address_state=t.primary_address_state,o.model.data.primary_address_country=t.primary_address_country,o.model.data.primary_address_attn=t.primary_address_attn}),this.contact.emit(this.model)},LeadConvertContact.prototype.ngAfterViewInit=function(){this.initialized=!0,this.buildContainer()},LeadConvertContact.prototype.buildContainer=function(){for(var s=this,t=0,e=this.componentRefs;t<e.length;t++){e[t].destroy()}for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),a=function(e){i.metadata.addComponent(e.component,i.detailcontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig,s.componentRefs.push(t)})},i=this,n=0,c=this.metadata.getComponentSetObjects(o.componentset);n<c.length;n++){a(c[n])}},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertContact.prototype,"detailcontainer",void 0),__decorate([core_1.Input(),__metadata("design:type",services_1.model)],LeadConvertContact.prototype,"lead",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertContact.prototype,"contact",void 0),LeadConvertContact=__decorate([core_1.Component({selector:"lead-convert-contact",template:"<div><div #detailcontainer></div></div>",providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model])],LeadConvertContact)}();exports.LeadConvertContact=LeadConvertContact;var LeadConvertAccount=function(){function LeadConvertAccount(t,e,s,o,a,i){this.view=t,this.metadata=e,this.model=s,this.modelutilities=o,this.fts=a,this.language=i,this.lead={},this.account=new core_1.EventEmitter,this.createaccount=new core_1.EventEmitter,this.selectedaccount=new core_1.EventEmitter,this.initialized=!1,this.componentSet="",this.componentconfig={},this.componentRefs=[],this.createAccount=!1,this.selectedAccount=void 0,this.matchedAccounts=[],this.model.module="Accounts",this.model.initializeModel(),this.view.isEditable=!0,this.view.setEditMode()}return Object.defineProperty(LeadConvertAccount.prototype,"create",{get:function(){return this.createAccount},set:function(t){this.createAccount=t,this.createaccount.emit(t)},enumerable:!0,configurable:!0}),LeadConvertAccount.prototype.ngOnInit=function(){var e=this;this.lead.data$.subscribe(function(t){""!==t.account_name&&(e.fts.searchByModules({searchterm:e.modelutilities.cleanAccountName(t.account_name),modules:["Accounts"]}).subscribe(function(t){e.matchedAccounts=t.Accounts.hits,0===e.matchedAccounts.length&&(e.create=!0)}),e.model.data.name=t.account_name,e.model.data.website=t.website,e.model.data.billing_address_street=t.primary_address_street,e.model.data.billing_address_city=t.primary_address_city,e.model.data.billing_address_postalcode=t.primary_address_postalcode,e.model.data.billing_address_state=t.primary_address_state,e.model.data.billing_address_country=t.primary_address_country)}),this.account.emit(this.model)},LeadConvertAccount.prototype.ngAfterViewInit=function(){this.initialized=!0,this.buildContainer()},LeadConvertAccount.prototype.buildContainer=function(){for(var s=this,t=0,e=this.componentRefs;t<e.length;t++){e[t].destroy()}for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),a=function(e){i.metadata.addComponent(e.component,i.detailcontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig,s.componentRefs.push(t)})},i=this,n=0,c=this.metadata.getComponentSetObjects(o.componentset);n<c.length;n++){a(c[n])}},LeadConvertAccount.prototype.selectAccount=function(t){this.selectedAccount=t,this.selectedaccount.emit(t)},LeadConvertAccount.prototype.unlinkAccount=function(){this.selectedAccount=void 0,this.selectedaccount.emit(void 0)},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertAccount.prototype,"detailcontainer",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],LeadConvertAccount.prototype,"lead",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertAccount.prototype,"account",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertAccount.prototype,"createaccount",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertAccount.prototype,"selectedaccount",void 0),LeadConvertAccount=__decorate([core_1.Component({selector:"lead-convert-account",template:'<div><div class="slds-theme--shade slds-p-around--small slds-border--bottom slds-grid slds-grid--vertical-align-center slds-grid--align-spread"><div class="slds-form--inline"><div class="slds-form-element__control"><span class="slds-checkbox"><input type="checkbox" name="options" id="createaccount" [(ngModel)]="create"> <label class="slds-checkbox__label" for="createaccount"><span class="slds-checkbox--faux"></span> <span class="slds-form-element__label"><system-label label="LBL_LEADCONVERT_CREATEACCOUNT"></system-label></span></label></span></div></div><div *ngIf="selectedAccount && !createAccount" class="slds-grid slds-grid--vertical-align-center"><div class="slds-m-right--x-small">Selected Account:</div><div class="slds-pill"><span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container"><system-icon [module]="model.module"></system-icon></span><a href="javascript:void(0);" class="slds-pill__label">{{selectedAccount.name}}, {{selectedAccount.billing_address_city}}</a> <button class="slds-button slds-button--icon slds-pill__remove" title="Remove"><system-button-icon [icon]="\'clear\'" (click)="unlinkAccount()"></system-button-icon></button></div></div></div><div [hidden]="createAccount"><lead-convert-account-list [matchedaccounts]="matchedAccounts" (selectaccount)="selectAccount($event)"></lead-convert-account-list></div><div [hidden]="!createAccount"><div #detailcontainer></div></div></div>',providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model,services_1.modelutilities,services_1.fts,services_1.language])],LeadConvertAccount)}();exports.LeadConvertAccount=LeadConvertAccount;var LeadConvertAccountList=function(){function t(t,e,s,o){this.metadata=t,this.model=e,this.fts=s,this.language=o,this.matchedaccounts=[],this.selectaccount=new core_1.EventEmitter,this.listfields=[];for(var a=this.metadata.getComponentConfig("LeadConvertAccountList",this.model.module),i=0,n=this.metadata.getFieldSetFields(a.fieldset);i<n.length;i++){var c=n[i];!1!==c.fieldconfig.default&&this.listfields.push(c)}}return t.prototype.selectitem=function(t){this.selectaccount.emit(t)},__decorate([core_1.Input(),__metadata("design:type",Array)],t.prototype,"matchedaccounts",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],t.prototype,"selectaccount",void 0),t=__decorate([core_1.Component({selector:"lead-convert-account-list",template:'<div><table class="slds-table slds-table--bordered slds-table--cell-buffer"><thead><tr class="slds-text-title--caps"><th *ngFor="let item of listfields" scope="col"><div class="slds-truncate"><system-label-fieldname [module]="model.module" [field]="item.field"></system-label-fieldname></div></th><th class="slds-cell-shrink" scope="col"></th></tr></thead><tbody><tr lead-convert-account-list-item *ngFor="let matchedaccount of matchedaccounts" [listfields]="listfields" [matchedaccount]="matchedaccount" (selectitem)="selectitem($event)"></tr></tbody></table></div>'}),__metadata("design:paramtypes",[services_1.metadata,services_1.model,services_1.fts,services_1.language])],t)}();exports.LeadConvertAccountList=LeadConvertAccountList;var LeadConvertAccountListItem=function(){function t(t,e,s,o){this.metadata=t,this.model=e,this.view=s,this.language=o,this.matchedaccount={},this.listfields=[],this.selectitem=new core_1.EventEmitter,this.view.isEditable=!1}return t.prototype.ngOnInit=function(){this.model.module=this.matchedaccount._type,this.model.id=this.matchedaccount._id,this.model.data=this.matchedaccount._source},t.prototype.selectAccount=function(){this.selectitem.emit({id:this.matchedaccount._id,name:this.matchedaccount._source.name,billing_address_city:this.matchedaccount._source.billing_address_city})},__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"matchedaccount",void 0),__decorate([core_1.Input(),__metadata("design:type",Array)],t.prototype,"listfields",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],t.prototype,"selectitem",void 0),t=__decorate([core_1.Component({selector:"[lead-convert-account-list-item]",template:'<td *ngFor="let listfield of listfields" scope="col"><div class="slds-truncate"><field-container [field]="listfield.field" [fieldconfig]="listfield.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></td><td class="slds-cell-shrink" scope="col"><button class="slds-button slds-button--neutral" (click)="selectAccount()"><system-label label="LBL_SELECT"></system-label></button></td>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.metadata,services_1.model,services_1.view,services_1.language])],t)}();exports.LeadConvertAccountListItem=LeadConvertAccountListItem;var LeadConvertOpportunity=function(){function LeadConvertOpportunity(t,e,s,o){this.view=t,this.metadata=e,this.model=s,this.language=o,this.lead=void 0,this.opportunity=new core_1.EventEmitter,this.createopportunity=new core_1.EventEmitter,this.initialized=!1,this.componentSet="",this.componentconfig={},this.componentRefs=[],this.createOpportunity=!1,this.model.module="Opportunities",this.model.initializeModel(),this.view.isEditable=!0,this.view.setEditMode()}return Object.defineProperty(LeadConvertOpportunity.prototype,"create",{get:function(){return this.createOpportunity},set:function(t){this.createOpportunity=t,this.createopportunity.emit(t)},enumerable:!0,configurable:!0}),LeadConvertOpportunity.prototype.ngOnInit=function(){var e=this;this.lead.data$.subscribe(function(t){e.model.data.amount=t.opportunity_amount,e.model.data.campaign_name=t.campaign_name,e.model.data.campaign_id=t.campaign_id}),this.opportunity.emit(this.model)},LeadConvertOpportunity.prototype.ngAfterViewInit=function(){this.initialized=!0,this.buildContainer()},LeadConvertOpportunity.prototype.buildContainer=function(){for(var s=this,t=0,e=this.componentRefs;t<e.length;t++){e[t].destroy()}for(var o=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module),a=function(e){i.metadata.addComponent(e.component,i.detailcontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig,s.componentRefs.push(t)})},i=this,n=0,c=this.metadata.getComponentSetObjects(o.componentset);n<c.length;n++){a(c[n])}},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertOpportunity.prototype,"detailcontainer",void 0),__decorate([core_1.Input(),__metadata("design:type",services_1.model)],LeadConvertOpportunity.prototype,"lead",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertOpportunity.prototype,"opportunity",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertOpportunity.prototype,"createopportunity",void 0),LeadConvertOpportunity=__decorate([core_1.Component({selector:"lead-convert-opportunity",template:'<div><div class="slds-theme--shade slds-p-around--small slds-border--bottom"><div class="slds-form--inline"><div class="slds-form-element__control"><span class="slds-checkbox"><input type="checkbox" name="options" id="createopportunity" [(ngModel)]="create"> <label class="slds-checkbox__label" for="createopportunity"><span class="slds-checkbox--faux"></span> <span class="slds-form-element__label"><system-label label="LBL_LEADCONVERT_CREATEOPPORTUNITY"></system-label></span></label></span></div></div></div><div [hidden]="!createOpportunity"><div #detailcontainer></div></div></div>',providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[services_1.view,services_1.metadata,services_1.model,services_1.language])],LeadConvertOpportunity)}();exports.LeadConvertOpportunity=LeadConvertOpportunity;var LeadOpenLeadsDashlet=function(){function LeadOpenLeadsDashlet(t,e,s,o,a){this.language=t,this.metadata=e,this.backend=s,this.model=o,this.elementRef=a,this.myLeads=[],this.myLeadsCount=0}return LeadOpenLeadsDashlet.prototype.ngOnInit=function(){var e=this,t={searchmyitems:!0,fields:JSON.stringify(["id","first_name","last_name","account_name","status","phone_mobile"])};this.backend.getRequest("module/Leads",t).subscribe(function(t){e.myLeads=t.list,e.myLeadsCount=t.totalcount})},Object.defineProperty(LeadOpenLeadsDashlet.prototype,"containerstyle",{get:function(){if(this.dashletcontainer){var t=this.dashletcontainer.element.nativeElement.getBoundingClientRect(),e=this.tableheader.element.nativeElement.getBoundingClientRect();return{height:t.bottom-e.bottom+"px","margin-top":"-1px"}}},enumerable:!0,configurable:!0}),__decorate([core_1.ViewChild("tableheader",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadOpenLeadsDashlet.prototype,"tableheader",void 0),__decorate([core_1.ViewChild("dashletcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadOpenLeadsDashlet.prototype,"dashletcontainer",void 0),LeadOpenLeadsDashlet=__decorate([core_1.Component({selector:"lead-openleads-dashlet",template:'<div #dashletcontainer style="height: 100%; overflow: hidden;"><h2 class="slds-text-heading--small slds-p-bottom--xx-small">My Open Leads ({{myLeadsCount}})</h2><table #tableheader class="slds-table slds-table_cell-buffer"><thead><tr class="slds-text-title_caps"><th scope="col" width="30%"><div class="slds-truncate" title="Opportunity Name">Name</div></th><th scope="col" width="20%"><div class="slds-truncate" title="Account Name">Status</div></th><th scope="col" width="30%"><div class="slds-truncate" title="Close Date">Account</div></th><th scope="col" width="20%"><div class="slds-truncate" title="Stage">Mobile</div></th></tr></thead></table><div class="slds-scrollable--y" [ngStyle]="containerstyle"><table class="slds-table slds-table_bordered slds-table_cell-buffer"><tbody><tr *ngFor="let myLead of myLeads"><td width="30%"><div class="slds-truncate">{{myLead.summary_text}}</div></td><td width="20%"><div class="slds-truncate">{{myLead.status}}</div></td><td width="30%"><div class="slds-truncate">{{myLead.account_name}}</div></td><td width="20%"><div class="slds-truncate">{{myLead.phone_mobile}}</div></td></tr></tbody></table></div></div>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.backend,services_1.model,core_1.ElementRef])],LeadOpenLeadsDashlet)}();exports.LeadOpenLeadsDashlet=LeadOpenLeadsDashlet;var LeadConvertOpportunityModal=function(){function LeadConvertOpportunityModal(t,e,s,o,a){this.language=t,this.model=e,this.metadata=s,this.view=o,this.modal=a,this.self={},this.converted=new core_1.EventEmitter,this.model.module="Opportunities",this.view.isEditable=!0,this.view.setEditMode()}return LeadConvertOpportunityModal.prototype.ngOnInit=function(){this.model.initialize(this.lead)},LeadConvertOpportunityModal.prototype.ngAfterViewInit=function(){for(var t=this.metadata.getComponentConfig("ObjectRecordDetails",this.model.module).componentset,e=function(e){s.metadata.addComponent(e.component,s.detailcontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig})},s=this,o=0,a=this.metadata.getComponentSetObjects(t);o<a.length;o++){e(a[o])}},LeadConvertOpportunityModal.prototype.close=function(){this.self.destroy()},LeadConvertOpportunityModal.prototype.convert=function(){var s=this;this.model.validate()&&this.modal.openModal("SystemLoadingModal").subscribe(function(e){e.instance.messagelabel="creating Opportunity",s.model.save().subscribe(function(t){e.instance.messagelabel="updating Lead",s.lead.setField("status","Converted"),s.lead.setField("opportunity_id",s.model.id),s.lead.setField("opportunity_name",s.model.getFieldValue("name")),s.lead.save().subscribe(function(t){e.instance.self.destroy(),s.close()})})})},LeadConvertOpportunityModal.prototype.onModalEscX=function(){this.close()},__decorate([core_1.ViewChild("detailcontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],LeadConvertOpportunityModal.prototype,"detailcontainer",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],LeadConvertOpportunityModal.prototype,"converted",void 0),LeadConvertOpportunityModal=__decorate([core_1.Component({selector:"lead-convert-opportunity-modal",template:'<system-modal size="large"><system-modal-header (close)="close()"><system-label label="LBL_CONVERT_TO_OPPORTUNITY"></system-label></system-modal-header><system-modal-content><div #detailcontainer></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CLOSE"></system-label></button> <button class="slds-button slds-button--brand" (click)="convert()"><system-label label="LBL_CONVERT_LEAD"></system-label></button></system-modal-footer></system-modal>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.metadata,services_1.view,services_1.modal])],LeadConvertOpportunityModal)}();exports.LeadConvertOpportunityModal=LeadConvertOpportunityModal;var fieldLeadClassification=function(n){function fieldLeadClassification(t,e,s,o,a){var i=n.call(this,t,e,s,o,a)||this;return i.model=t,i.view=e,i.language=s,i.metadata=o,i.router=a,i}return __extends(fieldLeadClassification,n),Object.defineProperty(fieldLeadClassification.prototype,"trend",{get:function(){switch(this.model.getField("classification")){case"hot":return"up";case"cold":return"down";default:return"neutral"}},enumerable:!0,configurable:!0}),fieldLeadClassification=__decorate([core_1.Component({template:'<system-trend-indicator [trend]="trend"></system-trend-indicator>'}),__metadata("design:paramtypes",[services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router])],fieldLeadClassification)}(objectfields_1.fieldGeneric);exports.fieldLeadClassification=fieldLeadClassification;var ModuleLeads=function(){function ModuleLeads(t){this.vms=t,this.version="1.0",this.build_date="2020-04-20",this.vms.registerModule(this)}return ModuleLeads=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents],declarations:[LeadConvertButton,LeadConvertModal,LeadConvert,LeadConvertContact,LeadConvertAccount,LeadConvertAccountList,LeadConvertAccountListItem,LeadConvertOpportunity,LeadOpenLeadsDashlet,LeadConvertOpportunityModal,fieldLeadClassification]}),__metadata("design:paramtypes",[services_1.VersionManagerService])],ModuleLeads)}();exports.ModuleLeads=ModuleLeads;