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
 * © 2015 - 2020 aac services k.s. All rights reserved.
 * release: 2020.02.001
 * date: 2020-08-21 19:10:39
 * build: 2020.02.001.1598029840036
 **/
"use strict";var __extends=this&&this.__extends||function(){var s=function(e,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a])})(e,t)};return function(e,t){function a(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(a.prototype=t.prototype,new a)}}(),__decorate=this&&this.__decorate||function(e,t,a,s){var i,r=arguments.length,n=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,s);else for(var o=e.length-1;0<=o;o--)(i=e[o])&&(n=(r<3?i(n):3<r?i(t,a,n):i(t,a))||n);return 3<r&&n&&Object.defineProperty(t,a,n),n},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),platform_browser_1=require("@angular/platform-browser"),http_1=require("@angular/common/http"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),rxjs_1=require("rxjs"),services_1=require("../../services/services"),GroupwareService=function(){function e(e){this.backend=e,this.emailId="",this._messageId="",this.isArchiving=!1,this.archiveto=[],this.archiveattachments=[],this.relatedBeans=[],this.attachments={attachments:[]}}return e.prototype.addBean=function(e){this.archiveto.push(e)},e.prototype.removeBean=function(t){var e=this.archiveto.findIndex(function(e){return t.id==e.id});this.archiveto.splice(e,1)},e.prototype.checkBeanArchive=function(t){return 0<=this.archiveto.findIndex(function(e){return t.id==e.id})},e.prototype.addAttachment=function(e){this.archiveattachments.push(e)},e.prototype.removeAttachment=function(t){var e=this.archiveattachments.findIndex(function(e){return t.id==e.id});this.archiveattachments.splice(e,1)},e.prototype.checkAttachmentArchive=function(t){return 0<=this.archiveattachments.findIndex(function(e){return e&&t.id==e.id})},e.prototype.getAttachment=function(t){return this.attachments.attachments.find(function(e){return t==e.id})},e.prototype.checkRelatedBeans=function(t){return 0<=this.relatedBeans.findIndex(function(e){return t.id==e.id})},e.prototype.getEmailFromSpice=function(){var n=this,o=new rxjs_1.Subject,e={message_id:this._messageId};return this.backend.postRequest("module/Emails/groupware/getemail",{},e).subscribe(function(e){for(var t in n.emailId=e.email_id,e.linkedBeans)n.checkBeanArchive(e.linkedBeans[t])||n.addBean(e.linkedBeans[t]);for(var a=0,s=e.attachments;a<s.length;a++){var i=s[a],r=n.getAttachment(i.external_id);r&&n.addAttachment(r)}o.next(!0),o.complete()},function(e){console.log(e),o.error(!1),o.complete()}),o.asObservable()},e.prototype.loadLinkedBeans=function(){var a=this,s=new rxjs_1.Subject,e=this.getEmailAddressData();return this.relatedBeans=[],this.backend.postRequest("EmailAddress/searchBeans",{},e).subscribe(function(e){for(var t in e)a.checkRelatedBeans(e[t])||a.relatedBeans.push(e[t]);s.next(a.relatedBeans),s.complete()},function(e){s.error(e)}),s.asObservable()},Object.defineProperty(e.prototype,"messageId",{get:function(){return this._messageId},set:function(e){this._messageId=e},enumerable:!0,configurable:!0}),e=__decorate([core_1.Injectable(),__metadata("design:paramtypes",[services_1.backend])],e)}();exports.GroupwareService=GroupwareService;var GroupwarePaneBean=function(){function GroupwarePaneBean(e,t,a,s,i){this.groupware=e,this.language=t,this.metadata=a,this.model=s,this.view=i,this.view.displayLabels=!1}return GroupwarePaneBean.prototype.ngOnInit=function(){var e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);e&&e.mainfieldset&&(this.mainfieldsetfields=this.metadata.getFieldSetItems(e.mainfieldset)),e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))},GroupwarePaneBean.prototype.onClick=function(e){e.target.checked?this.groupware.addBean(this.bean):this.groupware.removeBean(this.bean)},__decorate([core_1.Input(),__metadata("design:type",Object)],GroupwarePaneBean.prototype,"bean",void 0),GroupwarePaneBean=__decorate([core_1.Component({selector:"groupware-pane-bean",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small"><div class="slds-p-vertical--xx-small"><system-icon [module]="model.module" size="small"></system-icon></div><div class="slds-media__body"><div class="slds-grid slds-has-flexi-truncate"><span *ngIf="!mainfieldsetfields">{{model.data.summary_text}}</span><ul *ngIf="mainfieldsetfields" class="slds-list_horizontal slds-has-dividers_right slds-truncate"><ng-container *ngFor="let fieldsetitem of mainfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul><div class="slds-col--bump-left slds-checkbox"><input type="checkbox" name="beans" [id]="\'bean-\'+bean.id" (click)="onClick($event)" [checked]="groupware.checkBeanArchive(bean)"> <label class="slds-checkbox__label" [attr.for]="\'bean-\'+bean.id"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label slds-assistive-text">{{bean.name}}</span></label></div></div><div class="slds-truncate slds-text-body_small" title="Bean Module"><ul class="slds-list_horizontal slds-has-dividers_right slds-truncate"><li class="slds-item"><system-label-modulename [module]="model.module" [singular]="true"></system-label-modulename></li><ng-container *ngFor="let fieldsetitem of subfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div></div></article>',providers:[services_1.view]}),__metadata("design:paramtypes",[GroupwareService,services_1.language,services_1.metadata,services_1.model,services_1.view])],GroupwarePaneBean)}();exports.GroupwarePaneBean=GroupwarePaneBean;var GroupwarePaneNoBeansFound=function(){function e(){}return e=__decorate([core_1.Component({selector:"groupware-pane-no-beans-found",template:'<div class="slds-align--absolute-center slds-grid--vertical" system-to-bottom-noscroll><system-illustration-no-records class="slds-p-around--medium" style="max-width: 250px;"><system-label label="MSG_NO_RECORDS_FOUND"></system-label></system-illustration-no-records></div>'})],e)}();exports.GroupwarePaneNoBeansFound=GroupwarePaneNoBeansFound;var GroupwareDetailPaneView=function(){function GroupwareDetailPaneView(e,t,a,s,i){var r=this;this.navigation=e,this.navigationtab=t,this.broadcast=a,this.metadata=s,this.model=i,this.initialized=!1,this.componentRefs=[],this.componentSubscriptions=new rxjs_1.Subscription,this.componentSubscriptions.add(this.navigationtab.activeRoute$.subscribe(function(e){r.setRouteData(e)})),this.componentSubscriptions.add(this.broadcast.message$.subscribe(function(e){r.handleMessage(e)}))}return GroupwareDetailPaneView.prototype.setRouteData=function(e){var t=this;e.params.module&&e.params.id&&(this.model.module!=e.params.module||this.model.id!=e.params.id)&&(this.model.module=e.params.module,this.model.id=e.params.id,this.model.getData(!0,"detailview",!0,!0).subscribe(function(e){t.navigationtab.setTabInfo({displayname:e.summary_text,displaymodule:t.model.module})}),this.initialized&&this.buildContainer())},GroupwareDetailPaneView.prototype.handleMessage=function(e){switch(e.messagetype){case"applauncher.setrole":this.buildContainer()}},GroupwareDetailPaneView.prototype.ngAfterViewInit=function(){this.model.module&&this.model.id&&(this.initialized=!0,this.buildContainer())},GroupwareDetailPaneView.prototype.ngOnDestroy=function(){this.componentSubscriptions.unsubscribe()},GroupwareDetailPaneView.prototype.buildContainer=function(){for(var a=this,e=0,t=this.componentRefs;e<t.length;e++){t[e].destroy()}for(var s=this.metadata.getComponentConfig("GroupwareDetailPane",this.model.module),i=function(t){r.metadata.addComponent(t.component,r.header).subscribe(function(e){e.instance.componentconfig=t.componentconfig,a.componentRefs.push(e)})},r=this,n=0,o=this.metadata.getComponentSetObjects(s.header);n<o.length;n++){i(o[n])}for(var l=function(t){d.metadata.addComponent(t.component,d.main).subscribe(function(e){e.instance.componentconfig=t.componentconfig,a.componentRefs.push(e)})},d=this,c=0,u=this.metadata.getComponentSetObjects(s.main);c<u.length;c++){l(u[c])}},__decorate([core_1.ViewChild("header",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],GroupwareDetailPaneView.prototype,"header",void 0),__decorate([core_1.ViewChild("main",{read:core_1.ViewContainerRef,static:!0}),__metadata("design:type",core_1.ViewContainerRef)],GroupwareDetailPaneView.prototype,"main",void 0),GroupwareDetailPaneView=__decorate([core_1.Component({selector:"groupware-detail-pane-view",template:'<div #header></div><div class="slds-theme--default" system-to-bottom><div #main></div></div>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.navigation,services_1.navigationtab,services_1.broadcast,services_1.metadata,services_1.model])],GroupwareDetailPaneView)}();exports.GroupwareDetailPaneView=GroupwareDetailPaneView;var GroupwareEmailArchivePaneAttachment=function(){function e(e){this.groupware=e}return e.prototype.onClick=function(e){e.target.checked?this.groupware.addAttachment(this.attachment):this.groupware.removeAttachment(this.attachment)},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"attachment",void 0),e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-attachment",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small"><div class="slds-media__figure"><div class="slds-checkbox"><input type="checkbox" name="attachments" [id]="\'attachment-\'+attachment.id" (click)="onClick($event)" [checked]="groupware.checkAttachmentArchive(attachment)"> <label class="slds-checkbox__label" [attr.for]="\'attachment-\'+attachment.id"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label slds-assistive-text">{{attachment.name}}</span></label></div></div><div class="slds-media__body"><h3 class="slds-tile__title slds-truncate slds-text-heading--label" [title]="attachment.name">{{attachment.name}}</h3><div class="slds-tile__detail"><p class="slds-truncate slds-text-body_small" title="Attachment Type">{{attachment.contentType}}</p></div></div></article>'}),__metadata("design:paramtypes",[GroupwareService])],e)}();exports.GroupwareEmailArchivePaneAttachment=GroupwareEmailArchivePaneAttachment;var GroupwareEmailArchivePane=function(){function GroupwareEmailArchivePane(e,t){this.backend=e,this.groupware=t,this.activetab="beans",this.groupware.getEmailFromSpice()}return GroupwareEmailArchivePane.prototype.open=function(e){this.activetab=e},Object.defineProperty(GroupwareEmailArchivePane.prototype,"isArchived",{get:function(){return 0!==this.groupware.emailId.length},enumerable:!0,configurable:!0}),GroupwareEmailArchivePane=__decorate([core_1.Component({selector:"groupware-email-archive-pane",template:'<groupware-email-archive-pane-header></groupware-email-archive-pane-header><div class="slds-tabs_default" [system-overlay-loading-spinner]="groupware.isArchiving"><ul class="slds-tabs_default__nav" role="tablist"><li class="slds-tabs_default__item" title="Search" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'beans\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'beans\')"><system-utility-icon icon="user" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Search" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'search\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'search\')"><system-utility-icon icon="search" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Attachments" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'attachments\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'attachments\')"><system-utility-icon icon="attach" size="x-small"></system-utility-icon></a></li><li class="slds-tabs_default__item" title="Attachments" role="presentation" [ngClass]="{\'slds-is-active\': activetab==\'linked\'}"><a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" (click)="open(\'linked\')"><system-utility-icon icon="linked" size="x-small"></system-utility-icon></a></li></ul><div class="slds-scrollable"><groupware-email-archive-pane-beans [ngClass]="{\'slds-hide\': activetab!=\'beans\'}"></groupware-email-archive-pane-beans><groupware-email-archive-pane-search [ngClass]="{\'slds-hide\': activetab!=\'search\'}"></groupware-email-archive-pane-search><groupware-email-archive-pane-attachments [ngClass]="{\'slds-hide\': activetab!=\'attachments\'}"></groupware-email-archive-pane-attachments><groupware-email-archive-pane-linked [ngClass]="{\'slds-hide\': activetab!=\'linked\'}"></groupware-email-archive-pane-linked></div></div>'}),__metadata("design:paramtypes",[services_1.backend,GroupwareService])],GroupwareEmailArchivePane)}();exports.GroupwareEmailArchivePane=GroupwareEmailArchivePane;var GroupwareEmailArchivePaneHeader=function(){function e(e,t,a){this.language=e,this.groupware=t,this.cdRef=a}return e.prototype.archive=function(){var e=this;this.groupware.archiveEmail().subscribe(function(e){},function(e){},function(){e.cdRef.detectChanges()})},Object.defineProperty(e.prototype,"canArchive",{get:function(){return 0<this.groupware.archiveto.length&&!this.groupware.isArchiving},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isArchived",{get:function(){return 0!==this.groupware.emailId.length},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-header",template:'<div class="slds-page-header slds-page-header_record-home"><div class="slds-page-header__row"><div class="slds-page-header__col-title"><div class="slds-media"><system-icon module="Emails"></system-icon><div class="slds-media__body"><div class="slds-page-header__name"><div class="slds-page-header__name-title"><h1><span class="slds-page-header__title slds-truncate"><system-label-modulename module="Emails" [singular]="true"></system-label-modulename></span></h1></div></div><p class="slds-page-header__name-meta"><system-label [label]="isArchived ? \'LBL_ARCHIVED\' : \'LBL_NOT_ARCHIVED\'"></system-label></p></div></div></div><div class="slds-page-header__col-actions"><div class="slds-page-header__controls"><div class="slds-page-header__control"><ul class="slds-button-group-list"><li><button class="slds-button slds-button_neutral" [disabled]="!canArchive" (click)="archive()"><system-label label="LBL_ARCHIVE"></system-label></button></li></ul></div></div></div></div></div>'}),__metadata("design:paramtypes",[services_1.language,GroupwareService,core_1.ChangeDetectorRef])],e)}();exports.GroupwareEmailArchivePaneHeader=GroupwareEmailArchivePaneHeader;var GroupwareEmailArchivePaneAttachments=function(){function e(e,t,a){this.groupware=e,this.changeDetectorRef=t,this.language=a,this.loadAttachments()}return Object.defineProperty(e.prototype,"attachments",{get:function(){return this.groupware.attachments.attachments},enumerable:!0,configurable:!0}),e.prototype.loadAttachments=function(){var t=this;this.groupware.getAttachments().subscribe(function(e){t.changeDetectorRef.detectChanges()},function(e){console.log(e)})},e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-attachments",template:'<div *ngIf="attachments.length > 0" class="slds-p-around--x-small"><groupware-email-archive-pane-attachment *ngFor="let attachment of attachments" [attachment]="attachment"></groupware-email-archive-pane-attachment></div><div *ngIf="attachments.length == 0" class="slds-p-around--medium slds-align--absolute-center"><system-label label="MSG_NO_ATTACHMENTS_FOUND"></system-label></div>'}),__metadata("design:paramtypes",[GroupwareService,core_1.ChangeDetectorRef,services_1.language])],e)}();exports.GroupwareEmailArchivePaneAttachments=GroupwareEmailArchivePaneAttachments;var GroupwareEmailArchivePaneBeans=function(){function e(e,t){this.groupware=e,this.language=t,this.groupware.loadLinkedBeans()}return Object.defineProperty(e.prototype,"beans",{get:function(){return this.groupware.relatedBeans},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-beans",template:'<div *ngIf="beans.length > 0" class="slds-p-around--x-small slds-p-right--large" system-to-bottom><groupware-pane-bean *ngFor="let bean of beans" [bean]="bean" [system-model-provider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div><groupware-pane-no-beans-found *ngIf="beans.length == 0"></groupware-pane-no-beans-found>'}),__metadata("design:paramtypes",[GroupwareService,services_1.language])],e)}();exports.GroupwareEmailArchivePaneBeans=GroupwareEmailArchivePaneBeans;var GroupwareEmailArchivePaneLinked=function(){function e(e,t){this.groupware=e,this.language=t}return Object.defineProperty(e.prototype,"beans",{get:function(){return this.groupware.archiveto},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"attachments",{get:function(){return this.groupware.archiveattachments},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-linked",template:'<div *ngIf="beans.length > 0" system-to-bottom><h2 class="slds-p-vertical--xx-small slds-p-around--x-small slds-theme--shade"><system-label label="LBL_LINKED_TO_CRM"></system-label></h2><div class="slds-p-around--x-small"><groupware-pane-bean *ngFor="let bean of beans" [bean]="bean" [system-model-provider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div><ng-container *ngIf="attachments.length > 0"><h2 class="slds-p-vertical--xx-small slds-p-around--x-small slds-theme--shade"><system-label label="LBL_ATTACHMENTS"></system-label></h2><div class="slds-p-around--x-small"><groupware-email-archive-pane-attachment *ngFor="let attachment of attachments" [attachment]="attachment"></groupware-email-archive-pane-attachment></div></ng-container></div><div *ngIf="beans.length == 0" class="slds-p-around--medium slds-align--absolute-center" system-to-bottom-noscroll><system-label label="MSG_NO_RECORDS_SELECTED"></system-label></div>'}),__metadata("design:paramtypes",[GroupwareService,services_1.language])],e)}();exports.GroupwareEmailArchivePaneLinked=GroupwareEmailArchivePaneLinked;var GroupwareEmailArchivePaneSearch=function(){function e(e,t,a,s){this.backend=e,this.language=t,this.metadata=a,this.fts=s,this.searchTerm="",this.beans=[],this.searching=!1,this.searchTimeOut=void 0,this._searchmodule="all",this.autocompleteid=_.uniqueId()}return Object.defineProperty(e.prototype,"searchmodule",{get:function(){return this.language.getModuleName(this._searchmodule)},set:function(e){this._searchmodule=e,this.searchTerm&&this.searchSpice()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"moduleTitle",{get:function(){return"all"==this._searchmodule?this.language.getLabel("LBL_ALL"):this.searchmodule},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"searchmodules",{get:function(){for(var a=this,e=[],t=0,s=this.fts.searchModules;t<s.length;t++){var i=s[t],r=this.metadata.getModuleFields(i);for(var n in r)if("link"==r[n].type&&("emails"==n||"Emails"==r[n].module)){e.push(i);break}}return e.sort(function(e,t){return a.language.getModuleName(e)>a.language.getModuleName(t)?1:-1}),e},enumerable:!0,configurable:!0}),e.prototype.search=function(e){var t=this;switch(e.key){case"ArrowDown":case"ArrowUp":break;case"Enter":this.searchTerm.length&&(this.searchTimeOut&&window.clearTimeout(this.searchTimeOut),this.searchSpice());break;default:this.searchTimeOut&&window.clearTimeout(this.searchTimeOut),this.searchTimeOut=window.setTimeout(function(){return t.searchSpice()},1e3)}},e.prototype.searchSpice=function(){var l=this;this.searching=!0,this.beans=[];var e=[];"all"!=this._searchmodule?e.push(this._searchmodule):e=this.searchmodules,this.fts.searchByModules({searchterm:this.searchTerm,modules:e,size:10}).subscribe(function(e){for(var t=[],a=0,s=l.fts.moduleSearchresults;a<s.length;a++){var i=s[a];t=t.concat(i.data.hits)}t.sort(function(e,t){return e._score>t._score?-1:1});for(var r=0,n=t;r<n.length;r++){var o=n[r];l.beans.push({id:o._id,module:o._source._module?o._source._module:o._type,data:o._source})}l.searching=!1})},e=__decorate([core_1.Component({selector:"groupware-email-archive-pane-search",template:'<div class="slds-p-around--x-small" [system-overlay-loading-spinner]="searching"><div class="slds-form-element slds-grid slds-grid--vertical-align-center slds-grid--align-spread"><div system-dropdown-trigger-simple class="slds-dropdown-trigger slds-dropdown-trigger_click"><button class="slds-button slds-button--icon-border slds-m-right--xx-small" [title]="moduleTitle"><system-icon size="small" divClass *ngIf="_searchmodule != \'all\'" [module]="_searchmodule"></system-icon><system-utility-icon size="x-small" *ngIf="_searchmodule == \'all\'" icon="world"></system-utility-icon></button><div class="slds-dropdown slds-dropdown_left"><ul class="slds-listbox slds-listbox_vertical" role="group"><li role="presentation" class="slds-listbox__item" (click)="searchmodule = \'all\'"><div class="slds-media slds-listbox__option slds-listbox__option_plain slds-media_small" role="option"><div class="slds-media__figure slds-listbox__option-icon"><system-utility-icon icon="check" size="x-small" *ngIf="\'all\' == _searchmodule"></system-utility-icon></div><div class="slds-media__body"><div class="slds-truncate"><system-label label="LBL_ALL"></system-label></div></div></div></li><li *ngFor="let searchModule of searchmodules" role="presentation" (click)="searchmodule = searchModule" class="slds-listbox__item"><div class="slds-media slds-listbox__option slds-listbox__option_plain slds-media_small" role="option"><div class="slds-media__figure slds-listbox__option-icon"><system-utility-icon icon="check" size="x-small" *ngIf="searchModule == _searchmodule"></system-utility-icon></div><div class="slds-media__body"><div class="slds-truncate"><system-label-modulename [module]="searchModule"></system-label-modulename></div></div></div></li></ul></div></div><div class="slds-grow slds-form-element__control"><input type="text" id="search-term" autoComplete="off" [placeholder]="language.getLabel(\'LBL_SEARCH_SPICE\')" class="slds-input" [(ngModel)]="this.searchTerm" (keyup)="search($event)"></div></div><div class="slds-p-vertical--small slds-p-right--large" system-to-bottom><groupware-pane-bean *ngFor="let bean of beans" [bean]="bean" [system-model-provider]="{module: bean.module, id: bean.id, data: bean.data}"></groupware-pane-bean></div></div>'}),__metadata("design:paramtypes",[services_1.backend,services_1.language,services_1.metadata,services_1.fts])],e)}();exports.GroupwareEmailArchivePaneSearch=GroupwareEmailArchivePaneSearch;var GroupwareDetailPane=function(){function GroupwareDetailPane(e,t,a,s){this.groupware=e,this.router=t,this.broadcast=a,this.cdref=s,this.loading=!1,this.subscriptions=new rxjs_1.Subscription}return GroupwareDetailPane.prototype.ngOnInit=function(){var t=this;this.loadRecords(),this.subscriptions.add(this.broadcast.message$.subscribe(function(e){t.handleMessage(e)}))},GroupwareDetailPane.prototype.ngOnDestroy=function(){this.subscriptions.unsubscribe()},GroupwareDetailPane.prototype.handleMessage=function(e){switch(e.messagetype){case"groupware.itemchanged":this.loadRecords()}},GroupwareDetailPane.prototype.loadRecords=function(){var t=this;this.loading=!0,this.groupware.loadLinkedBeans().subscribe(function(e){1==e.length&&t.router.navigate(["/groupware/details/"+e[0].module+"/"+e[0].id]),t.loading=!1,t.cdref.detectChanges()},function(e){t.loading=!1})},GroupwareDetailPane.prototype.selectBean=function(e){this.router.navigate(["/groupware/details/"+e.module+"/"+e.id])},GroupwareDetailPane=__decorate([core_1.Component({selector:"groupware-detail-pane",template:'<div class="slds-page-header"><div class="slds-page-header__row"><div class="slds-page-header__col-title"><div class="slds-media"><system-icon icon="dynamic_record_choice"></system-icon><div class="slds-media__body"><div class="slds-page-header__name"><div class="slds-page-header__name-title"><h1><span class="slds-page-header__title slds-truncate"><system-label label="LBL_RECORDS"></system-label></span></h1></div></div><p class="slds-page-header__name-meta"><system-label [label]="loading ? \'LBL_SEARCHING\' : \'LBL_SELECT\'"></system-label></p></div></div></div></div></div><div *ngIf="!loading" class="slds-p-around--x-small"><groupware-detail-pane-bean *ngFor="let bean of groupware.relatedBeans" [bean]="bean" (selected)="selectBean($event)"></groupware-detail-pane-bean></div><groupware-pane-no-beans-found *ngIf="groupware.relatedBeans.length == 0 && !loading" class="slds-align--absolute-center" system-to-bottom-noscroll></groupware-pane-no-beans-found><div *ngIf="loading" class="slds-p-around--small slds-align--absolute-center"><system-spinner></system-spinner></div>'}),__metadata("design:paramtypes",[GroupwareService,router_1.Router,services_1.broadcast,core_1.ChangeDetectorRef])],GroupwareDetailPane)}();exports.GroupwareDetailPane=GroupwareDetailPane;var GroupwareDetailPanefooter=function(){function e(e,t,a,s,i){this.router=e,this.metadata=t,this.language=a,this.footer=s,this.elementRef=i,this._currentroute="groupware/mailitem"}return e.prototype.ngAfterViewInit=function(){this.setFooterHeight()},e.prototype.ngOnDestroy=function(){this.clearFooterHeight()},e.prototype.setFooterHeight=function(){var e=this.footerElement.nativeElement.getBoundingClientRect();this.footer.visibleFooterHeight=e.height},e.prototype.clearFooterHeight=function(){this.footer.visibleFooterHeight=0},e.prototype.callAction=function(e){this.router.navigate([e.actionconfig.route])},Object.defineProperty(e.prototype,"currentroute",{get:function(){return this._currentroute},set:function(e){e&&(this._currentroute=e,this.router.navigate([e]))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"actions",{get:function(){var e=this.metadata.getComponentConfig("OutlookPane");return e.actionset?this.metadata.getActionSetItems(e.actionset):[]},enumerable:!0,configurable:!0}),__decorate([core_1.ViewChild("footer",{static:!1}),__metadata("design:type",Object)],e.prototype,"footerElement",void 0),e=__decorate([core_1.Component({selector:"groupware-detail-pane-footer",template:'<div #footer class="slds-docked-form-footer"><div class="slds-size--1-of-1 slds-p-horizontal--xx-small slds-grid slds-grid--align-spread"><div system-dropdown-trigger-simple class="slds-dropdown-trigger slds-dropdown-trigger_click"><button class="slds-button slds-button_icon slds-button_icon-border-filled" aria-haspopup="true" title="Show More"><system-button-icon icon="rows"></system-button-icon></button><div class="slds-dropdown slds-dropdown--bottom slds-dropdown_left"><ul class="slds-dropdown__list" role="menu" aria-label="Show More"><li class="slds-dropdown__item" role="presentation" *ngFor="let action of actions" (click)="callAction(action)"><a href="javascript:void(0);" role="menuitem"><span class="slds-truncate" [title]="language.getLabel(action.actionconfig.label)"><system-label [label]="action.actionconfig.label"></system-label></span></a></li></ul></div></div></div></div>'}),__metadata("design:paramtypes",[router_1.Router,services_1.metadata,services_1.language,services_1.footer,core_1.ElementRef])],e)}();exports.GroupwareDetailPanefooter=GroupwareDetailPanefooter;var GroupwareDetailPaneHeader=function(t){function GroupwareDetailPaneHeader(){return null!==t&&t.apply(this,arguments)||this}return __extends(GroupwareDetailPaneHeader,t),GroupwareDetailPaneHeader.prototype.ngOnInit=function(){t.prototype.ngOnInit.call(this);var e=this.componentconfig&&!_.isEmpty(this.componentconfig)?this.componentconfig:this.metadata.getComponentConfig("GroupwareDetailPaneHeader",this.model.module);e.fieldset&&(this.fieldset=e.fieldset)},GroupwareDetailPaneHeader=__decorate([core_1.Component({selector:"groupware-detail-pane-header",template:'<div class="slds-page-header"><div class="slds-grid"><div class="slds-col slds-has-flexi-truncate"><div class="slds-media slds-no-space slds-grow"><system-icon [module]="moduleName" (click)="goToModule()"></system-icon><div class="slds-media__body"><p class="slds-text-title--caps slds-line-height--reset"><system-label-modulename [module]="moduleName"></system-label-modulename></p><div><h1 class="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate"><ng-container *ngIf="!fieldset">{{model.data.summary_text}}</ng-container><object-record-fieldset-horizontal-list *ngIf="fieldset" [fieldset]="fieldset" [system-view-provider]="{displayLabels: false}"></object-record-fieldset-horizontal-list></h1></div></div></div></div></div></div>',providers:[services_1.view]})],GroupwareDetailPaneHeader)}(objectcomponents_1.ObjectPageHeader);exports.GroupwareDetailPaneHeader=GroupwareDetailPaneHeader;var GroupwareDetailPaneBean=function(){function e(e,t,a,s,i,r){this.groupware=e,this.language=t,this.metadata=a,this.model=s,this.router=i,this.view=r,this.selected=new core_1.EventEmitter,this.view.displayLabels=!1}return e.prototype.ngOnInit=function(){this.model.module=this.bean.module,this.model.id=this.bean.id,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.bean.data);var e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);e&&e.mainfieldset&&(this.mainfieldsetfields=this.metadata.getFieldSetItems(e.mainfieldset)),e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))},e.prototype.onClick=function(e){this.selected.emit({module:this.bean.module,id:this.bean.id})},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"bean",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"selected",void 0),e=__decorate([core_1.Component({selector:"groupware-detail-pane-bean",template:'<article class="slds-tile slds-media slds-p-vertical--xx-small slds-has-divider--bottom" (click)="onClick($event)"><div class="slds-p-vertical--xx-small"><system-icon [module]="model.module" size="small"></system-icon></div><div class="slds-media__body"><div class="slds-grid slds-has-flexi-truncate"><span *ngIf="!mainfieldsetfields">{{model.data.summary_text}}</span><ul *ngIf="mainfieldsetfields" class="slds-list_horizontal slds-has-dividers_right slds-truncate"><ng-container *ngFor="let fieldsetitem of mainfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div><div class="slds-truncate slds-text-body_small" title="Bean Module"><ul class="slds-list_horizontal slds-has-dividers_right slds-truncate"><li class="slds-item"><system-label-modulename [module]="model.module" [singular]="true"></system-label-modulename></li><ng-container *ngFor="let fieldsetitem of subfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></div></div></article>',providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[GroupwareService,services_1.language,services_1.metadata,services_1.model,router_1.Router,services_1.view])],e)}();exports.GroupwareDetailPaneBean=GroupwareDetailPaneBean;var ModuleGroupware=function(){function ModuleGroupware(){}return ModuleGroupware=__decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,objectcomponents_1.ObjectComponents,directives_1.DirectivesModule,objectfields_1.ObjectFields],declarations:[GroupwarePaneBean,GroupwarePaneNoBeansFound,GroupwareDetailPaneView,GroupwareEmailArchivePaneAttachment,GroupwareEmailArchivePane,GroupwareEmailArchivePaneHeader,GroupwareEmailArchivePaneAttachments,GroupwareEmailArchivePaneBeans,GroupwareEmailArchivePaneLinked,GroupwareEmailArchivePaneSearch,GroupwareDetailPane,GroupwareDetailPanefooter,GroupwareDetailPaneHeader,GroupwareDetailPaneBean],exports:[GroupwareDetailPaneHeader]})],ModuleGroupware)}();exports.ModuleGroupware=ModuleGroupware;