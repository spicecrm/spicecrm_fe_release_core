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
 * release: 2020.04.001
 * date: 2020-12-15 15:48:36
 * build: 2020.04.001.1608043716338
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,s,l,o){var t,a=arguments.length,i=a<3?s:null===o?o=Object.getOwnPropertyDescriptor(s,l):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,s,l,o);else for(var c=e.length-1;0<=c;c--)(t=e[c])&&(i=(a<3?t(i):3<a?t(s,l,i):t(s,l))||i);return 3<a&&i&&Object.defineProperty(s,l,i),i},__metadata=this&&this.__metadata||function(e,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,s)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleGoogleAPI=exports.GoogleAPISettings=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),GoogleAPISettings=function(){function GoogleAPISettings(e,s,l,o){this.language=e,this.metadata=s,this.backend=l,this.modal=o,this.configvalues={},this.loading=!1,this.serviceuserscope={calendar:!1,gmail_radonly:!1,gmail_compose:!1,gmail_modify:!1,contacts:!1}}return GoogleAPISettings.prototype.ngOnInit=function(){var s=this;this.loading=!0,this.backend.getRequest("configurator/editor/googleapi").subscribe(function(e){s.configvalues=e,s.loadScope(),s.loading=!1})},GoogleAPISettings.prototype.save=function(){this.backend.postRequest("configurator/editor/googleapi",[],this.configvalues)},GoogleAPISettings.prototype.loadScope=function(){for(var e=0,s=this.configvalues.serviceuserscope.split(" ");e<s.length;e++){switch(s[e]){case"https://www.googleapis.com/auth/calendar":this.serviceuserscope.calendar=!0;break;case"https://www.googleapis.com/auth/contacts":this.serviceuserscope.contacts=!0;break;case"https://www.googleapis.com/auth/gmail.readonly":this.serviceuserscope.gmail_radonly=!0;break;case"https://www.googleapis.com/auth/gmail.compose":this.serviceuserscope.gmail_compose=!0;break;case"https://www.googleapis.com/auth/gmail.modify":this.serviceuserscope.gmail_modify=!0}}},GoogleAPISettings.prototype.setScope=function(){var e=[];this.serviceuserscope.calendar&&e.push("https://www.googleapis.com/auth/calendar"),this.serviceuserscope.contacts&&e.push("https://www.googleapis.com/auth/contacts"),this.serviceuserscope.gmail_radonly&&e.push("https://www.googleapis.com/auth/gmail.readonly"),this.serviceuserscope.gmail_compose&&e.push("https://www.googleapis.com/auth/gmail.compose"),this.serviceuserscope.gmail_modify&&e.push("https://www.googleapis.com/auth/gmail.modify"),this.configvalues.serviceuserscope=e.join(" ")},GoogleAPISettings=__decorate([core_1.Component({template:'<div class="slds-grid slds-grid_vertical-align-center slds-grid--align-spread slds-p-around--small slds-border--bottom"><h2 class="slds-text-heading_medium"><system-label label="LBL_GOOGLEAPI_SETTINGS"></system-label></h2><button class="slds-button slds-button--brand" (click)="save()"><system-label label="LBL_SAVE"></system-label></button></div><div [system-overlay-loading-spinner]="loading" class="slds-p-horizontal--small slds-theme--default" system-to-bottom-noscroll><div class="slds-grid slds-grid--vertical-align-center slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4" label="LBL_GOOGLE_MAPS_KEY"></system-label> <input type="text" class="slds-input slds-grow" [disabled]="loading" [(ngModel)]="configvalues.mapskey"></div><div class="slds-grid slds-grid--vertical-align-center slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4" label="LBL_GOOGLE_CLIENTID"></system-label> <input type="text" class="slds-input slds-grow" [disabled]="loading" [(ngModel)]="configvalues.clientid"></div><div class="slds-grid slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4 slds-p-vertical--xx-small" label="LBL_GOOGLE_CLIENTJSON"></system-label> <textarea class="slds-input slds-grow" rows="7" [disabled]="loading" [(ngModel)]="configvalues.calendarconfig"></textarea></div><div class="slds-grid slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4 slds-p-vertical--xx-small" label="LBL_GOOGLE_SERVICEUSERKEY"></system-label> <textarea class="slds-input slds-grow" rows="7" [disabled]="loading" [(ngModel)]="configvalues.serviceuserkey"></textarea></div><div class="slds-grid slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4 slds-p-vertical--xx-small" label="LBL_GOOGLE_SERVICEUSERSCOPE"></system-label><div class="slds-grow slds-form-element__control"><system-checkbox [(ngModel)]="serviceuserscope.calendar" (change)="setScope()" [disabled]="loading"><system-label label="LBL_GOOGLE_CALENDAR"></system-label></system-checkbox><system-checkbox [(ngModel)]="serviceuserscope.gmail_radonly" (change)="setScope()" [disabled]="loading"><system-label label="LBL_GOOGLE_GMAIL_READONLY"></system-label></system-checkbox><system-checkbox [(ngModel)]="serviceuserscope.gmail_compose" (change)="setScope()" [disabled]="loading"><system-label label="LBL_GOOGLE_GMAIL_COMPOSE"></system-label></system-checkbox><system-checkbox [(ngModel)]="serviceuserscope.gmail_modify" (change)="setScope()" [disabled]="loading"><system-label label="LBL_GOOGLE_GMAIL_MODIFY"></system-label></system-checkbox><system-checkbox [(ngModel)]="serviceuserscope.contacts" (change)="setScope()" [disabled]="loading"><system-label label="LBL_GOOGLE_CONTACTS"></system-label></system-checkbox></div></div><div class="slds-grid slds-grid--vertical-align-center slds-p-vertical--xx-small"><system-label class="slds-size--1-of-4" label="LBL_GOOGLE_NOTIFICATIONHOST"></system-label> <input type="text" class="slds-input slds-grow" [disabled]="loading" [(ngModel)]="configvalues.notificationhost"></div></div>'}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.backend,services_1.modal])],GoogleAPISettings)}();exports.GoogleAPISettings=GoogleAPISettings;var ModuleGoogleAPI=function(){function ModuleGoogleAPI(){}return ModuleGoogleAPI=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[GoogleAPISettings]})],ModuleGoogleAPI)}();exports.ModuleGoogleAPI=ModuleGoogleAPI;