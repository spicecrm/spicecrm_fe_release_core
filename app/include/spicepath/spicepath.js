/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.02.001
 * date: 2021-07-15 21:59:12
 * build: 2021.02.001.1626379152634
 **/
"use strict";var __extends=this&&this.__extends||function(){var i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s])})(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function s(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(s.prototype=t.prototype,new s)}}(),__decorate=this&&this.__decorate||function(e,t,s,i){var a,n=arguments.length,o=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,i);else for(var l=e.length-1;0<=l;l--)(a=e[l])&&(o=(n<3?a(o):3<n?a(t,s,o):a(t,s))||o);return 3<n&&o&&Object.defineProperty(t,s,o),o},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModuleSpicePath=exports.SpiceKanbanTile=exports.SpiceKanban=exports.SpiceKanbanSumField=exports.SpicePathRelatedListTile=exports.SpicePathRelatedListTiles=exports.SpicePathWithCoaching=exports.SpicePathModel=exports.SpicePathTrack=exports.SpiceKanbanStagePipe=void 0;var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),drag_drop_1=require("@angular/cdk/drag-drop"),directives_1=require("../../directives/directives"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),services_1=require("../../services/services"),animations_1=require("@angular/animations"),operators_1=require("rxjs/operators"),rxjs_1=require("rxjs"),SpiceKanbanStagePipe=function(){function e(e,t){this.configuration=e,this.modellist=t}return e.prototype.transform=function(e,t){for(var s=[],i=this.getStageData(t),a=0,n=e;a<n.length;a++){var o=n[a];o[i.statusfield]&&o[i.statusfield]==t&&s.push(o)}return s},Object.defineProperty(e.prototype,"stages",{get:function(){return this.configuration.getData("spicebeanguides")?this.configuration.getData("spicebeanguides")[this.modellist.module].stages:[]},enumerable:!1,configurable:!0}),e.prototype.getStageData=function(t){var s=[];return this.stages.some(function(e){t==e.stage&&(s=e.stagedata)}),s},__decorate([core_1.Pipe({name:"spicekanbanstagepipe",pure:!1}),__metadata("design:paramtypes",[services_1.configurationService,services_1.modellist])],e)}();exports.SpiceKanbanStagePipe=SpiceKanbanStagePipe;var SpicePathTrack=function(){function e(e,t,s){this.configuration=e,this.model=t,this.language=s,this.beanGuideStatus="open",this._stages=[],this.activeStage$=new core_1.EventEmitter}return e.prototype.ngOnInit=function(){var t=this;this.model.data$.subscribe(function(e){t.buildstages(),t._modelstage!=t.model.getField(t.statusfield)&&(t._modelstage=t.model.getField(t.statusfield),t.activeStage=t._modelstage,t.activeStage$.emit(t._modelstage))})},e.prototype.buildstages=function(){var s=[],e=this.configuration.getData("spicebeanguides")?this.configuration.getData("spicebeanguides")[this.model.module].stages:[],i=this.model.getField(this.statusfield);this.beanGuideStatus="open";for(var a=this,t=0,n=e;t<n.length;t++)!function(t){var e;t.stagedata.stage_bucket?0<=(e=s.findIndex(function(e){return e.stagedata.stage_bucket==t.stagedata.stage_bucket}))?t.stage==i&&(s[e]={stage:t.stage,stagedata:_.clone(t.stagedata)},t.stagedata.spicebeanguide_status&&(a.beanGuideStatus=t.stagedata.spicebeanguide_status)):t.stage==i?(s.push({stage:t.stage,stagedata:_.clone(t.stagedata)}),t.stagedata.spicebeanguide_status&&(a.beanGuideStatus=t.stagedata.spicebeanguide_status)):((e={stage:t.stage,stagedata:_.clone(t.stagedata)}).stagedata.stage_label=t.stagedata.stage_bucket,s.push(e)):s.push({stage:t.stage,stagedata:_.clone(t.stagedata)})}(n[t]);this._stages=s},Object.defineProperty(e.prototype,"stages",{get:function(){return this._stages},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"statusfield",{get:function(){return this.configuration.getData("spicebeanguides")[this.model.module].statusfield},enumerable:!1,configurable:!0}),e.prototype.stageClass=function(t){var e,s,i=[],a=this.model.getField(this.statusfield);return"won"==this.beanGuideStatus&&"won"==t.stagedata.spicebeanguide_status?i.push("slds-is-won"):"won"==this.beanGuideStatus&&i.push("slds-is-complete"),"lost"==this.beanGuideStatus&&"lost"==t.stagedata.spicebeanguide_status?i.push("slds-is-lost"):"lost"==this.beanGuideStatus&&i.push("slds-is-incomplete"),(this.activeStage&&this.activeStage==t.stage||!this.activeStage&&a==t.stage)&&("lost"==this.beanGuideStatus?i.push("slds-is-current"):i.push("slds-is-active")),"open"==this.beanGuideStatus&&a&&((e=this.stages.findIndex(function(e){return e.stage==t.stage}))<(s=this.stages.findIndex(function(e){return e.stage==a}))&&i.push("slds-is-complete"),s<e&&i.push("slds-is-incomplete"),e==s&&-1==i.indexOf("slds-is-active")&&i.push("slds-is-current")),a||i.push("slds-is-incomplete"),i.join(" ")},e.prototype.setActiveStage=function(e){this.activeStage=e,this.activeStage$.emit(e)},e.prototype.getStageLabel=function(e){return e.stage_label?this.language.getLabel(e.stage_label):e.stage_name},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],e.prototype,"activeStage$",void 0),__decorate([core_1.Component({selector:"spice-path-track",template:'<div class="slds-grid slds-path__scroller-container"><div class="slds-path__scroller" role="application"><div class="slds-path__scroller_inner"><ul class="slds-path__nav" role="listbox" aria-orientation="horizontal"><li *ngFor="let stage of stages" class="slds-path__item" [ngClass]="stageClass(stage)" role="presentation"><a aria-selected="false" class="slds-path__link" href="javascript:void(0);" role="option" (click)="setActiveStage(stage.stage)"><span class="slds-path__stage"><system-utility-icon icon="check" size="x-small"></system-utility-icon></span> <span class="slds-path__title">{{getStageLabel(stage.stagedata)}}</span></a></li></ul></div></div></div>'}),__metadata("design:paramtypes",[services_1.configurationService,services_1.model,services_1.language])],e)}();exports.SpicePathTrack=SpicePathTrack;var SpicePathModel=function(){function e(){}return __decorate([core_1.Component({selector:"spice-path-model",template:'<div class="slds-path slds-p-vertical--small slds-scrollable--x"><spice-path-track></spice-path-track></div>'})],e)}();exports.SpicePathModel=SpicePathModel;var SpicePathWithCoaching=function(){function SpicePathWithCoaching(e,t,s,i,a){this.configuration=e,this.model=t,this.language=s,this.backend=i,this.metadata=a,this.coachingVisible=!1,this.componentconfig={},this.componentconfig=this.metadata.getComponentConfig("SpicePathWithCoaching",this.model.module),this.componentconfig&&this.componentconfig.coachingVisible&&(this.coachingVisible=this.componentconfig.coachingVisible)}return SpicePathWithCoaching.prototype.ngOnInit=function(){var t=this;this.backend.getRequest("common/spicebeanguide/"+this.model.module+"/"+this.model.id).subscribe(function(e){t.beanStagesChecksResults=e})},Object.defineProperty(SpicePathWithCoaching.prototype,"coachingIconStyle",{get:function(){return this.coachingVisible?{transform:"rotate(90deg)"}:{}},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"stages",{get:function(){return this.configuration.getData("spicebeanguides")[this.model.module].stages},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"statusfield",{get:function(){return this.configuration.getData("spicebeanguides")[this.model.module].statusfield},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"currentStage",{get:function(){return this.model.getField(this.statusfield)},enumerable:!1,configurable:!0}),SpicePathWithCoaching.prototype.toggleCoaching=function(){this.coachingVisible=!this.coachingVisible},SpicePathWithCoaching.prototype.setActiveStage=function(e){this.activeStage=e},Object.defineProperty(SpicePathWithCoaching.prototype,"displayStage",{get:function(){return this.activeStage||this.currentStage},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"checks",{get:function(){var t=this,s=[];return this.beanStagesChecksResults.some(function(e){if(e.stage===t.displayStage)return s=e.stagedata.checks,!0}),s},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"stageDescription",{get:function(){var t=this,e=this.stages.find(function(e){return e.stage==t.displayStage});return e?e.stagedata.stage_label?this.language.getLabel(e.stagedata.stage_label,"","long"):e.stagedata.stage_description:""},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathWithCoaching.prototype,"stageComponentset",{get:function(){var t=this,e=this.stages.find(function(e){return e.stage==t.displayStage});return e?e.stagedata.stage_componentset:""},enumerable:!1,configurable:!0}),__decorate([core_1.Component({selector:"spice-path-with-coaching",template:'<div class="slds-path slds-path_has-coaching slds-p-around--small"><div class="slds-grid slds-path__scroller-container"><button class="slds-button slds-button_icon slds-button_icon-border-filled slds-path__trigger" aria-expanded="false" style="box-shadow: none; border-radius: 20px;" [@coachingicon]="coachingVisible ? \'open\': \'closed\'" (click)="toggleCoaching()"><system-button-icon icon="chevronright"></system-button-icon></button><spice-path-track class="slds-grow" (activeStage$)="setActiveStage($event)"></spice-path-track></div><div @displaycoaching *ngIf="coachingVisible" class="slds-grid slds-grid--align-spread slds-gutters_direct-xx-small slds-p-top--medium slds-p-horizontal--xxx-small"><div class="slds-col slds-size--1-of-2"><ng-container *ngIf="checks.length > 0;else nochecks"><h2 class="slds-text-title--caps slds-p-bottom--small"><system-label label="LBL_CHECKS"></system-label></h2><dl class="slds-dl--horizontal"><ng-container *ngFor="let check of checks"><dt class="slds-coach__item slds-dl--horizontal__label"><system-utility-icon [icon]="check.result ? \'check\' : \'warning\'" [size]="\'x-small\'"></system-utility-icon></dt><dd class="slds-coach__value slds-dl--horizontal__detail">{{check.label ? language.getLabel(check.label) : check.name}}</dd></ng-container></dl></ng-container><ng-template #nochecks><div class="slds-height_full slds-align--absolute-center"><system-label label="LBL_NO_CHECKS_DEFINED"></system-label></div></ng-template></div><div class="slds-col slds-size--1-of-2"><h2 class="slds-text-title--caps slds-p-bottom--small slds-has-divider--bottom"><system-label label="LBL_DETAILS"></system-label></h2><div class="slds-has-divider--bottom slds-p-vertical--xx-small slds-text-align--justify" [innerHtml]="stageDescription"></div><system-componentset *ngIf="stageComponentset" [componentset]="stageComponentset"></system-componentset></div></div></div>',animations:[animations_1.trigger("displaycoaching",[animations_1.transition(":enter",[animations_1.style({opacity:0,height:"0px",overflow:"hidden"}),animations_1.animate(".5s",animations_1.style({height:"*",opacity:1})),animations_1.style({overflow:"unset"})]),animations_1.transition(":leave",[animations_1.style({overflow:"hidden"}),animations_1.animate(".5s",animations_1.style({height:"0px",opacity:0}))])]),animations_1.trigger("coachingicon",[animations_1.state("open",animations_1.style({transform:"rotate(90deg)"})),animations_1.state("closed",animations_1.style({transform:"rotate(0deg)"})),animations_1.transition("open => closed",[animations_1.animate(".5s")]),animations_1.transition("closed => open",[animations_1.animate(".5s")])])]}),__metadata("design:paramtypes",[services_1.configurationService,services_1.model,services_1.language,services_1.backend,services_1.metadata])],SpicePathWithCoaching)}();exports.SpicePathWithCoaching=SpicePathWithCoaching;var SpicePathRelatedListTiles=function(e){function SpicePathRelatedListTiles(){return null!==e&&e.apply(this,arguments)||this}return __extends(SpicePathRelatedListTiles,e),__decorate([core_1.Component({template:'<object-related-card [componentconfig]="componentconfig"><ng-container *ngIf="aclAccess; else noaccess"><div *ngFor="let relateditem of relatedmodels.items" class="slds-p-around--xx-small slds-size--1-of-1"><spice-path-related-list-tile class="slds-box slds-box--x-small slds-media slds-card__tile" [componentset]="componentconfig.componentset" [data]="relateditem" [module]="relatedmodels.relatedModule"></spice-path-related-list-tile></div></ng-container><ng-template #noaccess><system-illustration-no-access></system-illustration-no-access></ng-template></object-related-card>',providers:[services_1.relatedmodels]})],SpicePathRelatedListTiles)}(objectcomponents_1.ObjectRelatedList);exports.SpicePathRelatedListTiles=SpicePathRelatedListTiles;var SpicePathRelatedListTile=function(){function SpicePathRelatedListTile(e,t,s,i,a){this.model=e,this.relatedmodels=t,this.view=s,this.language=i,this.metadata=a,this.module="",this.data={},this.componentset="",this.componentconfig={}}return SpicePathRelatedListTile.prototype.ngOnInit=function(){this.model.module=this.module,this.model.id=this.data.id,this.model.data=this.data,this.componentconfig=this.metadata.getComponentConfig("SpicePathRelatedListTile",this.module)},Object.defineProperty(SpicePathRelatedListTile.prototype,"actionset",{get:function(){return this.componentconfig.actionset},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathRelatedListTile.prototype,"componentSetLeft",{get:function(){return this.componentconfig.left},enumerable:!1,configurable:!0}),Object.defineProperty(SpicePathRelatedListTile.prototype,"componentSetRight",{get:function(){return this.componentconfig.right},enumerable:!1,configurable:!0}),__decorate([core_1.Input(),__metadata("design:type",String)],SpicePathRelatedListTile.prototype,"module",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SpicePathRelatedListTile.prototype,"data",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],SpicePathRelatedListTile.prototype,"componentset",void 0),__decorate([core_1.Component({selector:"spice-path-related-list-tile",template:'<system-icon [module]="module" [size]="\'small\'"></system-icon><div class="slds-media__body"><div class="slds-grid slds-grid--align-spread slds-has-flexi-truncate"><h3 class="slds-truncate slds-text-heading--small slds-p-top--xxx-small slds-m-bottom--small" system-model-popover>{{data.summary_text}}</h3><div class="slds-shrink-none slds-show--medium"><object-action-menu [buttonsize]="\'x-small\'" [actionset]="actionset"></object-action-menu></div></div><div class="slds-tile__detail" style="margin-left: -2rem;"><spice-path-model></spice-path-model><div class="slds-text-body--small"><system-componentset *ngIf="componentset" [componentset]="componentset"></system-componentset></div></div><object-action-menu class="slds-hide--medium" [buttonsize]="\'x-small\'" [actionset]="actionset"></object-action-menu></div>',providers:[services_1.model,services_1.view]}),__metadata("design:paramtypes",[services_1.model,services_1.relatedmodels,services_1.view,services_1.language,services_1.metadata])],SpicePathRelatedListTile)}();exports.SpicePathRelatedListTile=SpicePathRelatedListTile;var SpiceKanbanSumField=function(){function e(){}return Object.defineProperty(e.prototype,"displayValue",{get:function(){return!this.value||isNaN(this.value)?0:this.value},enumerable:!1,configurable:!0}),__decorate([core_1.Input(),__metadata("design:type",Object)],e.prototype,"value",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"title",void 0),__decorate([core_1.Input(),__metadata("design:type",String)],e.prototype,"symbol",void 0),__decorate([core_1.Component({selector:"spice-kanban-sumfield",template:'<span>{{symbol}}</span><system-number-spinner style="cursor: default;" [title]="title" [value]="displayValue"></system-number-spinner>'})],e)}();exports.SpiceKanbanSumField=SpiceKanbanSumField;var SpiceKanban=function(){function SpiceKanban(e,t,s,i,a,n,o,l){this.broadcast=e,this.model=t,this.modellist=s,this.configuration=i,this.metadata=a,this.userpreferences=n,this.language=o,this.currency=l,this.componentconfig={},this.modellistsubscribe=void 0,this.stages=[],this.sumfields=[],this.hiddenstages=[],this.currencies=[],this.loadLabel=!1,this.componentconfig=this.metadata.getComponentConfig("SpiceKanban",this.modellist.module),this.currencies=this.currency.getCurrencies()}return SpiceKanban.prototype.ngOnInit=function(){var t=this;this.confdata=this.configuration.getData("spicebeanguides")[this.modellist.module];for(var e=[],s=0,i=this.confdata.stages;s<i.length;s++){var a=i[s];("1"==a.stagedata.not_in_kanban?this.hiddenstages:this.stages).push(a),e.push({bucket:a.stagedata.secondary_stage?a.stagedata.stage+" "+a.stagedata.secondary_stage:a.stage,values:{},items:0})}if(this.componentconfig.sumfield)for(var n=0,o=this.componentconfig.sumfield.split(",");n<o.length;n++){var l=o[n];(l=l.trim()).includes(":")?this.sumfields.push({name:l.substr(0,l.indexOf(":")),function:l.substr(l.indexOf(":")+1)}):this.sumfields.push({name:l,function:"sum"})}_.isEmpty(this.modellist.buckets)&&(this.modellist.buckets={bucketfield:this.confdata.statusfield,buckettotal:this.sumfields,bucketitems:e},this.modellist.getListData()),this.modellist.loadlimit=25,this.modellistsubscribe=this.modellist.listType$.pipe(operators_1.skip(1)).subscribe(function(e){return t.handleListTypeChange(e)})},SpiceKanban.prototype.ngOnDestroy=function(){this.modellistsubscribe.unsubscribe(),this.modellist.buckets={}},SpiceKanban.prototype.handleListTypeChange=function(e){"SpiceKanban"==e.listcomponent&&this.modellist.reLoadList()},Object.defineProperty(SpiceKanban.prototype,"draganddropenabled",{get:function(){return!!this.componentconfig.draganddrop},enumerable:!1,configurable:!0}),SpiceKanban.prototype.trackbyfn=function(e,t){return t.id},SpiceKanban.prototype.getStageData=function(t){return this.stages.find(function(e){return t==e.stage}).stagedata},Object.defineProperty(SpiceKanban.prototype,"sizeClass",{get:function(){return"slds-size--1-of-"+this.stages.length},enumerable:!1,configurable:!0}),SpiceKanban.prototype.getStageCount=function(e){try{var t=e.secondary_stage?e.stage+" "+e.secondary_stage:e.stage,s=this.modellist.buckets.bucketitems.find(function(e){return e.bucket==t});return s?s.total:0}catch(e){return 0}},SpiceKanban.prototype.getStageSum=function(e,t){try{var s,i="_bucket_agg_"+t.name,a=e.secondary_stage?e.stage+" "+e.secondary_stage:e.stage,n=this.modellist.buckets.bucketitems.find(function(e){return e.bucket==a});for(s in n.values){var o=n.values[s];if(s==i)return n.values?o:0}}catch(e){return 0}},SpiceKanban.prototype.getStageItems=function(e){for(var t=this.getStageData(e),s=[],i=0,a=this.modellist.listData.list;i<a.length;i++){var n=a[i];n[t.statusfield]&&0==n[t.statusfield].indexOf(e)&&s.push(n)}return s},SpiceKanban.prototype.getMoney=function(e){return this.userpreferences.formatMoney(parseFloat(e),0)},Object.defineProperty(SpiceKanban.prototype,"hasVisibleItems",{get:function(){var e=!1;if(this.modellist.buckets&&this.modellist.buckets.bucketitems)for(var s=this,t=0,i=this.modellist.buckets.bucketitems;t<i.length;t++)if("break"===function(t){if(0<=s.stages.findIndex(function(e){return e.stage==t.bucket})&&0<t.items)return e=!0,"break"}(i[t]))break;return e},enumerable:!1,configurable:!0}),SpiceKanban.prototype.loadmore=function(){if(this.modellist.isLoading)return!1;for(var e=!1,s=this,t=0,i=this.modellist.buckets.bucketitems;t<i.length;t++)if("break"===function(t){if(0<=s.stages.findIndex(function(e){return e.stage==t.bucket})&&t.total>t.items)return e=!0,"break"}(i[t]))break;e&&this.modellist.loadMoreList()},SpiceKanban.prototype.getStageLabel=function(e){return e.stage_label||e.stage_name},SpiceKanban.prototype.getCurrencySymbol=function(e){if("currency"==this.metadata.getFieldType(this.modellist.module,e.name)){var t;return this.currencies.some(function(e){if(-99==e.id)return t=e.symbol,!0}),t}},SpiceKanban.prototype.handleDrop=function(e){e.item.data[this.confdata.statusfield]!=e.container.data.stage&&(e.item.data._KanbanDrop={from:e.item.data[this.confdata.statusfield],to:e.container.data.stage},e.item.data[this.confdata.statusfield]=e.container.data.stage)},SpiceKanban.prototype.handleHiddenDrop=function(e){e.item.data[this.confdata.statusfield]!=e.container.data.stage&&(this.model.module=this.modellist.module,this.model.initialize(),this.model.id=e.item.data.id,this.model.data=this.model.utils.backendModel2spice(this.modellist.module,_.clone(e.item.data)),this.model.initializeFieldsStati(),this.model.startEdit(),this.model.setField(this.confdata.statusfield,e.container.data.stage),this.model.validate()?this.model.save():this.model.edit(),e.item.data[this.confdata.statusfield]=e.container.data.stage)},SpiceKanban.prototype.allowDrag=function(e){return this.draganddropenabled&&e.acl.edit},Object.defineProperty(SpiceKanban.prototype,"containerStyle",{get:function(){return this.kanbanUtilityBar?{"margin-bottom":this.kanbanUtilityBar.element.nativeElement.getBoundingClientRect().height+"px"}:{}},enumerable:!1,configurable:!0}),__decorate([core_1.ViewChild("kanbanUtilityBar",{read:core_1.ViewContainerRef,static:!(SpiceKanban.prototype.getTitle=function(e){return this.language.getLabel("LBL_"+e.name.toUpperCase())})}),__metadata("design:type",core_1.ViewContainerRef)],SpiceKanban.prototype,"kanbanUtilityBar",void 0),__decorate([core_1.Component({selector:"spice-kanban",template:'<div class="slds-m-top--small slds-m-horizontal--small"><div class="slds-tabs--path" role="application"><ul class="slds-tabs--path__nav" role="tablist"><ng-container *ngFor="let stage of stages"><li class="slds-tabs--path__item slds-is-incomplete" role="presentation"><a class="slds-tabs--path__link" aria-selected="false" role="tab" href="javascript:void(0);" aria-live="assertive"><span class="slds-tabs--path__stage"><system-utility-icon icon="check" size="x-small"></system-utility-icon></span> <span class="slds-tabs--path__title"><system-label [label]="getStageLabel(stage.stagedata)"></system-label> ({{getStageCount(stage.stagedata)}})</span></a></li></ng-container></ul></div><div *ngIf="this.componentconfig.sumfield" class="slds-grid slds-border--bottom"><div *ngFor="let stage of stages" class="slds-col slds-p-horizontal--xx-small slds-m-top--x-small" [ngClass]="sizeClass"><div class="slds-text-heading--medium slds-p-vertical--x-small" [ngClass]="{\'slds-text-color--inverse-weak\': modellist.isLoading}"><ul class="slds-list_horizontal slds-has-dividers_right slds-align_absolute-center"><li *ngFor="let sumfield of sumfields" class="slds-item"><spice-kanban-sumfield [symbol]="getCurrencySymbol(sumfield)" [title]="getTitle(sumfield)" [value]="getStageSum(stage.stagedata, sumfield)"></spice-kanban-sumfield></li></ul></div></div></div><div (system-to-bottom)="loadmore()" class="slds-scrollable--y kanbancontainer" cdkDropListGroup [ngStyle]="containerStyle"><div class="slds-grid"><div *ngFor="let stage of stages" class="slds-col slds-p-horizontal--xx-small slds-m-top--x-small" [ngClass]="sizeClass" (cdkDropListDropped)="handleDrop($event)" cdkDropList [cdkDropListData]="stage"><div *ngFor="let item of this.modellist.listData.list|spicekanbanstagepipe:stage.stage;trackBy:trackbyfn" cdkDrag [cdkDragDisabled]="!allowDrag(item)" [cdkDragData]="item" class="slds-m-vertical--xx-small slds-kanban-drag--preview"><spice-kanban-tile [item]="item"></spice-kanban-tile></div></div></div><div class="slds-p-around--small"><system-spinner *ngIf="modellist.isLoading"></system-spinner></div><div *ngIf="!modellist.isLoading && !hasVisibleItems" class="slds-height_full slds-align--absolute-center"><system-illustration-no-records><system-label label="MSG_NO_RECORDS_FOUND"></system-label></system-illustration-no-records></div><div *ngIf="hiddenstages.length > 0" class="slds-utility-bar_container" aria-label="Utility Bar"><div #kanbanUtilityBar class="slds-utility-bar" style="height: 3rem;"><div class="slds-grid slds-size--1-of-1 slds-grid--align-spread"><div></div><div class="slds-utility-bar__item slds-p-horizontal--x-small"><div *ngFor="let stage of hiddenstages" class="slds-box--border slds-m-around--xxx-small slds-align--absolute-center slds-theme--info" (cdkDropListDropped)="handleHiddenDrop($event)" cdkDropList [cdkDropListData]="stage"><div class="slds-p-horizontal--medium slds-p-vertical--small slds-grid"><div class="slds-p-right--xx-small" [ngClass]="{\'slds-has-divider--right\': sumfields.length > 0}"><system-label [label]="getStageLabel(stage.stagedata)"></system-label> ({{getStageCount(stage.stagedata)}})</div><ul class="slds-list_horizontal slds-has-dividers_right slds-align_absolute-center"><li *ngFor="let sumfield of sumfields" class="slds-item"><spice-kanban-sumfield [symbol]="getCurrencySymbol(sumfield)" [title]="getTitle(sumfield)" [value]="getStageSum(stage.stagedata, sumfield)"></spice-kanban-sumfield></li></ul></div></div></div></div></div></div></div></div>',providers:[services_1.model]}),__metadata("design:paramtypes",[services_1.broadcast,services_1.model,services_1.modellist,services_1.configurationService,services_1.metadata,services_1.userpreferences,services_1.language,services_1.currency])],SpiceKanban)}();exports.SpiceKanban=SpiceKanban;var SpiceKanbanTile=function(){function SpiceKanbanTile(e,t,s,i,a,n){this.modellist=e,this.model=t,this.view=s,this.metadata=i,this.broadcast=a,this.changeDetectorRef=n,this.item={},this.componentconfig={},this.componentFields={},this.subscriptions=new rxjs_1.Subscription,this.componentconfig=this.metadata.getComponentConfig("SpiceKanbanTile",this.modellist.module),this.componentFields=this.metadata.getFieldSetFields(this.componentconfig.fieldset),this.view.labels="short",this.view.displayLabels=!1}return SpiceKanbanTile.prototype.ngOnInit=function(){var t=this;this.model.module=this.modellist.module,this.model.id=this.item.id,this.model.data=this.model.utils.backendModel2spice(this.modellist.module,_.clone(this.item)),this.model.initializeFieldsStati(),this.item._KanbanDrop?(this.model.setField(this.modellist.bucketfield,this.item._KanbanDrop.from),this.model.startEdit(),this.model.setField(this.modellist.bucketfield,this.item._KanbanDrop.to),this.model.validate()?this.model.save().subscribe(function(e){delete t.item._KanbanDrop,t.subscribeToSave()}):(this.model.edit().subscribe(function(e){!1===e&&(t.item[t.modellist.bucketfield]=t.item._KanbanDrop.from),delete t.item._KanbanDrop}),this.subscribeToSave())):this.subscribeToSave(),this.subscriptions.add(this.model.data$.subscribe(function(e){t.changeDetectorRef.detectChanges()}))},Object.defineProperty(SpiceKanbanTile.prototype,"hasNotification",{get:function(){return this.model.getField("has_notification")},enumerable:!1,configurable:!0}),Object.defineProperty(SpiceKanbanTile.prototype,"headerFieldset",{get:function(){return this.componentconfig.headerfieldset},enumerable:!1,configurable:!0}),SpiceKanbanTile.prototype.subscribeToSave=function(){var t=this;this.modelSubscription=this.model.saved$.subscribe(function(e){t.changeDetectorRef.detectChanges()})},SpiceKanbanTile.prototype.subscribeToBroadcast=function(){var t=this;this.modelSubscription=this.model.saved$.subscribe(function(e){t.changeDetectorRef.detectChanges()})},SpiceKanbanTile.prototype.ngOnDestroy=function(){this.subscriptions.unsubscribe(),this.modelSubscription&&this.modelSubscription.unsubscribe()},SpiceKanbanTile.prototype.goDetail=function(){this.model.goDetail()},__decorate([core_1.Input(),__metadata("design:type",Object)],SpiceKanbanTile.prototype,"item",void 0),__decorate([core_1.Component({selector:"spice-kanban-tile",template:'<div class="slds-tile slds-box--border slds-theme--default"><div class="slds-p-around--x-small" [system-overlay-loading-spinner]="model.isSaving"><div class="slds-grid slds-grid--vertical-align-center"><div *ngIf="hasNotification" class="slds-p-right--x-small"><system-utility-icon icon="warning" addclasses="slds-icon-text-warning" size="x-small"></system-utility-icon></div><ng-container *ngIf="headerFieldset; else noheaderfieldset"><object-record-fieldset-horizontal-list [fieldset]="headerFieldset" class="slds-truncate"></object-record-fieldset-horizontal-list></ng-container><ng-template #noheaderfieldset><h3 class="slds-truncate" (click)="goDetail()"><a href="javascript:void(0);">{{model.getField(\'summary_text\')}}</a></h3></ng-template><object-action-menu class="slds-col_bump-left" buttonsize="x-small"></object-action-menu></div><div class="slds-tile__detail slds-text-body--small"><div class="slds-p-vertical--x-small"><field-container *ngIf="componentconfig.amount" [field]="componentconfig.amount" [fielddisplayclass]="\'slds-text-heading--medium\'"></field-container></div><div class="slds-grid" *ngFor="let componentField of componentFields"><field-label class="slds-truncate" [fieldname]="componentField.field" [fieldconfig]="componentField.fieldconfig"></field-label><field-container class="slds-col--bump-left slds-truncate" [field]="componentField.field" [fieldconfig]="componentField.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></div></div></div></div>',providers:[services_1.model,services_1.view],host:{"[class]":"'slds-item'"},changeDetection:core_1.ChangeDetectionStrategy.OnPush}),__metadata("design:paramtypes",[services_1.modellist,services_1.model,services_1.view,services_1.metadata,services_1.broadcast,core_1.ChangeDetectorRef])],SpiceKanbanTile)}();exports.SpiceKanbanTile=SpiceKanbanTile;var ModuleSpicePath=function(){function ModuleSpicePath(){}return __decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents,directives_1.DirectivesModule,drag_drop_1.DragDropModule],declarations:[SpicePathTrack,SpicePathModel,SpicePathWithCoaching,SpicePathRelatedListTiles,SpicePathRelatedListTile,SpiceKanbanStagePipe,SpiceKanbanSumField,SpiceKanban,SpiceKanbanTile]})],ModuleSpicePath)}();exports.ModuleSpicePath=ModuleSpicePath;