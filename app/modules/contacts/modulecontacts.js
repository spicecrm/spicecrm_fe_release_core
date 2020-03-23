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
"use strict";var __decorate=this&&this.__decorate||function(e,s,t,l){var a,i=arguments.length,n=i<3?s:null===l?l=Object.getOwnPropertyDescriptor(s,t):l;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,s,t,l);else for(var o=e.length-1;0<=o;o--)(a=e[o])&&(n=(i<3?a(n):3<i?a(s,t,n):a(s,t))||n);return 3<i&&n&&Object.defineProperty(s,t,n),n},__metadata=this&&this.__metadata||function(e,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,s)};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),ContactNewslettersButton=function(){function ContactNewslettersButton(e,s,t,l){this.language=e,this.model=s,this.modal=t,this.ViewContainerRef=l,this.disabled=!0}return ContactNewslettersButton.prototype.ngOnInit=function(){var s=this;this.handleDisabled(),this.model.mode$.subscribe(function(e){s.handleDisabled()}),this.model.data$.subscribe(function(e){s.handleDisabled()})},ContactNewslettersButton.prototype.execute=function(){this.modal.openModal("ContactNewsletters",!0,this.ViewContainerRef.injector)},ContactNewslettersButton.prototype.handleDisabled=function(){this.disabled=!(this.model.data.email1&&!this.model.isEditing&&(!this.model.data.acl||this.model.data.acl.edit))},ContactNewslettersButton=__decorate([core_1.Component({selector:"contact-newsletters-button",template:"<span>{{language.getLabel('LBL_MANAGE_SUBSCRIPTIONS')}}</span>"}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.modal,core_1.ViewContainerRef])],ContactNewslettersButton)}();exports.ContactNewslettersButton=ContactNewslettersButton;var ContactNewsletters=function(){function ContactNewsletters(e,s,t,l){var c=this;this.language=e,this.backend=s,this.metadata=t,this.model=l,this.rawResult={},this.availableNewsLetters=[],this.subscribedNewsLetters=[],this.selectedAvailable=[],this.selectedSubscribed=[],this.multiselect=!1,this.self={},this.backend.getRequest("newsletters/subscriptions/"+this.model.id).subscribe(function(e){for(var s={},t=0,l=(c.rawResult=e).news_type_list_arr;t<l.length;t++){var a=l[t];switch(a.list_type){case"default":s[a.campaign_id]||(s[a.campaign_id]={name:a.name},s[a.campaign_id].defaultList=a.prospect_list_id);break;case"exempt":s[a.campaign_id]||(s[a.campaign_id]={name:a.name}),s[a.campaign_id].exemptList=a.prospect_list_id}}for(var i=0,n=e.current_plp_arr;i<n.length;i++){var o=n[i];for(var r in s)s[r].defaultList==o.prospect_list_id?(c.subscribedNewsLetters.push({id:r,summary_text:s[r].name,defaultList:s[r].defaultList,exemptList:s[r].exemptList}),delete s[r]):s[r].defaultList==o.prospect_list_id&&(c.availableNewsLetters.push({id:r,summary_text:s[r].name,defaultList:s[r].defaultList,exemptList:s[r].exemptList}),delete s[r])}for(var r in s)c.availableNewsLetters.push({id:r,summary_text:s[r].name,defaultList:s[r].defaultList,exemptList:s[r].exemptList}),delete s[r]})}return ContactNewsletters.prototype.closePopup=function(){this.self.destroy()},ContactNewsletters.prototype.keypressed=function(e){"keydown"===e.type&&"Control"===e.key&&!1===this.multiselect&&(this.multiselect=!0),"keyup"===e.type&&"Control"===e.key&&!0===this.multiselect&&(this.multiselect=!1)},ContactNewsletters.prototype.isSelected=function(e,s){switch(e){case"available":return 0<=this.selectedAvailable.indexOf(s);case"subscribed":return 0<=this.selectedSubscribed.indexOf(s)}},ContactNewsletters.prototype.selectNewsletter=function(e,s){switch(e){case"available":!1===this.multiselect?this.selectedAvailable=[s]:0<=this.selectedAvailable.indexOf(s)?this.selectedAvailable.splice(this.selectedAvailable.indexOf(s),1):this.selectedAvailable.push(s);break;case"subscribed":!1===this.multiselect?this.selectedSubscribed=[s]:0<=this.selectedSubscribed.indexOf(s)?this.selectedSubscribed.splice(this.selectedSubscribed.indexOf(s),1):this.selectedSubscribed.push(s)}},ContactNewsletters.prototype.subscribe=function(){var l=this;this.selectedAvailable.forEach(function(t){l.availableNewsLetters.some(function(e,s){if(t==e.id)return l.subscribedNewsLetters.push(l.availableNewsLetters.splice(s,1)[0]),!0})}),this.selectedAvailable=[]},ContactNewsletters.prototype.unsubscribe=function(){var l=this;this.selectedSubscribed.forEach(function(t){l.subscribedNewsLetters.some(function(e,s){if(t==e.id)return l.availableNewsLetters.push(l.subscribedNewsLetters.splice(s,1)[0]),!0})}),this.selectedSubscribed=[]},ContactNewsletters.prototype.save=function(){var s=this,e={subscribed:this.subscribedNewsLetters,unsubscribed:this.availableNewsLetters};this.backend.postRequest("newsletters/subscriptions/"+this.model.id,{},e).subscribe(function(e){s.closePopup()})},ContactNewsletters=__decorate([core_1.Component({selector:"contact-newsletters",template:'<system-modal><system-modal-header (close)="closePopup()"><h2 class="slds-text-heading--medium">Newsletter Subscriptions for {{model.data.name}}</h2></system-modal-header><system-modal-content><div class="slds-picklist--draggable slds-grid slds-grid--align-center"><div class="slds-grid slds-grid--align-center"><div class="slds-form-element"><span class="slds-form-element__label" aria-label="select-1">Available Newsletters</span><div class="slds-picklist"><ul class="slds-picklist__options slds-picklist__options--multi"><li *ngFor="let newsletter of availableNewsLetters" draggable="false" class="slds-picklist__item" [attr.aria-selected]="isSelected(\'available\', newsletter.id)" role="option" (click)="selectNewsletter(\'available\', newsletter.id)"><span class="slds-truncate">{{newsletter.summary_text}}</span></li></ul></div></div><div class="slds-grid slds-grid--vertical"><button class="slds-button slds-button--icon-container" [disabled]="selectedSubscribed.length === 0" (click)="unsubscribe()"><system-button-icon [icon]="\'left\'"></system-button-icon></button> <button class="slds-button slds-button--icon-container" [disabled]="selectedAvailable.length === 0" (click)="subscribe()"><system-button-icon [icon]="\'right\'"></system-button-icon></button></div></div><div class="slds-grid slds-grid--align-center"><div class="slds-form-element"><span class="slds-form-element__label" aria-label="select-1">Subscribed Newsletters</span><div class="slds-picklist"><ul class="slds-picklist__options slds-picklist__options--multi"><li *ngFor="let newsletter of subscribedNewsLetters" draggable="false" class="slds-picklist__item" [attr.aria-selected]="isSelected(\'subscribed\', newsletter.id)" role="option" (click)="selectNewsletter(\'subscribed\', newsletter.id)"><span class="slds-truncate">{{newsletter.summary_text}}</span></li></ul></div></div></div></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="closePopup()">{{language.getLabel(\'LBL_CANCEL\')}}</button> <button class="slds-button slds-button--brand" (click)="save()">{{language.getLabel(\'LBL_SAVE\')}}</button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.language,services_1.backend,services_1.metadata,services_1.model])],ContactNewsletters)}();exports.ContactNewsletters=ContactNewsletters;var ContactPortalButton=function(){function ContactPortalButton(e,s,t,l,a){this.language=e,this.model=s,this.metadata=t,this.modal=l,this.viewContainerRef=a,this.disabled=!0}return ContactPortalButton.prototype.ngOnInit=function(){var s=this;this.handleDisabled(),this.model.mode$.subscribe(function(e){s.handleDisabled()}),this.model.data$.subscribe(function(e){s.handleDisabled()})},ContactPortalButton.prototype.handleDisabled=function(){this.disabled=!((this.model.data.email1||this.model.data.email_address_private)&&!this.model.isEditing&&this.model.checkAccess("edit"))},ContactPortalButton.prototype.execute=function(){this.modal.openModal("ContactPortalDetails",!0,this.viewContainerRef.injector)},ContactPortalButton=__decorate([core_1.Component({selector:"contact-portal-button",template:"<span>{{language.getLabel('LBL_PORTAL_INFORMATION')}}</span>"}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.metadata,services_1.modal,core_1.ViewContainerRef])],ContactPortalButton)}();exports.ContactPortalButton=ContactPortalButton;var ContactPortalDetails=function(){function ContactPortalDetails(e,s,t,l,a){this.lang=e,this.backend=s,this.metadata=t,this.model=l,this.toast=a,this.loaded=!1,this.user={active:!1,id:"",aclRole:"",portalRole:"",password:"",name:"",setDateTimePrefsWithSystemDefaults:!0},this.pwdGuideline="",this.pwdCheckRegex=new RegExp("//"),this.aclRoles=[],this.portalRoles=[],this.self=void 0,this.usernameAlreadyExists=!1,this.usernameTesting=!1,this.isSaving=!1}return ContactPortalDetails.prototype.ngOnInit=function(){var s=this;this.backend.getRequest("portal/"+this.model.id+"/portalaccess",{lang:this.lang.currentlanguage}).subscribe(function(e){s.aclRoles=e.aclRoles,s.portalRoles=e.portalRoles,e.user&&e.user.id&&(s.user.active=e.user.status,s.user.id=e.user.id,s.user.aclRole=e.user.aclRole,s.user.portalRole=e.user.portalRole,s.user.setDateTimePrefsWithSystemDefaults=!1),s.user.id||(s.aclRoles.some(function(e){if("Portal"===e.name)return s.user.aclRole=e.id,!0}),s.portalRoles.some(function(e){if("Portal"===e.name)return s.user.portalRole=e.id,!0})),s.pwdGuideline=e.pwdCheck.guideline,s.pwdCheckRegex=new RegExp(e.pwdCheck.regex),s.user.id?(s.user.name=e.user.username,s.loaded=!0):(s.user.name=s.model.data.email1?s.model.data.email1:s.model.data.email_address_private,s.testUsername())})},ContactPortalDetails.prototype.testUsername=function(){var s=this;this.user.name&&(this.usernameTesting=!0,this.backend.getRequest("portal/"+this.model.id+"/testUsername",{username:this.user.name}).subscribe(function(e){e.error||(s.usernameAlreadyExists=e.exists,s.loaded=!0,s.usernameTesting=!1)}))},Object.defineProperty(ContactPortalDetails.prototype,"pwdError",{get:function(){return!!this.loaded&&(!(!this.user.password||this.pwdCheckRegex.test(this.user.password))&&this.lang.getLabel("MSG_PWD_NOT_LEGAL"))},enumerable:!0,configurable:!0}),ContactPortalDetails.prototype.closeModal=function(){this.self.destroy()},Object.defineProperty(ContactPortalDetails.prototype,"isNewUser",{get:function(){return this.loaded&&""==this.user.id},enumerable:!0,configurable:!0}),Object.defineProperty(ContactPortalDetails.prototype,"canSave",{get:function(){if(this.isSaving)return!1;if(this.usernameTesting)return!1;if(!this.user.name||!this.user.portalRole||!this.user.aclRole)return!1;if(this.usernameAlreadyExists)return!1;if(this.isNewUser){if(!this.user.password||this.pwdError)return!1}else if(this.pwdError)return!1;return!0},enumerable:!0,configurable:!0}),ContactPortalDetails.prototype.save=function(){var s=this;if(this.canSave){this.isSaving=!0;var e={status:this.user.active,aclRole:this.user.aclRole,portalRole:this.user.portalRole,username:this.user.name,password:this.user.password,setDateTimePrefsWithSystemDefaults:this.user.setDateTimePrefsWithSystemDefaults};this.toast.clearToast(this.lastToast),this.backend.postRequest("portal/"+this.model.id+"/portalaccess/"+(this.isNewUser?"create":"update"),{},e).subscribe(function(e){e.success&&(s.lastToast=s.toast.sendToast("Portal user "+("new"===e.type?"created":"edited")+" successfully.","success")),s.closeModal()},function(e){s.lastToast=s.toast.sendToast("Error saving data of portal user.","error",e.error.error.message,!1),s.isSaving=!1})}},ContactPortalDetails=__decorate([core_1.Component({selector:"contact-portal-details",template:'<system-modal><system-modal-header (close)="closeModal()"><ng-container *ngIf="loaded"><ng-container *ngIf="isNewUser">{{lang.getLabel(\'LBL_CREATE_PORTAL_USER\')}}</ng-container><ng-container *ngIf="!isNewUser">{{lang.getLabel(\'LBL_EDIT_PORTAL_USER\')}}</ng-container><span class="slds-text-heading_small slds-p-top_x-small" style="display:block"><span class="slds-p-horizontal--x-small slds-theme--info slds-text-color--inverse" style="opacity:0.66">{{model.data.name}}</span></span></ng-container><ng-container *ngIf="!loaded">{{lang.getLabel(\'LBL_PORTAL_USER\')}}</ng-container></system-modal-header><system-modal-content><system-spinner *ngIf="!loaded"></system-spinner><div *ngIf="loaded" class="slds-form slds-form_horizontal"><div class="slds-form-element"><label class="slds-form-element__label">{{lang.getLabel(\'LBL_ACTIVE\')}}</label><div class="slds-form-element__control"><label class="slds-checkbox_toggle slds-grid"><input type="checkbox" name="active" [(ngModel)]="user.active"> <span class="slds-checkbox_faux_container" aria-live="assertive"><span class="slds-checkbox_faux"></span></span></label></div></div><div class="slds-form-element" [ngClass]="{\'slds-has-error\':usernameAlreadyExists}"><label class="slds-form-element__label"><abbr class="slds-required" title="required">*</abbr>{{lang.getLabel(\'LBL_USER_NAME\')}}</label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="user.name" (change)="testUsername()" [disabled]="usernameTesting"><div *ngIf="usernameAlreadyExists" class="slds-form-element__help">{{lang.getLabel(\'MSG_USERNAME_ALREADY_EXISTS\')}}</div></div></div><div class="slds-form-element" [ngClass]="{\'slds-has-error\':pwdError}"><label class="slds-form-element__label"><ng-container *ngIf="isNewUser"><abbr class="slds-required" title="required">*</abbr>{{lang.getLabel(\'LBL_PASSWORD\')}}</ng-container><ng-container *ngIf="!isNewUser">{{lang.getLabel(\'LBL_NEW_PWD\')}}?</ng-container></label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="user.password" [ngClass]="{\'slds-has-error\':pwdError}"><div *ngIf="pwdError" class="slds-form-element__help">{{pwdError}}</div><div *ngIf="pwdGuideline" class="slds-m-top--xx-small slds-form-element__help" style="color:inherit">{{lang.getLabel(\'LBL_PWD_GUIDELINE\')}}:<br>{{pwdGuideline}}</div></div></div><div class="slds-form-element"><label class="slds-form-element__label"><abbr class="slds-required" title="required">*</abbr>{{lang.getLabel(\'LBL_ACL_ROLE\')}}</label><div class="slds-form-element__control"><div class="slds-select_container"><select class="slds-select" [(ngModel)]="user.aclRole"><option *ngFor="let aclRole of aclRoles" [value]="aclRole.id" [selected]="user.aclRole === aclRole.id">{{aclRole.name}}</option></select></div></div></div><div class="slds-form-element"><label class="slds-form-element__label"><abbr class="slds-required" title="required">*</abbr>{{lang.getLabel(\'LBL_PORTAL_ROLE\')}}</label><div class="slds-form-element__control"><div class="slds-select_container"><select class="slds-select" [(ngModel)]="user.portalRole"><option *ngFor="let portalRole of portalRoles" [value]="portalRole.id" [selected]="user.portalRole === portalRole.id">{{portalRole.name}}</option></select></div></div></div><div class="slds-form-element"><label *ngIf="isNewUser" class="slds-form-element__label">{{lang.getLabel(\'LBL_SET_DATE_TIME_PREFS\')}}<system-icon-help-text [helpText]="lang.getLabel(\'HLP_SET_DATE_TIME_PREFS\')"></system-icon-help-text></label> <label *ngIf="!isNewUser" class="slds-form-element__label">{{lang.getLabel(\'LBL_RESET_DATE_TIME_PREFS\')}}<system-icon-help-text [helpText]="lang.getLabel(\'HLP_RESET_DATE_TIME_PREFS\')"></system-icon-help-text></label><div class="slds-form-element__control"><label class="slds-checkbox_toggle slds-grid"><input type="checkbox" name="active" [(ngModel)]="user.setDateTimePrefsWithSystemDefaults"> <span class="slds-checkbox_faux_container" aria-live="assertive"><span class="slds-checkbox_faux"></span></span></label></div></div></div></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="closeModal()">{{lang.getLabel(\'LBL_CANCEL\')}}</button> <button *ngIf="loaded" class="slds-button slds-button--brand" (click)="save()" [disabled]="!canSave">{{lang.getLabel(\'LBL_SAVE\')}}</button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.language,services_1.backend,services_1.metadata,services_1.model,services_1.toast])],ContactPortalDetails)}();exports.ContactPortalDetails=ContactPortalDetails;var ContactExchangeSyncButton=function(){function ContactExchangeSyncButton(e,s,t,l){this.language=e,this.model=s,this.modal=t,this.backend=l,this.isLoading=!1}return ContactExchangeSyncButton.prototype.execute=function(){var s=this;this.isLoading=!0,this.model.getField("sync_contact")?this.backend.deleteRequest("module/Contacts/"+this.model.id+"/exchangeSync").subscribe(function(e){s.model.setField("sync_contact",!s.model.getField("sync_contact")),s.isLoading=!1},function(e){s.isLoading=!1}):this.backend.putRequest("module/Contacts/"+this.model.id+"/exchangeSync").subscribe(function(e){s.model.setField("sync_contact",!s.model.getField("sync_contact")),s.isLoading=!1},function(e){s.isLoading=!1})},Object.defineProperty(ContactExchangeSyncButton.prototype,"disabled",{get:function(){return!(!this.isLoading&&!this.model.isLoading&&this.model.getField("email1")&&!this.model.isEditing)},enumerable:!0,configurable:!0}),Object.defineProperty(ContactExchangeSyncButton.prototype,"syncicon",{get:function(){return this.model.getField("sync_contact")?"check":"add"},enumerable:!0,configurable:!0}),ContactExchangeSyncButton=__decorate([core_1.Component({template:'<div class="slds-grid slds-grid--vertical-align-center"><system-utility-icon *ngIf="!isLoading" [icon]="syncicon" size="xx-small"></system-utility-icon><system-spinner *ngIf="isLoading" size="12"></system-spinner><div class="slds-p-left--xx-small">{{language.getLabel(\'LBL_EXCHANGE\')}}</div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.modal,services_1.backend])],ContactExchangeSyncButton)}();exports.ContactExchangeSyncButton=ContactExchangeSyncButton;var ModuleContacts=function(){function ModuleContacts(e){this.vms=e,this.version="1.0",this.build_date="2020-03-19",this.vms.registerModule(this)}return ModuleContacts=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[ContactNewslettersButton,ContactNewsletters,ContactPortalButton,ContactPortalDetails,ContactExchangeSyncButton]}),__metadata("design:paramtypes",[services_1.VersionManagerService])],ModuleContacts)}();exports.ModuleContacts=ModuleContacts;