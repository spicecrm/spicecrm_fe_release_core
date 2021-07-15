/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.02.001
 * date: 2021-07-15 21:59:12
 * build: 2021.02.001.1626379152634
 **/
"use strict";var __extends=this&&this.__extends||function(){var a=function(t,e){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s])})(t,e)};return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function s(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)}}(),__decorate=this&&this.__decorate||function(t,e,s,a){var i,o=arguments.length,n=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,a);else for(var c=t.length-1;0<=c;c--)(i=t[c])&&(n=(o<3?i(n):3<o?i(e,s,n):i(e,s))||n);return 3<o&&n&&Object.defineProperty(e,s,n),n},__metadata=this&&this.__metadata||function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__param=this&&this.__param||function(s,a){return function(t,e){a(t,e,s)}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleAccounts=exports.AccountVATIDField=exports.AccountHierarchyNode=exports.AccountHierarchy=exports.AccountsContactsManagerList=exports.AccountsContactsManagerDetails=exports.AccountsContactsManager=exports.ContactCCDetailsTab=exports.ContactCCDetails=exports.AccountTerritoryDetails=exports.AccountTerritoryDetailsTab=exports.AccountCCDetailsTab=exports.AccountCCDetails=exports.AccountsKPIsOverview=exports.accountHierarchy=exports.ACManagerService=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),rxjs_1=require("rxjs"),router_1=require("@angular/router"),ACManagerService=function(){function t(){this.contactccdetails={},this.contactCCDetails$=new core_1.EventEmitter}return Object.defineProperty(t.prototype,"contactCCDetails",{get:function(){return this.contactccdetails},set:function(t){this.contactccdetails=t,this.contactCCDetails$.emit(t)},enumerable:!1,configurable:!0}),__decorate([core_1.Injectable()],t)}();exports.ACManagerService=ACManagerService;var accountHierarchy=function(){function t(t){this.backend=t,this.parentId="",this.requestedFields=[],this.members=[],this.membersList=[]}return t.prototype.loadHierachy=function(i,o){var n=this;void 0===i&&(i=this.parentId),void 0===o&&(o=!1);for(var c=new rxjs_1.Subject,t=[],e=0,s=this.requestedFields;e<s.length;e++){var a=s[e];t.push(a.field)}return this.backend.getRequest("module/Accounts/"+i+"/hierarchy/"+JSON.stringify(t)).subscribe(function(t){for(var e=0,s=t;e<s.length;e++){var a=s[e];n.members.push({parent_id:i,id:a.id,member_count:a.member_count,expanded:!1,loaded:!1,summary_text:a.summary_text,data:a.data})}n.members.some(function(t){if(t.id===i)return t.loaded=!0,o&&(t.expanded=!0),!0}),n.rebuildMembersList(),c.next(!0),c.complete()}),c.asObservable()},t.prototype.expand=function(e){var s=this;this.members.some(function(t){if(t.id===e)return t.loaded?t.expanded=!0:s.loadHierachy(e,!0),!0}),this.rebuildMembersList()},t.prototype.collapse=function(e){this.members.some(function(t){if(t.id===e)return!(t.expanded=!1)}),this.rebuildMembersList()},t.prototype.rebuildMembersList=function(){this.membersList=[],this.buildMembersList()},t.prototype.buildMembersList=function(t,e){void 0===t&&(t=this.parentId),void 0===e&&(e=0);for(var s=0,a=this.members;s<a.length;s++){var i=a[s];i.parent_id==t&&(this.membersList.push({level:e+1,id:i.id,member_count:parseInt(i.member_count,10),summary_text:i.summary_text,data:i.data,expanded:i.expanded}),i.expanded&&this.buildMembersList(i.id,e+1))}},__decorate([core_1.Injectable(),__metadata("design:paramtypes",[services_1.backend])],t)}();exports.accountHierarchy=accountHierarchy;var AccountsKPIsOverview=function(){function AccountsKPIsOverview(t,e,s,a,i){var o=this;this.backend=t,this.model=e,this.metadata=s,this.language=a,this.renderer=i,this.years=[],this.limit=0,this.yearto=0,this.companyCodes=[],this.accountKpis={},this.isLoading=!1,this.getYears(),this.isLoading=!0,this.backend.getRequest("module/AccountKPIs/"+this.model.id+"/getsummary",{yearfrom:this.yearto-this.limit+1,yearto:this.yearto}).subscribe(function(t){o.accountKpis=t.accountkpis,o.companyCodes=t.companycodes,o.isLoading=!1})}return Object.defineProperty(AccountsKPIsOverview.prototype,"tableContainerStyle",{get:function(){return{border:"1px solid #dddbda","border-radius":".25rem",height:"417px"}},enumerable:!1,configurable:!0}),AccountsKPIsOverview.prototype.getYears=function(){var t=this.metadata.getComponentConfig("AccountsKPIsOverview","AccountKPIs");this.yearto=t&&t.yearto?+t.yearto:(new moment).get("year"),this.limit=t&&t.limit?+t.limit:4;for(var e=this.yearto-this.limit+1;e<=this.yearto;e++)this.years.push(e)},AccountsKPIsOverview.prototype.getKPI=function(t,e){try{return this.accountKpis[t][e]||0}catch(t){return 0}},__decorate([core_1.Component({template:'<div class="slds-container--fluid slds-m-vertical--small"><div *ngIf="companyCodes.length > 0" class="slds-table--header-fixed_container" [ngStyle]="tableContainerStyle"><div class="slds-scrollable--y" style="height:100%;"><table class="slds-table slds-table_bordered slds-table_header-fixed slds-theme--default"><thead><tr class="slds-text-title_caps"><th scope="col"><div class="slds-p-left--x-small slds-truncate slds-cell-fixed slds-grid slds-grid_vertical-align-center" title="companyCode"><system-label label="LBL_COMPANYCODE"></system-label></div></th><th scope="col" *ngFor="let year of years"><div class="slds-p-left--x-small slds-truncate slds-cell-fixed slds-grid slds-grid_vertical-align-center" title="year">{{ year }}</div></th><th scope="col"><div class="slds-p-left--x-small slds-truncate slds-cell-fixed slds-grid slds-grid_vertical-align-center" title="currency" style="width: fit-content"><system-label label="LBL_CURRENCY"></system-label></div></th></tr></thead><tbody><tr *ngFor="let CCode of companyCodes"><th scope="row" class="slds-theme_shade slds-text-title_caps"><div class="slds-truncate" title="Company Code">{{ CCode.companycode }}</div></th><td scope="row" *ngFor="let year of years"><div class="slds-truncate" title="Revenue">{{ getKPI(CCode.id, year)}}</div></td><th scope="row" class="slds-theme_shade"><div class="slds-truncate slds-text-title_caps" title="EUR">EUR</div></th></tr></tbody></table></div></div><system-spinner *ngIf="isLoading"></system-spinner><div *ngIf="!isLoading && companyCodes.length == 0" class="slds-align_absolute-center slds-p-vertical--medium"><span>No Company Codes found</span></div></div>'}),__metadata("design:paramtypes",[services_1.backend,services_1.model,services_1.metadata,services_1.language,core_1.Renderer2])],AccountsKPIsOverview)}();exports.AccountsKPIsOverview=AccountsKPIsOverview;var AccountCCDetails=function(){function AccountCCDetails(t,e,s,a){this.language=t,this.model=e,this.backend=s,this.view=a,this.companyCodes=[],this.activatedTabs=[],this.activeTab=0,this.isLoading=!1,this.loadCompanyCodes()}return AccountCCDetails.prototype.ngOnInit=function(){this.view.isEditable=!0},AccountCCDetails.prototype.loadCompanyCodes=function(){var e=this;this.isLoading=!0;var t=JSON.stringify(["companycode","date_modified","description","id"]);this.backend.getRequest("module/CompanyCodes",{fields:t}).subscribe(function(t){e.companyCodes=t.list}),this.isLoading=!1},AccountCCDetails.prototype.setActiveTab=function(t){this.activatedTabs.push(t),this.activeTab=t},AccountCCDetails.prototype.getCCDetailsData=function(t){var e,s=this.model.data.accountccdetails.beans;for(e in s)if(s.hasOwnProperty(e)&&s[e].companycode_id==t.id)return s[e]},AccountCCDetails.prototype.getContentContainerStyle=function(t){return{display:t!==this.activeTab?"none":"block",padding:".25rem"}},AccountCCDetails.prototype.trackByFn=function(t,e){return t},__decorate([core_1.Component({template:'<div class="slds-grid slds-m-top--x-small slds-p-around--xxx-small" style="border-radius: .25rem; border: 1px solid #dddbda"><div *ngIf="!isLoading && companyCodes.length > 0" class="slds-tabs--default"><ul class="slds-tabs--default__nav" role="tablist"><li *ngFor="let CCode of companyCodes; let tabindex = index; trackBy: trackByFn" class="slds-tabs--default__item slds-text-title--caps" [ngClass]="{\'slds-active\': tabindex === activeTab}" role="presentation" (click)="setActiveTab(tabindex)"><a class="slds-tabs--default__link" href="javascript:void(0);" role="tab" aria-selected="false">{{ CCode.companycode }}</a></li></ul><ng-container *ngFor="let CCode of companyCodes let tabindex = index; trackBy: trackByFn"><div class="slds-tabs--default__content slds-p-around--xx-small slds-show" role="tabpanel" [ngStyle]="getContentContainerStyle(tabindex)"><account-cc-details-tab [ccode]="CCode" [parent]="model" [data]="getCCDetailsData(CCode)"></account-cc-details-tab></div></ng-container></div><system-spinner *ngIf="isLoading"></system-spinner><div *ngIf="!isLoading && companyCodes.length == 0" class="slds-align_absolute-center slds-p-around--small"><system-label label="LBL_NO_ENTRIES"></system-label></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.backend,services_1.view])],AccountCCDetails)}();exports.AccountCCDetails=AccountCCDetails;var AccountCCDetailsTab=function(){function t(t,e,s){this.language=t,this.metadata=e,this.model=s,this.data=void 0,this.componentconfig={},this.ccode={},this.model.module="AccountCCDetails"}return t.prototype.ngOnInit=function(){this.setModelData()},t.prototype.ngAfterViewInit=function(){this.renderView()},t.prototype.setModelData=function(){this.data?(this.model.id=this.data.id,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.data)):(this.model.initialize(this.parent),this.model.setFields({name:this.ccode.name,companycode_id:this.ccode.id}),this.model.getField("account_id")||this.model.setFields({account_id:this.parent.id,account_name:this.parent.getField("name")}))},t.prototype.renderView=function(){_.isEmpty(this.componentconfig)&&(this.componentconfig=this.metadata.getComponentConfig("AccountCCDetails","AccountCCDetails"),_.isEmpty(this.componentconfig)&&(this.componentconfig=this.metadata.getComponentConfig("AccountCCDetailsTab","Accounts")));var t=this.componentconfig.componentset;if(t)for(var t=this.metadata.getComponentSetObjects(t),s=this,e=0,a=t;e<a.length;e++)!function(e){s.metadata.addComponent(e.component,s.ccdetailscontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig})}(a[e])},__decorate([core_1.ViewChild("ccdetailscontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],t.prototype,"ccdetailscontainer",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"data",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"componentconfig",void 0),__decorate([core_1.Input(),__metadata("design:type",services_1.model)],t.prototype,"parent",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"ccode",void 0),__decorate([core_1.Component({selector:"account-cc-details-tab",template:"<div #ccdetailscontainer></div>",providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model])],t)}();exports.AccountCCDetailsTab=AccountCCDetailsTab;var AccountTerritoryDetailsTab=function(){function t(t,e,s,a){this.language=t,this.metadata=e,this.parent=s,this.model=a,this.data=void 0,this.componentconfig={},this.model.module="AccountCCDetails"}return t.prototype.ngOnInit=function(){this.setModelData()},t.prototype.ngAfterViewInit=function(){this.renderView()},t.prototype.setModelData=function(){this.data?(this.model.id=this.data.id,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.data)):(this.model.initialize(this.parent),this.model.getField("account_id")||this.model.setFields({account_id:this.parent.id,account_name:this.parent.getField("name")}))},t.prototype.renderView=function(){_.isEmpty(this.componentconfig)&&(this.componentconfig=this.metadata.getComponentConfig("AccountTerritoryDetails","AccountCCDetails")),this.componentset=this.componentconfig.componentset},__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"data",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"componentconfig",void 0),__decorate([core_1.Component({selector:"account-territory-details-tab",template:'<system-componentset [componentset]="componentset"></system-componentset>',providers:[services_1.model]}),__param(2,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.model])],t)}();exports.AccountTerritoryDetailsTab=AccountTerritoryDetailsTab;var AccountTerritoryDetails=function(){function AccountTerritoryDetails(t,e,s,a){this.language=t,this.model=e,this.backend=s,this.view=a,this.companyCodes=[],this.activatedTabs=[],this.activeTab=0,this.isLoading=!1}return AccountTerritoryDetails.prototype.ngOnInit=function(){this.view.isEditable=!0},AccountTerritoryDetails.prototype.setActiveTab=function(t){this.activatedTabs.push(t),this.activeTab=t},AccountTerritoryDetails.prototype.getCCDetails=function(){var t;return null!==(t=null===(t=this.model.data)||void 0===t?void 0:t.accountccdetails)&&void 0!==t&&t.beans?_.toArray(this.model.data.accountccdetails.beans):[]},AccountTerritoryDetails.prototype.getCCDetailsData=function(t){var e,s=this.model.data.accountccdetails.beans;for(e in s)if(s.hasOwnProperty(e)&&s[e].companycode_id==t.id)return s[e]},AccountTerritoryDetails.prototype.trackByFn=function(t,e){return t},__decorate([core_1.Component({template:'<div class="slds-grid slds-m-top--x-small slds-p-around--xxx-small" style="border-radius: .25rem; border: 1px solid #dddbda"><div *ngIf="getCCDetails().length > 0" class="slds-tabs--default"><ul class="slds-tabs--default__nav" role="tablist"><li *ngFor="let ccDetail of getCCDetails(); let tabindex = index; trackBy: trackByFn" class="slds-tabs--default__item slds-text-title--caps" [ngClass]="{\'slds-active\': tabindex === activeTab}" role="presentation" (click)="setActiveTab(tabindex)"><a class="slds-tabs--default__link" href="javascript:void(0);" role="tab" aria-selected="false">{{ ccDetail.name }}</a></li></ul><ng-container *ngFor="let ccDetail of getCCDetails() let tabindex = index; trackBy: trackByFn"><div class="slds-tabs--default__content slds-p-around--xx-small slds-show" [ngClass]="{\'slds-hide\': tabindex != activeTab}" role="tabpanel"><account-territory-details-tab [data]="ccDetail"></account-territory-details-tab></div></ng-container></div><system-spinner *ngIf="isLoading"></system-spinner><div *ngIf="getCCDetails().length == 0" class="slds-align_absolute-center slds-p-around--small"><system-label label="LBL_NO_ENTRIES"></system-label></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.model,services_1.backend,services_1.view])],AccountTerritoryDetails)}();exports.AccountTerritoryDetails=AccountTerritoryDetails;var ContactCCDetails=function(){function ContactCCDetails(t,e,s,a,i){this.language=t,this.model=e,this.acmService=s,this.backend=a,this.view=i,this.activatedTabs=[],this.companyCodes=[],this.activeTab=0,this.contactccdetails={},this.isLoading=!1,this.loadCompanyCode(),this.subscribeContactCCDetailsChanges()}return Object.defineProperty(ContactCCDetails.prototype,"contactCCDetails",{get:function(){return this.contactccdetails},set:function(t){this.contactccdetails=t},enumerable:!1,configurable:!0}),ContactCCDetails.prototype.ngOnInit=function(){this.view.isEditable=!0},ContactCCDetails.prototype.ngOnDestroy=function(){this.accountsContactsManagerSubscriber.unsubscribe()},ContactCCDetails.prototype.setActiveTab=function(t){this.activatedTabs.push(t),this.activeTab=t},ContactCCDetails.prototype.getCCDetailsData=function(t){if(!_.isEmpty(this.contactCCDetails))for(var e in this.contactCCDetails)if(this.contactCCDetails[e].companycode_id==t.id)return this.contactCCDetails[e]},ContactCCDetails.prototype.getContentContainerStyle=function(t){return{display:t!==this.activeTab?"none":"block",padding:".25rem"}},ContactCCDetails.prototype.loadCompanyCode=function(){var e=this;this.isLoading=!0;var t=JSON.stringify(["companycode","date_modified","description","id"]);this.backend.getRequest("module/CompanyCodes",{fields:t}).subscribe(function(t){e.companyCodes=t.list,e.isLoading=!1})},ContactCCDetails.prototype.subscribeContactCCDetailsChanges=function(){var e=this;this.accountsContactsManagerSubscriber=this.acmService.contactCCDetails$.subscribe(function(t){e.activeTab=0,e.companyCodes=e.companyCodes.slice(),e.contactCCDetails=t})},ContactCCDetails.prototype.trackByFn=function(t,e){return t},__decorate([core_1.Component({selector:"contact-cc-details",template:'<div class="slds-grid slds-m-top--x-small slds-p-around--xxx-small" style="border-radius: .25rem; border: 1px solid #dddbda"><div *ngIf="!isLoading && companyCodes.length > 0" class="slds-tabs--default"><ul class="slds-tabs--default__nav" role="tablist"><li *ngFor="let CCode of companyCodes; let tabindex = index; trackBy: trackByFn" class="slds-tabs--default__item slds-text-title--caps" [ngClass]="{\'slds-active\': tabindex === activeTab}" role="presentation" (click)="setActiveTab(tabindex)"><a class="slds-tabs--default__link" href="javascript:void(0);" role="tab" aria-selected="false">{{ CCode.companycode }}</a></li></ul><ng-container *ngFor="let CCode of companyCodes let tabindex = index; trackBy: trackByFn"><div class="slds-tabs--default__content slds-p-around--xx-small slds-show" role="tabpanel" [ngStyle]="getContentContainerStyle(tabindex)"><contact-cc-details-tab [ccid]="CCode.id" [ccname]="CCode.companycode" [contactid]="model.id" [data]="getCCDetailsData(CCode)"></contact-cc-details-tab></div></ng-container></div><system-spinner *ngIf="isLoading"></system-spinner><div *ngIf="!isLoading && companyCodes.length == 0" class="slds-align_absolute-center slds-p-around--small"><system-label label="LBL_NO_ENTRIES"></system-label></div></div>',providers:[services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.model,ACManagerService,services_1.backend,services_1.view])],ContactCCDetails)}();exports.ContactCCDetails=ContactCCDetails;var ContactCCDetailsTab=function(){function t(t,e,s){this.language=t,this.metadata=e,this.model=s,this.data=void 0,this.contactId=void 0,this.ccId=void 0,this.ccName=void 0}return t.prototype.ngOnChanges=function(){this.setModelData()},t.prototype.ngOnInit=function(){this.model.module="ContactCCDetails"},t.prototype.ngAfterViewInit=function(){this.renderView()},t.prototype.renderView=function(){var t=this.metadata.getComponentConfig("ContactCCDetailsTab","Accounts").componentset;if(t)for(var t=this.metadata.getComponentSetObjects(t),s=this,e=0,a=t;e<a.length;e++)!function(e){s.metadata.addComponent(e.component,s.ccdetailscontainer).subscribe(function(t){t.instance.componentconfig=e.componentconfig})}(a[e])},t.prototype.setModelData=function(){this.data?(this.model.id=this.data.id,this.model.data=this.data):(this.model.id=this.model.generateGuid(),this.model.data={id:this.model.id,name:this.ccName,contact_id:this.contactId,companycode_id:this.ccId,date_entered:new moment,date_modified:new moment})},__decorate([core_1.ViewChild("ccdetailscontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],t.prototype,"ccdetailscontainer",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"data",void 0),__decorate([core_1.Input("contactid"),__metadata("design:type",String)],t.prototype,"contactId",void 0),__decorate([core_1.Input("ccid"),__metadata("design:type",String)],t.prototype,"ccId",void 0),__decorate([core_1.Input("ccname"),__metadata("design:type",String)],t.prototype,"ccName",void 0),__decorate([core_1.Component({selector:"contact-cc-details-tab",template:"<div #ccdetailscontainer></div>",providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model])],t)}();exports.ContactCCDetailsTab=ContactCCDetailsTab;var AccountsContactsManager=function(){function AccountsContactsManager(t,e,s,a,i){this.language=t,this.metadata=e,this.relatedmodels=s,this.acmService=a,this.model=i,this.editcomponentset="",this.module="",this.displayitems=5,this.activeContactId=void 0,this.relatedmodels.module=this.model.module,this.relatedmodels.id=this.model.id}return AccountsContactsManager.prototype.setActiveContactId=function(t){this.activeContactId=t},Object.defineProperty(AccountsContactsManager.prototype,"childrenHeight",{get:function(){return{height:"340px"}},enumerable:!1,configurable:!0}),Object.defineProperty(AccountsContactsManager.prototype,"mainStyle",{get:function(){return{height:"350pxpx","border-radius":".25rem",border:"1px solid #dddbda"}},enumerable:!1,configurable:!0}),AccountsContactsManager.prototype.ngAfterViewInit=function(){this.loadRelated()},AccountsContactsManager.prototype.loadRelated=function(){this.relatedmodels.relatedModule="Contacts",this.relatedmodels.getData()},AccountsContactsManager.prototype.ngOnDestroy=function(){this.relatedmodels.stopSubscriptions()},AccountsContactsManager.prototype.aclAccess=function(){return this.metadata.checkModuleAcl(this.module,"list")},__decorate([core_1.Component({selector:"accounts-contacts-manager",template:'<object-related-card [componentconfig]="{object: \'Contacts\'}"><div class="slds-grid slds-border--top" style="height: 350px;"><div class="slds-size--1-of-3 slds-border--right slds-p-around--xxx-small"><accounts-contacts-manager-list (activeContactId$)="setActiveContactId($event)" [tableHeight]="childrenHeight"></accounts-contacts-manager-list></div><div class="slds-size--2-of-3" [ngStyle]="childrenHeight"><accounts-contacts-manager-details [activecontactid]="activeContactId"></accounts-contacts-manager-details></div></div></object-related-card>',providers:[services_1.relatedmodels,ACManagerService]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.relatedmodels,ACManagerService,services_1.model])],AccountsContactsManager)}();exports.AccountsContactsManager=AccountsContactsManager;var AccountsContactsManagerDetails=function(){function AccountsContactsManagerDetails(t,e,s,a,i,o){this.language=t,this.metadata=e,this.view=s,this.acmService=a,this.relatedmodels=i,this.model=o,this.activeContactId=void 0,this.renderedComponents=[],this.model.module="Contacts"}return AccountsContactsManagerDetails.prototype.ngAfterViewInit=function(){this.buildContainer()},AccountsContactsManagerDetails.prototype.ngOnChanges=function(){var e=this;this.activeContactId&&(this.resetView(),this.buildContainer(),this.view.setViewMode(),this.model.id=this.activeContactId,this.model.getData(!0,"",!0).subscribe(function(t){_.isEmpty(t.contactccdetails.beans)?e.acmService.contactCCDetails={}:e.acmService.contactCCDetails=t.contactccdetails.beans}))},AccountsContactsManagerDetails.prototype.resetView=function(){for(var t=0,e=this.renderedComponents;t<e.length;t++)e[t].destroy();this.renderedComponents=[]},AccountsContactsManagerDetails.prototype.buildContainer=function(){var s=this,t=this.metadata.getComponentConfig("AccountsContactsManager","Accounts").detailscomponentset;if(t)for(var t=this.metadata.getComponentSetObjects(t),a=this,e=0,i=t;e<i.length;e++)!function(e){a.metadata.addComponent(e.component,a.detailscontainer).subscribe(function(t){s.renderedComponents.push(t),t.instance.componentconfig=e.componentconfig})}(i[e])},__decorate([core_1.ViewChild("detailscontainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],AccountsContactsManagerDetails.prototype,"detailscontainer",void 0),__decorate([core_1.Input("activecontactid"),__metadata("design:type",String)],AccountsContactsManagerDetails.prototype,"activeContactId",void 0),__decorate([core_1.Component({selector:"accounts-contacts-manager-details",template:'<div class="slds-scrollable--y slds-p-around--x-small"><div *ngIf="!activeContactId" class="slds-text-align_center slds-p-vertical--medium"><span><system-label label="LBL_MAKE_SELECTION"></system-label></span></div><div [hidden]="!activeContactId"><div #detailscontainer></div></div></div>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.view,ACManagerService,services_1.relatedmodels,services_1.model])],AccountsContactsManagerDetails)}();exports.AccountsContactsManagerDetails=AccountsContactsManagerDetails;var AccountsContactsManagerList=function(){function t(t,e,s,a){this.language=t,this.metadata=e,this.relatedmodels=s,this.model=a,this.listfields=[],this.fieldset="",this.tableheight={},this.activeContactId$=new core_1.EventEmitter,this.activeContactId=void 0,this.model.module="Contacts"}return t.prototype.ngOnInit=function(){var t=this.metadata.getComponentConfig("AccountsContactsManager","Accounts");this.listfields=this.metadata.getFieldSetFields(t.listfieldset)},t.prototype.setActiveContactId=function(t){this.activeContactId=t,this.activeContactId$.emit(t)},Object.defineProperty(t.prototype,"contacts",{get:function(){return this.relatedmodels.items},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"tableHeight",{get:function(){return this.tableheight},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"isloading",{get:function(){return this.relatedmodels.isloading},enumerable:!1,configurable:!0}),__decorate([core_1.ViewChild("tableContainer",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],t.prototype,"tableContainer",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],t.prototype,"fieldset",void 0),__decorate([core_1.Input("tableHeight"),__metadata("design:type",Object)],t.prototype,"tableheight",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],t.prototype,"activeContactId$",void 0),__decorate([core_1.Component({selector:"accounts-contacts-manager-list",template:'<div #tableContainer *ngIf="!isloading && contacts?.length > 0" class="slds-table--header-fixed_container" [ngStyle]="tableHeight"><div class="slds-scrollable--y" style="height:100%;"><table class="slds-table slds-table_bordered slds-table_cell-buffer slds-table_header-fixed" style="border-top: 0"><thead><tr class="slds-text-title_caps"><th scope="col" *ngFor="let field of listfields"><div class="slds-truncate slds-cell-fixed slds-grid slds-grid_vertical-align-center"><field-label [fieldname]="field.field" [fieldconfig]="field.fieldconfig"></field-label></div></th></tr></thead><tbody><tr *ngFor="let contact of contacts" [system-model-provider]="{module:\'Contacts\', data: contact}" (click)="setActiveContactId(contact.id)" style="cursor: pointer" (mouseover)="hovered = contact.id" (mouseout)="hovered = \'\'" [ngClass]="{\'slds-theme_shade\': activeContactId == contact.id}" [ngStyle]="{\'border-bottom\': hovered == contact.id ? \'1px solid darkred\':\'\', \'font-weight\': activeContactId == contact.id ? \'700\': \'\'}"><td *ngFor="let field of listfields"><field-container [fieldname]="field.field" [fieldconfig]="field.fieldconfig" fielddisplayclass="slds-truncate"></field-container></td></tr></tbody></table></div></div><system-spinner *ngIf="isloading"></system-spinner><div *ngIf="!isloading && contacts?.length == 0" class="slds-text-align_center slds-p-vertical--medium"><span><system-label label="LBL_NO_ENTRIES"></system-label></span></div>',providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.relatedmodels,services_1.model])],t)}();exports.AccountsContactsManagerList=AccountsContactsManagerList;var AccountHierarchy=function(){function AccountHierarchy(t,e,s,a){this.language=t,this.metadata=e,this.accountHierarchy=s,this.model=a,this.componentconfig={},this.fieldsetFields=[],this.loading=!1}return AccountHierarchy.prototype.loadHierarchy=function(){return this.accountHierarchy.parentId=this.model.id,this.accountHierarchy.requestedFields=this.fieldsetFields,this.accountHierarchy.loadHierachy()},AccountHierarchy.prototype.ngOnInit=function(){var e=this;this.fieldsetFields=this.metadata.getFieldSetFields(this.componentconfig.fieldset),this.loading=!0,this.loadHierarchy().subscribe(function(t){e.loading=!1})},__decorate([core_1.Component({selector:"account-hierarchy",template:'<article class="slds-card slds-card_boundary slds-m-bottom--medium"><div class="slds-card__header slds-grid"><header class="slds-media slds-media--center slds-has-flexi-truncate"><system-icon [icon]="\'hierarchy\'" [size]="\'small\'"></system-icon><div class="slds-media__body slds-truncate"><h2><a href="javascript:void(0);" class="slds-text-link--reset"><span class="slds-text-heading--small"><system-label label="LBL_SUBSIDIARIES"></system-label></span></a></h2></div></header></div><div class="slds-card__body"><table class="slds-table slds-table--bordered slds-tree slds-table--tree" role="treegrid"><thead><tr class="slds-text-title--caps"><th *ngFor="let field of fieldsetFields" class="slds-cell-buffer--left" scope="col"><div class="slds-truncate"><system-label-fieldname module="Accounts" [field]="field.field"></system-label-fieldname></div></th></tr></thead><tbody><tr account-hierarchy-node class="slds-hint-parent" role="row" aria-expanded="true" *ngFor="let node of accountHierarchy.membersList" [nodedata]="node" [fields]="fieldsetFields"></tr></tbody><tbody system-table-stencils *ngIf="loading" [columns]="fieldsetFields.length" [rows]="5"></tbody></table></div></article>',providers:[accountHierarchy]}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,accountHierarchy,services_1.model])],AccountHierarchy)}();exports.AccountHierarchy=AccountHierarchy;var AccountHierarchyNode=function(){function t(t,e,s,a,i){this.view=t,this.language=e,this.metadata=s,this.accountHierarchy=a,this.model=i,this.nodedata={},this.fields=[],this.loading=!1,this.view.displayLabels=!1}return t.prototype.ngOnInit=function(){this.model.module="Accounts",this.model.id=this.nodedata.id,this.model.data.summary_text=this.nodedata.summary_text;for(var t=0,e=this.fields;t<e.length;t++){var s=e[t];this.model.data[s.field]=this.nodedata.data[s.field]}this.model.data.acl=this.nodedata.data.acl},t.prototype.expandNode=function(){this.nodedata.expanded?this.accountHierarchy.collapse(this.nodedata.id):(this.loading=!0,this.accountHierarchy.expand(this.nodedata.id))},t.prototype.getIcon=function(){switch(this.nodedata.expanded){case!1:return"chevronright";case!0:return"chevrondown"}},__decorate([core_1.Input(),__metadata("design:type",Object)],t.prototype,"nodedata",void 0),__decorate([core_1.Input(),__metadata("design:type",Array)],t.prototype,"fields",void 0),__decorate([core_1.Component({selector:"[account-hierarchy-node]",template:'<ng-container *ngFor="let field of fields; let i = index"><td *ngIf="i === 0" scope="row" class="slds-tree__item"><button class="slds-button slds-button--icon slds-button--icon-x-small slds-m-right--x-small" [disabled]="nodedata.member_count === 0" (click)="expandNode()"><system-button-icon *ngIf="!loading" [icon]="getIcon()"></system-button-icon><system-button-icon *ngIf="loading" [icon]="\'spinner\'"></system-button-icon></button><div class="slds-truncate"><field-container [field]="field.field" [fieldconfig]="field.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></td><td *ngIf="i > 0"><div class="slds-truncate"><field-container [field]="field.field" [fieldconfig]="field.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></td></ng-container>',providers:[services_1.model,services_1.view],host:{"[attr.aria-level]":"nodedata.level"}}),__metadata("design:paramtypes",[services_1.view,services_1.language,services_1.metadata,accountHierarchy,services_1.model])],t)}();exports.AccountHierarchyNode=AccountHierarchyNode;var AccountVATIDField=function(d){function AccountVATIDField(t,e,s,a,i,o,n){var c=d.call(this,t,e,s,a,i)||this;return c.model=t,c.view=e,c.language=s,c.metadata=a,c.router=i,c.backend=o,c.toast=n,c.isvalidating=!1,c.options=[],c.subscriptions.add(c.language.currentlanguage$.subscribe(function(t){c.getOptions()})),c}return __extends(AccountVATIDField,d),Object.defineProperty(AccountVATIDField.prototype,"emptyVATIDS",{get:function(){return 0<this.getAccountVATIDs().length},enumerable:!1,configurable:!0}),AccountVATIDField.prototype.ngOnInit=function(){this.getOptions(),this.model.getField("accountvatids")||this.model.initializeField("accountvatids",{beans:{},beans_relations_to_delete:{}}),this.getAccountVATIDs()},AccountVATIDField.prototype.getOptions=function(){var t,e=[],s=this.language.getFieldDisplayOptions("AccountVATIDs","country");for(t in s)e.push({value:t,display:s[t]});if(this.options=e,this.fieldconfig.sortdirection)switch(this.fieldconfig.sortdirection.toLowerCase()){case"desc":this.options.sort(function(t,e){return t.display.toLowerCase()<e.display.toLowerCase()?1:-1});break;case"asc":this.options.sort(function(t,e){return t.display.toLowerCase()>e.display.toLowerCase()?1:-1})}},AccountVATIDField.prototype.getColor=function(t){var e="gray";switch(this.model.getField("accountvatids").beans[t].vatid_status){case"valid":e="green";break;case"not_valid":e="red"}return{"background-color":e}},AccountVATIDField.prototype.getAccountVATIDs=function(){var t=[];if(this.model.getField("accountvatids")){var e,s=this.model.getField("accountvatids");for(e in s.beans)1!=s.beans[e].deleted&&t.push(s.beans[e])}return t},AccountVATIDField.prototype.validate=function(t,e,s){var a=this;this.isvalidating=!0,this.backend.getRequest("module/Account/"+(t+e)+"/vatids").subscribe(function(t){"success"==t.status?!0!==t.data.valid?(a.toast.sendToast(a.language.getLabel("ERR_INVALID_VAT"),"error"),a.model.getField("accountvatids").beans[s].vatid_status="not_valid"):(a.model.getField("accountvatids").beans[s].verification_details=JSON.stringify(t.data),a.model.getField("accountvatids").beans[s].vatid_status="valid"):a.toast.sendToast(a.language.getLabel("ERR_CHECK_VAT"),"error"),a.isvalidating=!1})},AccountVATIDField.prototype.canCheck=function(t){return 3<t.length},AccountVATIDField.prototype.add=function(){var t=this.model.generateGuid();this.model.getField("accountvatids").beans[t]={id:t,account_id:this.model.id,account_name:this.model.displayname,vat_id:"",vatid_status:"",country:""},this.getAccountVATIDs()},AccountVATIDField.prototype.delete=function(t){this.model.getField("accountvatids").beans[t].deleted=1,this.getAccountVATIDs()},AccountVATIDField.prototype.isvalid=function(t){return"valid"==this.model.getField("accountvatids").beans[t].vatid_status},AccountVATIDField.prototype.vatInfo=function(t){t=JSON.parse(this.model.getField("accountvatids").beans[t].verification_details);return t.name+"\n"+t.address},__decorate([core_1.Component({selector:"account-vatid-field",template:'<field-label *ngIf="displayLabel" [fieldname]="fieldname" [fieldconfig]="fieldconfig"></field-label><div class="slds-p-vertical--small" *ngIf="!isEditMode()"><field-generic-display *ngFor="let vat of getAccountVATIDs()" [fielddisplayclass]="fielddisplayclass" [fieldconfig]="fieldconfig" [editable]="isEditable()"><div style="float: left; width: 10px; height: 10px; border-radius: 5px; margin-top: 5px; margin-right: 5px;" [ngStyle]="getColor(vat.id)"></div><div>{{vat.country}}{{vat.vat_id}}</div></field-generic-display></div><div *ngIf="this.isEditMode()"><div *ngFor="let vat of getAccountVATIDs()" class="slds-grid slds-grid--vertical-align-center"><button class="slds-button slds-button--icon-small slds-button--icon-border slds-m-right--x-small"><system-button-icon icon="close" (click)="delete(vat.id)"></system-button-icon></button><div *ngIf="isEditMode()" class="slds-form-element slds-col slds-m-right--x-small"><div class="slds-form-element__control" [ngClass]="getFieldClass()"><div class="slds-select_container slds-m-vertical--xx-small"><select #focus class="slds-select" [(ngModel)]="vat.country"><option *ngFor="let o of options" [value]="o.value">{{o.display}}</option></select></div><field-messages [fieldname]="fieldname"></field-messages></div></div><input class="slds-col" #focus type="text" [(ngModel)]="vat.vat_id"><div class="slds-col_bump-left slds-grid slds-grid--vertical-align-center"><system-tooltip class="slds-m-left--x-small" *ngIf="isvalid(vat.id)" [tooltiptext]="vatInfo(vat.id)"></system-tooltip><button class="slds-button slds-button--neutral slds-m-left--x-small" [disabled]="!canCheck(vat.vat_id)" (click)="validate(vat.country, vat.vat_id, vat.id)"><system-label label="LBL_CHECK"></system-label></button></div></div><div class="slds-grid slds-align-content-center slds-p-vertical--x-small slds-border--top"><button class="slds-button slds-button--icon-small slds-button--icon-border"><system-button-icon icon="add" (click)="add()"></system-button-icon></button></div></div>'}),__metadata("design:paramtypes",[services_1.model,services_1.view,services_1.language,services_1.metadata,router_1.Router,services_1.backend,services_1.toast])],AccountVATIDField)}(objectfields_1.fieldGeneric);exports.AccountVATIDField=AccountVATIDField;var ModuleAccounts=function(){function ModuleAccounts(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[AccountsKPIsOverview,AccountCCDetails,AccountCCDetailsTab,AccountTerritoryDetailsTab,AccountTerritoryDetails,ContactCCDetails,ContactCCDetailsTab,AccountsContactsManager,AccountsContactsManagerDetails,AccountsContactsManagerList,AccountHierarchy,AccountHierarchyNode,AccountVATIDField],providers:[ACManagerService]})],ModuleAccounts)}();exports.ModuleAccounts=ModuleAccounts;