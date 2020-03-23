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
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,o){var i,n=arguments.length,l=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,s,o);else for(var a=e.length-1;0<=a;a--)(i=e[a])&&(l=(n<3?i(l):3<n?i(t,s,l):i(t,s))||l);return 3<n&&l&&Object.defineProperty(t,s,l),l},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),platform_browser_1=require("@angular/platform-browser"),SpiceNotes=function(){function SpiceNotes(e,t,s,o,i){this.model=e,this.language=t,this.session=s,this.backend=o,this.broadcast=i,this.newNote="",this._active=!1,this.isPrivate=!1,this.notes=[]}return SpiceNotes.prototype.ngOnInit=function(){this.getNotes()},SpiceNotes.prototype.getNotes=function(){var i=this;this.backend.getRequest("module/"+this.model.module+"/"+this.model.id+"/note").subscribe(function(e){for(var t=0,s=e;t<s.length;t++){var o=s[t];o.date=moment.utc(o.date),o.global="1"===o.global||!0===o.global,i.notes.push(o)}i.broadcastCount()})},SpiceNotes.prototype.addNote=function(){var i=this;this.backend.postRequest("module/"+this.model.module+"/"+this.model.id+"/note",{},{text:this.newNote,global:!this.isPrivate}).subscribe(function(e){for(var t=0,s=e;t<s.length;t++){var o=s[t];o.date=moment.utc(o.date),o.global="1"===o.global||!0===o.global,i.notes.unshift(o),i.newNote="",i.broadcastCount()}})},SpiceNotes.prototype.deleteNote=function(s){var o=this;this.backend.deleteRequest("module/"+this.model.module+"/"+this.model.id+"/note/"+s).subscribe(function(e){o.notes.some(function(e,t){if(e.id===s)return o.notes.splice(t,1),o.broadcastCount(),!0})})},SpiceNotes.prototype.broadcastCount=function(){this.broadcast.broadcastMessage("spicenotes.loaded",{module:this.model.module,id:this.model.id,spicenotescount:this.notes.length})},SpiceNotes.prototype.clearNote=function(){this.newNote="",this.isPrivate=!1},SpiceNotes.prototype.togglePrivate=function(){this.isPrivate=!this.isPrivate},SpiceNotes.prototype.getPrivateIcon=function(){return this.isPrivate?"lock":"unlock"},Object.defineProperty(SpiceNotes.prototype,"userimage",{get:function(){return this.session.authData.userimage},enumerable:!0,configurable:!0}),Object.defineProperty(SpiceNotes.prototype,"isActive",{get:function(){return this._active||""!==this.newNote},enumerable:!0,configurable:!0}),SpiceNotes.prototype.onFocus=function(){this._active=!0},SpiceNotes.prototype.onBlur=function(){this._active=!1},SpiceNotes=__decorate([core_1.Component({template:'<div class="slds-feed__item-comments"><div class="slds-media slds-comment slds-hint-parent"><div class="slds-media__figure"><span *ngIf="!userimage" class="slds-icon_container slds-icon-standard-empty slds-icon_container--circle"><system-utility-icon [icon]="\'user\'" [size]="\'x-small\'" [addclasses]="\'slds-icon\'" [colorclass]="\'\'"></system-utility-icon></span> <img style="height: 40px; width: 40px" *ngIf="userimage" [src]="userimage"></div><div class="slds-media__body"><div class="slds-publisher slds-publisher_comment" [ngClass]="{\'slds-is-active\':isActive}"><textarea class="slds-publisher__input slds-input_bare slds-text-longform" (focus)="onFocus()" (blur)="onBlur()" [placeholder]="language.getLabel(\'LBL_CREATENOTE\')" [(ngModel)]="newNote"></textarea><div class="slds-publisher__actions slds-grid slds-grid_align-spread"><ul class="slds-grid"><li><button class="slds-button slds-button_icon slds-button_icon-container" (click)="togglePrivate()"><system-utility-icon [icon]="getPrivateIcon()" [size]="\'xx-small\'"></system-utility-icon></button></li></ul><ul class="slds-grid"><li><button class="slds-button slds-button_icon slds-button_icon-container" (click)="clearNote()"><system-button-icon sprite="utility" icon="clear"></system-button-icon></button></li><li><button class="slds-button slds-button_icon slds-button_icon-container" (click)="addNote()"><system-button-icon sprite="utility" icon="check"></system-button-icon></button></li></ul></div></div></div></div></div><div class="slds-feed slds-p-top--small"><spice-note *ngFor="let note of notes" [note]="note" (deleteNote)="deleteNote(note.id)"></spice-note></div>'}),__metadata("design:paramtypes",[services_1.model,services_1.language,services_1.session,services_1.backend,services_1.broadcast])],SpiceNotes)}();exports.SpiceNotes=SpiceNotes;var SpiceNote=function(){function e(e,t,s,o){this.sanitized=e,this.session=t,this.backend=s,this.model=o,this.note={},this.isEditing=!1,this.deleteNote=new core_1.EventEmitter}return e.prototype.getNoteTimeFromNow=function(){return moment(this.note.date).fromNow()},e.prototype.delete=function(){this.deleteNote.emit()},e.prototype.saveNote=function(){this.isEditing=!1,this.backend.postRequest("module/"+this.model.module+"/"+this.model.id+"/note/"+this.note.id,{},{text:this.note.text,global:!this.note.global})},e.prototype.edit=function(){this.isEditing=!0},Object.defineProperty(e.prototype,"htmlValue",{get:function(){return this.sanitized.bypassSecurityTrustHtml(this.note.text)},enumerable:!0,configurable:!0}),e.prototype.hideDeleteButton=function(){return this.note.user_id!=this.session.authData.userId&&!this.session.authData.admin},e.prototype.togglePrivate=function(){this.note.global=!this.note.global},e.prototype.getPrivateIcon=function(){return this.note.global?"unlock":"lock"},__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"note",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"deleteNote",void 0),e=__decorate([core_1.Component({selector:"spice-note",template:'<article class="slds-post slds-border--bottom slds-p-top--small"><header class="slds-post__header slds-media"><div class="slds-media__figure"><span *ngIf="!note.user_image" class="slds-icon_container slds-icon-standard-empty slds-icon_container--circle"><system-utility-icon [icon]="\'user\'" [size]="\'x-small\'" [addclasses]="\'slds-icon\'" [colorclass]="\'\'"></system-utility-icon></span> <img style="height: 40px; width: 40px" *ngIf="note.user_image" [src]="note.user_image"></div><div *ngIf="!isEditing" class="slds-media__body"><div class="slds-grid slds-grid--align-spread slds-has-flexi-truncate"><p><a href="javascript:void(0);">{{note.user_name}}</a><ng-container *ngIf="!note.global">•<system-utility-icon [icon]="\'lock\'" [size]="\'xx-small\'"></system-utility-icon></ng-container></p><system-utility-icon class="slds-col--bump-left slds-p-horizontal--x-small" icon="edit" size="xx-small" (click)="edit()" *ngIf="!hideDeleteButton()"></system-utility-icon><system-utility-icon icon="delete" size="xx-small" (click)="delete()" *ngIf="!hideDeleteButton()"></system-utility-icon></div><p class="slds-text-body--small"><a href="javascript:void(0);" class="slds-text-link--reset">{{getNoteTimeFromNow()}}</a></p></div><div *ngIf="isEditing" class="slds-media__body"><div class="slds-publisher slds-publisher_comment slds-is-active"><textarea class="slds-publisher__input slds-input_bare slds-text-longform" style="height: 10rem;" [(ngModel)]="note.text"></textarea><div class="slds-publisher__actions slds-grid slds-grid_align-spread"><ul class="slds-grid"><li><button class="slds-button slds-button_icon slds-button_icon-container" (click)="togglePrivate()"><system-utility-icon [icon]="getPrivateIcon()" [size]="\'xx-small\'"></system-utility-icon></button></li></ul><ul class="slds-grid"><li><button class="slds-button slds-button_icon slds-button_icon-container" (click)="saveNote()"><system-button-icon sprite="utility" icon="check"></system-button-icon></button></li></ul></div></div></div></header><div *ngIf="!isEditing" [innerHTML]="htmlValue"></div></article>'}),__metadata("design:paramtypes",[platform_browser_1.DomSanitizer,services_1.session,services_1.backend,services_1.model])],e)}();exports.SpiceNote=SpiceNote;var SpiceNotesPanelHeader=function(){function SpiceNotesPanelHeader(e,t,s){var o=this;this.model=e,this.language=t,this.broadcast=s,this.broadcastSubscription={},this.notecount=0,this.broadcastSubscription=this.broadcast.message$.subscribe(function(e){o.handleMessage(e)})}return Object.defineProperty(SpiceNotesPanelHeader.prototype,"hasNotes",{get:function(){return 0<this.notecount},enumerable:!0,configurable:!0}),SpiceNotesPanelHeader.prototype.handleMessage=function(e){if(e.messagedata.module===this.model.module||e.messagedata.id===this.model.id)switch(e.messagetype){case"spicenotes.loaded":this.notecount=e.messagedata.spicenotescount}},SpiceNotesPanelHeader.prototype.ngOnDestroy=function(){this.broadcastSubscription.unsubscribe()},SpiceNotesPanelHeader=__decorate([core_1.Component({template:'<div class="slds-grid slds-grid--vertical-align-center"><span>{{language.getLabel(\'LBL_QUICKNOTES\')}}</span> <span *ngIf="hasNotes" class="slds-badge slds-theme_info slds-m-horizontal--xx-small">{{notecount}}</span></div>'}),__metadata("design:paramtypes",[services_1.model,services_1.language,services_1.broadcast])],SpiceNotesPanelHeader)}();exports.SpiceNotesPanelHeader=SpiceNotesPanelHeader;var ModuleSpiceNotes=function(){function ModuleSpiceNotes(){}return ModuleSpiceNotes=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule],declarations:[SpiceNotes,SpiceNote,SpiceNotesPanelHeader]})],ModuleSpiceNotes)}();exports.ModuleSpiceNotes=ModuleSpiceNotes;