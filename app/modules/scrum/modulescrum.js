/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 19:09:19
 * build: 2021.01.001.1617642559557
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,t,s,i){var r,o=arguments.length,c=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,s,i);else for(var d=e.length-1;0<=d;d--)(r=e[d])&&(c=(o<3?r(c):3<o?r(t,s,c):r(t,s))||c);return 3<o&&c&&Object.defineProperty(t,s,c),c},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},__param=this&&this.__param||function(s,i){return function(e,t){i(e,t,s)}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleScrum=exports.ScrumTree=exports.ScrumMain=exports.ScrumTreeEpic=exports.ScrumTreeUserStory=exports.ScrumTreeDetail=exports.ScrumTreeTheme=exports.ScrumTreeAddItem=exports.scrum=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),drag_drop_1=require("@angular/cdk/drag-drop"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),directives_1=require("../../directives/directives"),services_1=require("../../services/services"),scrum=function(){function e(e){this.backend=e,this.selectedObject$=new core_1.EventEmitter,this._selectedObject={id:void 0,type:""}}return Object.defineProperty(e.prototype,"selectedObject",{get:function(){return this._selectedObject},set:function(e){this._selectedObject=e,this.selectedObject$.emit(this._selectedObject)},enumerable:!1,configurable:!0}),e.prototype.onDrop=function(e,t,s){drag_drop_1.moveItemInArray(e.container.data,e.previousIndex,e.currentIndex);e=e.container.data.map(function(e,t){return{id:e.id,sequence:t}});this.backend.postRequest("module/"+t,{},e).subscribe(function(e){e&&e.length&&(s.items=s.items.map(function(e,t){return e.sequence=t,e}))})},__decorate([core_1.Injectable(),__metadata("design:paramtypes",[services_1.backend])],e)}();exports.scrum=scrum;var ScrumTreeAddItem=function(){function ScrumTreeAddItem(e,t){this.parent=e,this.model=t,this.title="",this.module="",this.newitem=new core_1.EventEmitter}return ScrumTreeAddItem.prototype.addItem=function(){var t=this;this.model.id=void 0,this.model.module=this.module,this.model.addModel("",this.parent).subscribe(function(e){t.newitem.emit(e)})},__decorate([core_1.Input(),__metadata("design:type",String)],ScrumTreeAddItem.prototype,"title",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],ScrumTreeAddItem.prototype,"module",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],ScrumTreeAddItem.prototype,"newitem",void 0),__decorate([core_1.Component({selector:"scrum-tree-additem",template:'<button [title]="title" class="slds-button slds-button-icon slds-m-right_x-small" (click)="addItem()"><system-button-icon icon="add"></system-button-icon></button>',providers:[services_1.model]}),__param(0,core_1.SkipSelf()),__metadata("design:paramtypes",[services_1.model,services_1.model])],ScrumTreeAddItem)}();exports.ScrumTreeAddItem=ScrumTreeAddItem;var ScrumTreeTheme=function(){function ScrumTreeTheme(e,t,s,i,r,o,c){this.scrum=e,this.language=t,this.modellist=s,this.metadata=i,this.model=r,this.backend=o,this.epics=c,this.epicsloaded=!1,this.theme={},this.disabled=!0,this.expanded=!1}return Object.defineProperty(ScrumTreeTheme.prototype,"title",{get:function(){return this.language.getLabel("LBL_ADD_EPIC")},enumerable:!1,configurable:!0}),ScrumTreeTheme.prototype.ngOnInit=function(){this.model.module="ScrumThemes",this.model.initialize(),this.model.id=this.theme.id,this.model.data=this.theme,this.epics.module=this.model.module,this.epics.id=this.model.id,this.epics.relatedModule="ScrumEpics",this.model.module&&this.metadata.checkModuleAcl(this.model.module,"create")&&(this.disabled=!1),this.has_epics=this.model.getField("has_epics")},ScrumTreeTheme.prototype.ngOnDestroy=function(){this.scrum.selectedObject.id==this.theme.id&&"ScrumThemes"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})},ScrumTreeTheme.prototype.selectTheme=function(){this.scrum.selectedObject={id:this.theme.id,type:"ScrumThemes"}},ScrumTreeTheme.prototype.loadRelatedEpics=function(){var t=this;this.epics.sort.sortfield="sequence",this.epics.loaditems=-99,this.epics.getData().subscribe(function(e){t.epicsloaded=!0})},ScrumTreeTheme.prototype.toggleExpand=function(){this.epicsloaded||this.loadRelatedEpics(),this.expanded=!this.expanded},ScrumTreeTheme.prototype.loadChanges=function(e){this.has_epics=!0,this.loadRelatedEpics()},__decorate([core_1.Input(),__metadata("design:type",Object)],ScrumTreeTheme.prototype,"theme",void 0),__decorate([core_1.Component({selector:"[scrum-tree-theme]",template:'<div class="slds-tree__item" [ngClass]="{\'slds-is-selected\': theme.id == scrum.selectedObject.id}" style="align-items: center"><button [disabled]="!has_epics" [ngClass]="{\'slds-hidden\': !has_epics}" class="slds-button slds-button-icon slds-m-right_x-small" (click)="toggleExpand()"><system-button-icon [icon]="epics.isloading ? \'spinner\' : \'chevronright\'"></system-button-icon></button> <span class="slds-has-flexi-truncate"><span class="slds-tree__item-label slds-truncate">{{theme.name}}</span></span><scrum-tree-additem [title]="title" (newitem)="loadChanges($event)" module="ScrumEpics"></scrum-tree-additem></div><system-spinner class="slds-p-around--xx-small" *ngIf="epics.isloading && has_epics"></system-spinner><ul role="group" class="scrum-tree-theme-drop-list" *ngIf="epics.items.length > 0" cdkDropList [cdkDropListData]="epics.items" cdkDropListLockAxis="y" (cdkDropListDropped)="this.scrum.onDrop($event, \'ScrumEpics\', epics)"><li *ngFor="let epic of epics.items" cdkDrag cdkDragBoundary=".scrum-tree-theme-drop-list" scrum-tree-epic [epic]="epic" aria-level="2" role="treeitem" class="slds-drag--preview" style="list-style: none"></li></ul>',providers:[services_1.model,services_1.relatedmodels],host:{"(click)":"selectTheme()","[attr.aria-expanded]":"expanded"}}),__metadata("design:paramtypes",[scrum,services_1.language,services_1.modellist,services_1.metadata,services_1.model,services_1.backend,services_1.relatedmodels])],ScrumTreeTheme)}();exports.ScrumTreeTheme=ScrumTreeTheme;var ScrumTreeDetail=function(){function ScrumTreeDetail(e,t,s,i,r,o){this.scrum=e,this.metadata=t,this.model=s,this.view=i,this.modal=r,this.language=o,this.focusid="",this.focustype=""}return ScrumTreeDetail.prototype.ngOnChanges=function(){var t=this;this.focusid&&this.focusid!=this.model.id?this.model.isDirty()?this.modal.confirm(this.language.getLabel("MSG_NAVIGATIONSTOP","","long"),this.language.getLabel("MSG_NAVIGATIONSTOP")).subscribe(function(e){e?(t.model.cancelEdit(),t.renderComponent(t.focusid)):t.scrum.selectedObject.id=t.model.id}):this.renderComponent(this.focusid):this.focusid||this.destroyContainer()},ScrumTreeDetail.prototype.renderComponent=function(e){this.model.id=e,this.model.module=this.focustype,this.model.getData();e=this.metadata.getComponentConfig("ScrumTreeDetail",this.model.module);this.componentset=e.componentset},ScrumTreeDetail.prototype.destroyContainer=function(){this.componentset&&(this.componentset=null,this.model.reset())},Object.defineProperty(ScrumTreeDetail.prototype,"canEdit",{get:function(){try{return this.model.checkAccess("edit")}catch(e){return!1}},enumerable:!1,configurable:!0}),__decorate([core_1.Input(),__metadata("design:type",String)],ScrumTreeDetail.prototype,"focusid",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],ScrumTreeDetail.prototype,"focustype",void 0),__decorate([core_1.Component({selector:"scrum-tree-detail",template:'<system-componentset [componentset]="componentset"></system-componentset>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[scrum,services_1.metadata,services_1.model,services_1.view,services_1.modal,services_1.language])],ScrumTreeDetail)}();exports.ScrumTreeDetail=ScrumTreeDetail;var ScrumTreeUserStory=function(){function ScrumTreeUserStory(e,t,s,i){this.metadata=e,this.model=t,this.modellist=s,this.scrum=i,this.userstory={}}return ScrumTreeUserStory.prototype.ngOnInit=function(){this.model.module="ScrumUserStories",this.model.initialize(),this.model.id=this.userstory.id,this.model.data=this.userstory},ScrumTreeUserStory.prototype.selectUserStory=function(e){e.stopPropagation(),this.scrum.selectedObject={id:this.userstory.id,type:"ScrumUserStories"}},ScrumTreeUserStory.prototype.ngOnDestroy=function(){this.scrum.selectedObject.id==this.userstory.id&&"ScrumUserStories"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})},__decorate([core_1.Input(),__metadata("design:type",Object)],ScrumTreeUserStory.prototype,"userstory",void 0),__decorate([core_1.Component({selector:"[scrum-tree-userstory]",template:'<div class="slds-tree__item" [ngClass]="{\'slds-is-selected\': userstory.id == scrum.selectedObject.id}"><span class="slds-has-flexi-truncate slds-p-left--medium"><span class="slds-tree__item-label slds-truncate">{{userstory.name}}</span></span></div>',providers:[services_1.model],host:{"(click)":"selectUserStory($event)"}}),__metadata("design:paramtypes",[services_1.metadata,services_1.model,services_1.modellist,scrum])],ScrumTreeUserStory)}();exports.ScrumTreeUserStory=ScrumTreeUserStory;var ScrumTreeEpic=function(){function ScrumTreeEpic(e,t,s,i,r,o){this.language=e,this.metadata=t,this.model=s,this.modellist=i,this.scrum=r,this.userstories=o,this.userstoriesloaded=!1,this.expanded=!1,this.disabled=!0,this.epic={}}return ScrumTreeEpic.prototype.ngOnInit=function(){this.model.module="ScrumEpics",this.model.initialize(),this.model.id=this.epic.id,this.model.data=this.epic,this.userstories.module=this.model.module,this.userstories.id=this.model.id,this.userstories.relatedModule="ScrumUserStories",this.model.module&&this.metadata.checkModuleAcl(this.model.module,"create")&&(this.disabled=!1),this.has_stories=this.model.getField("has_stories")},ScrumTreeEpic.prototype.loadRelatedUserStories=function(){var t=this;this.userstories.sort.sortfield="sequence",this.userstories.loaditems=-99,this.userstories.getData().subscribe(function(e){t.userstoriesloaded=!0})},ScrumTreeEpic.prototype.ngOnDestroy=function(){this.scrum.selectedObject.id==this.epic.id&&"ScrumEpics"==this.scrum.selectedObject.type&&(this.scrum.selectedObject={id:void 0,type:""})},ScrumTreeEpic.prototype.toggleExpand=function(){this.userstoriesloaded||this.loadRelatedUserStories(),this.expanded=!this.expanded},ScrumTreeEpic.prototype.selectEpic=function(e){e.stopPropagation(),this.scrum.selectedObject={id:this.epic.id,type:"ScrumEpics"}},ScrumTreeEpic.prototype.loadChanges=function(e){this.has_stories=!0,this.loadRelatedUserStories()},Object.defineProperty(ScrumTreeEpic.prototype,"title",{get:function(){return this.language.getLabel("LBL_ADD_USERSTORY")},enumerable:!1,configurable:!0}),__decorate([core_1.Input(),__metadata("design:type",Object)],ScrumTreeEpic.prototype,"epic",void 0),__decorate([core_1.Component({selector:"[scrum-tree-epic]",template:'<div class="slds-tree__item" [ngClass]="{\'slds-is-selected\': epic.id == scrum.selectedObject.id}" style="align-items: center"><button [disabled]="!has_stories" [ngClass]="{\'slds-hidden\': !has_stories}" class="slds-button slds-button-icon slds-m-right_x-small" (click)="toggleExpand()"><system-button-icon [icon]="userstories.isloading ? \'spinner\' : \'chevronright\'"></system-button-icon></button> <span class="slds-has-flexi-truncate"><span class="slds-tree__item-label slds-truncate">{{epic.name}}</span></span><scrum-tree-additem [title]="title" (newitem)="loadChanges($event)" module="ScrumUserStories"></scrum-tree-additem></div><system-spinner class="slds-p-around--xx-small" *ngIf="userstories.isloading && has_stories"></system-spinner><ul role="group" class="scrum-tree-epic-drop-list" cdkDropList [cdkDropListData]="userstories.items" cdkDropListLockAxis="y" (cdkDropListDropped)="this.scrum.onDrop($event, \'ScrumUserStories\', userstories)" *ngIf="userstories.items.length > 0"><li *ngFor="let userstory of userstories.items" cdkDrag cdkDragBoundary=".scrum-tree-epic-drop-list" class="slds-drag--preview" style="list-style: none" scrum-tree-userstory [userstory]="userstory" aria-level="3" role="treeitem"></li></ul>',providers:[services_1.model,services_1.relatedmodels],host:{"(click)":"selectEpic($event)","[attr.aria-expanded]":"expanded"}}),__metadata("design:paramtypes",[services_1.language,services_1.metadata,services_1.model,services_1.modellist,scrum,services_1.relatedmodels])],ScrumTreeEpic)}();exports.ScrumTreeEpic=ScrumTreeEpic;var ScrumMain=function(){function ScrumMain(e,t,s){this.scrum=e,this.modellist=t,this.language=s,this.loadList()}return ScrumMain.prototype.loadList=function(){this.modellist.getListData()},Object.defineProperty(ScrumMain.prototype,"text",{get:function(){return this.language.getLabel("LBL_SELECT_THEME")},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"scrum-main",template:'<div [system-overlay-loading-spinner]="modellist.isLoading" system-to-bottom-noscroll class="slds-grid"><div class="slds-border--right slds-theme_shade" style="min-width: 250px;" system-to-bottom><scrum-tree role="tree"></scrum-tree></div><div class="slds-grow" system-to-bottom><div class="slds-align_absolute-center" system-to-bottom-noscroll *ngIf="!scrum.selectedObject.id && !modellist.isLoading"><system-illustration-no-data>{{text}}</system-illustration-no-data></div><scrum-tree-detail [focusid]="scrum.selectedObject.id" [focustype]="scrum.selectedObject.type"></scrum-tree-detail></div></div>',providers:[scrum]}),__metadata("design:paramtypes",[scrum,services_1.modellist,services_1.language])],ScrumMain)}();exports.ScrumMain=ScrumMain;var ScrumTree=function(){function ScrumTree(e,t){this.scrum=e,this.modellist=t}return ScrumTree.prototype.trackbyfn=function(e,t){return t.id},__decorate([core_1.Component({selector:"scrum-tree",template:'<div class="slds-tree_container"><ul class="slds-tree" role="tree"><li *ngFor="let listItem of modellist.listData.list; trackBy: trackbyfn" role="treeitem" aria-level="1" scrum-tree-theme [theme]="listItem"></li></ul></div>'}),__metadata("design:paramtypes",[scrum,services_1.modellist])],ScrumTree)}();exports.ScrumTree=ScrumTree;var ModuleScrum=function(){function ModuleScrum(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule,drag_drop_1.DragDropModule],declarations:[ScrumMain,ScrumTree,ScrumTreeAddItem,ScrumTreeTheme,ScrumTreeEpic,ScrumTreeUserStory,ScrumTreeDetail],providers:[scrum]})],ModuleScrum)}();exports.ModuleScrum=ModuleScrum;