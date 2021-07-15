/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.02.001
 * date: 2021-07-15 21:59:12
 * build: 2021.02.001.1626379152634
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,s,t,n){var r,i=arguments.length,o=i<3?s:null===n?n=Object.getOwnPropertyDescriptor(s,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,s,t,n);else for(var l=e.length-1;0<=l;l--)(r=e[l])&&(o=(i<3?r(o):3<i?r(s,t,o):r(s,t))||o);return 3<i&&o&&Object.defineProperty(s,t,o),o},__metadata=this&&this.__metadata||function(e,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,s)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleCurrencies=exports.CurrencyList=exports.SystemCurrency=exports.AddCurrencyItem=exports.CurrencyManager=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),CurrencyManager=function(){function CurrencyManager(e,s,t,n,r,i,o,l){this.metadata=e,this.language=s,this.backend=t,this.currency=n,this.model=r,this.modal=i,this.toast=o,this.view=l,this.currencies=[],this.loading=!0}return CurrencyManager.prototype.ngOnInit=function(){var i=this;this.modal.openModal("SystemLoadingModal").subscribe(function(r){i.backend.getRequest("module/Currencies").subscribe(function(e){if(e)for(var s=0,t=e;s<t.length;s++){var n=t[s];i.currencies.push({id:n.id,name:n.name,iso:n.iso4217,symbol:n.symbol,conversion_rate:n.conversion_rate})}else i.toast.sendToast(i.language.getLabel("LBL_ERROR"),"error");i.loading=!1,r.instance.self.destroy()})})},CurrencyManager.prototype.reload=function(e){var t=this;e&&this.modal.openModal("SystemLoadingModal").subscribe(function(s){t.backend.getRequest("module/Currencies").subscribe(function(e){e?(t.currencies=e,t.currencies.shift()):t.toast.sendToast(t.language.getLabel("LBL_ERROR"),"error"),t.loading=!1,s.instance.self.destroy()})})},__decorate([core_1.Component({selector:"currency-manager",template:'<div *ngIf="!loading"><div class="slds-p-around--medium"><div class="slds-grid slds-grid--align-spread"><h2 class="slds-text-heading--medium"><system-label [label]="\'LBL_CURRENCY\'"></system-label></h2></div></div><div class="slds-p-vertical--small"><system-currency [currencies]="currencies"></system-currency></div><add-currency-item (new)="reload($event)"></add-currency-item><currency-list [currencies]="currencies"></currency-list></div>',providers:[services_1.view,services_1.model]}),__metadata("design:paramtypes",[services_1.metadata,services_1.language,services_1.backend,services_1.currency,services_1.model,services_1.modal,services_1.toast,services_1.view])],CurrencyManager)}();exports.CurrencyManager=CurrencyManager;var AddCurrencyItem=function(){function AddCurrencyItem(e,s,t,n){this.metadata=e,this.language=s,this.backend=t,this.toast=n,this.new=new core_1.EventEmitter,this.show=!1}return AddCurrencyItem.prototype.toggleShow=function(){this.show=!this.show},AddCurrencyItem.prototype.addCurrencyItem=function(){var s=this,e={name:this.name,iso:this.iso,symbol:this.symbol};this.backend.postRequest("module/Currencies/add",{},e).subscribe(function(e){e.status?s.new.emit(!0):s.toast.sendToast(s.language.getLabel("LBL_ERROR"),"error")})},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],AddCurrencyItem.prototype,"new",void 0),__decorate([core_1.Component({selector:"add-currency-item",template:'<div class="slds-p-around--medium"><h2 class="slds-text-title--caps"><system-label [label]="\'LBL_ADD\'"></system-label><system-button-icon [icon]="show ? \'chevrondown\' : \'chevronright\'" class="slds-p-left--small" (click)="toggleShow()"></system-button-icon></h2><div *ngIf="show" class="slds-grid slds-grid--align-spread slds-p-vertical--xx-small"><div class="slds-form-element"><system-label [label]="\'LBL_NAME\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="name"></div></div><div class="slds-form-element"><system-label [label]="\'LBL_ISO\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="iso"></div></div><div class="slds-form-element"><system-label [label]="\'LBL_SYMBOL\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="symbol"></div></div><button class="slds-button slds-button-icon slds-m-right_x-small" (click)="addCurrencyItem()"><system-button-icon icon="add"></system-button-icon></button></div></div>'}),__metadata("design:paramtypes",[services_1.metadata,services_1.language,services_1.backend,services_1.toast])],AddCurrencyItem)}();exports.AddCurrencyItem=AddCurrencyItem;var SystemCurrency=function(){function SystemCurrency(e,s,t,n,r,i){this.metadata=e,this.language=s,this.backend=t,this.modal=n,this.view=r,this.toast=i,this.currencies=[],this.loading=!1,this.defaultCurrency={},this.iso="",this.name="",this.symbol=""}return SystemCurrency.prototype.ngOnInit=function(){for(var e=0,s=this.currencies;e<s.length;e++){var t=s[e];-99==t.id&&(this.defaultCurrency=t)}this.iso=this.defaultCurrency.iso,this.name=this.defaultCurrency.name,this.symbol=this.defaultCurrency.symbol},Object.defineProperty(SystemCurrency.prototype,"editMode",{get:function(){return this.view.isEditMode()},enumerable:!1,configurable:!0}),SystemCurrency.prototype.edit=function(){this.view.isEditable=!0,this.view.setEditMode()},SystemCurrency.prototype.cancel=function(){this.view.setViewMode()},SystemCurrency.prototype.savePreference=function(){var s=this,e=[{name:"default_currency_iso4217",value:this.iso},{name:"default_currency_name",value:this.name},{name:"default_currency_symbol",value:this.symbol}];this.backend.postRequest("admin/writesettings",{},e).subscribe(function(e){e.status?s.defaultCurrency={iso:s.iso,name:s.name,symbol:s.symbol}:s.toast.sendToast(s.language.getLabel("LBL_ERROR"),"error")}),this.view.setViewMode()},__decorate([core_1.Input(),__metadata("design:type",Object)],SystemCurrency.prototype,"currencies",void 0),__decorate([core_1.Component({selector:"system-currency",template:'<system-spinner *ngIf="loading"></system-spinner><div *ngIf="!loading" class="slds-p-around--medium"><div><h2 class="slds-text-title--caps"><system-label label="LBL_SYSTEM_CURRENCY"></system-label></h2></div><div *ngIf="!editMode && defaultCurrency">{{defaultCurrency.name}} ({{defaultCurrency.symbol}})<system-button-icon icon="edit" class="slds-p-left--small" (click)="edit()"></system-button-icon></div><div *ngIf="editMode" class="slds-grid slds-grid--align-spread slds-p-vertical--xx-small"><div class="slds-form-element"><system-label [label]="\'LBL_NAME\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="name"></div></div><div class="slds-form-element"><system-label [label]="\'LBL_ISO\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="iso"></div></div><div class="slds-form-element"><system-label [label]="\'LBL_SYMBOL\'"></system-label><div class="slds-form-element__control"><input type="text" class="slds-input" [(ngModel)]="symbol"></div></div><button class="slds-button slds-button-icon slds-m-right_x-small" (click)="cancel()"><system-button-icon icon="close"></system-button-icon></button> <button class="slds-button slds-button-icon slds-m-right_x-small" (click)="savePreference()"><system-button-icon icon="save"></system-button-icon></button></div></div>'}),__metadata("design:paramtypes",[services_1.metadata,services_1.language,services_1.backend,services_1.modal,services_1.view,services_1.toast])],SystemCurrency)}();exports.SystemCurrency=SystemCurrency;var CurrencyList=function(){function CurrencyList(e,s,t,n){this.metadata=e,this.language=s,this.backend=t,this.modal=n,this.currencies=[]}return CurrencyList.prototype.ngOnInit=function(){this.currencies.shift()},__decorate([core_1.Input(),__metadata("design:type",Object)],CurrencyList.prototype,"currencies",void 0),__decorate([core_1.Component({selector:"currency-list",template:'<div class="slds-p-around--medium"><h2 class="slds-text-title--caps"><system-label label="LBL_CURRENCIES"></system-label></h2></div><table class="slds-table slds-table--bordered slds-table--cell-buffer"><thead><tr class="slds-text-title--caps"><th scope="col"><system-label label="LBL_NAME"></system-label></th><th scope="col"><system-label label="LBL_ISO"></system-label></th><th scope="col"><system-label label="LBL_SYMBOL"></system-label></th><th scope="col"><system-label label="LBL_CONVERSION_RATE"></system-label></th></tr></thead><tbody><tr style="vertical-align: middle" class="slds-align-top" *ngFor="let currency of currencies"><td>{{currency.name}}</td><td>{{currency.iso}}</td><td>{{currency.symbol}}</td><td>{{currency.conversion_rate}}</td></tr></tbody></table>'}),__metadata("design:paramtypes",[services_1.metadata,services_1.language,services_1.backend,services_1.modal])],CurrencyList)}();exports.CurrencyList=CurrencyList;var ModuleCurrencies=function(){function ModuleCurrencies(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[CurrencyManager,CurrencyList,AddCurrencyItem,SystemCurrency]})],ModuleCurrencies)}();exports.ModuleCurrencies=ModuleCurrencies;