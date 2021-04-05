/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 19:09:19
 * build: 2021.01.001.1617642559557
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,o){var i,l=arguments.length,a=l<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,s,o);else for(var d=e.length-1;0<=d;d--)(i=e[d])&&(a=(l<3?i(a):3<l?i(t,s,a):i(t,s))||a);return 3<l&&a&&Object.defineProperty(t,s,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleSpiceFavorites=exports.SpiceFavoritesItem=exports.SpiceFavoritesEditModal=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),SpiceFavoritesEditModal=function(){function SpiceFavoritesEditModal(e,t){this.favorite=e,this.language=t}return SpiceFavoritesEditModal.prototype.close=function(){this.self.destroy()},__decorate([core_1.Component({template:'<system-modal><system-modal-header (close)="close()"><system-label label="LBL_EDIT_FAVORITES"></system-label></system-modal-header><system-modal-content margin="none" [grow]="true"><spice-favorites-item role="presentation" class="slds-listbox__item" *ngFor="let item of favorite.favorites" [item]="item"></spice-favorites-item></system-modal-content><system-modal-footer><button class="slds-button slds-button--neutral" (click)="close()"><system-label label="LBL_CLOSE"></system-label></button></system-modal-footer></system-modal>'}),__metadata("design:paramtypes",[services_1.favorite,services_1.language])],SpiceFavoritesEditModal)}();exports.SpiceFavoritesEditModal=SpiceFavoritesEditModal;var SpiceFavoritesItem=function(){function e(e,t,s,o,i){this.model=e,this.language=t,this.metadata=s,this.view=o,this.favorite=i,this.item={},this.view.displayLabels=!1}return e.prototype.ngOnInit=function(){this.initializeModel(),this.loadConfig()},e.prototype.initializeModel=function(){this.model.module=this.item.module_name,this.model.id=this.item.item_id,this.model.data=this.model.utils.backendModel2spice(this.model.module,this.item.data)},e.prototype.loadConfig=function(){var e=this.metadata.getComponentConfig("GlobalHeaderSearchResultsItem",this.model.module);this.mainfieldset=e.mainfieldset,e&&e.subfieldset&&(this.subfieldsetfields=this.metadata.getFieldSetItems(e.subfieldset))},e.prototype.deleteFavorite=function(){this.favorite.deleteFavorite(this.model.module,this.model.id)},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"item",void 0),__decorate([core_1.Component({selector:"spice-favorites-item",template:'<div class="slds-lookup__item-action slds-media slds-media--center" role="option"><system-icon [module]="model.module" size="small"></system-icon><div class="slds-media__body"><div class="slds-lookup__result-text"><span *ngIf="!mainfieldset">{{model.data.summary_text}}</span><object-record-fieldset-horizontal-list [fieldset]="mainfieldset"></object-record-fieldset-horizontal-list></div><span class="slds-lookup__result-meta slds-text-body--small"><ul class="slds-list_horizontal slds-has-dividers_right slds-truncate"><li class="slds-item"><system-label-modulename [module]="model.module" [singular]="true"></system-label-modulename></li><ng-container *ngFor="let fieldsetitem of subfieldsetfields"><li *ngIf="model.getField(fieldsetitem.field)" class="slds-item"><field-container [field]="fieldsetitem.field" [fieldconfig]="fieldsetitem.fieldconfig" fielddisplayclass="slds-truncate"></field-container></li></ng-container></ul></span></div><button class="slds-button slds-button--icon slds-button--icon-border" (click)="deleteFavorite()"><system-button-icon icon="delete"></system-button-icon></button></div>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.model,services_1.language,services_1.metadata,services_1.view,services_1.favorite])],e)}();exports.SpiceFavoritesItem=SpiceFavoritesItem;var ModuleSpiceFavorites=function(){function ModuleSpiceFavorites(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[SpiceFavoritesEditModal,SpiceFavoritesItem]})],ModuleSpiceFavorites)}();exports.ModuleSpiceFavorites=ModuleSpiceFavorites;