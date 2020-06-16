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
 * @module SystemComponents
 */
import {
    NgModule
} from "@angular/core";
import {DragDropModule} from '@angular/cdk/drag-drop';

// interfaces
import /*embed*/ {InputRadioOptionI} from "./interfaces/systemcomponents.interfaces";

// MODULEs
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
// SERVICEs
import {metadata} from "../services/metadata.service";
import {VersionManagerService} from "../services/versionmanager.service";

import /*embed*/ {systemrichtextservice} from "./services/systemrichtext.service";

// Pipes...
import /*embed*/ {SystemModuleCustomPipe} from "./pipes/systemmodulecustompipe";
import /*embed*/ {SystemModuleGlobalPipe} from "./pipes/systemmoduleglobalpipe";

// COMPONENTs...
import /*embed*/ {PaginationControlsComponent, PaginationPipe} from "./components/pagination";
import /*embed*/ {SpeechRecognition} from "./components/speechrecognition";
import /*embed*/ {SystemActionIcon} from "./components/systemactionicon";
import /*embed*/ {SystemButtonCustomIcon} from "./components/systembuttoncustomicon";
import /*embed*/ {SystemButtonGroup} from "./components/systembuttongroup";
import /*embed*/ {SystemButtonIcon} from "./components/systembuttonicon";
import /*embed*/ {SystemCaptureImage} from "./components/systemcaptureimage";
import /*embed*/ {SystemCard} from "./components/systemcard";
import /*embed*/ {SystemCardHeader} from "./components/systemcardheader";
import /*embed*/ {SystemCardBody} from "./components/systemcardbody";
import /*embed*/ {SystemCardFooter} from "./components/systemcardfooter";
import /*embed*/ {SystemCheckboxGroup, SystemCheckboxGroupCheckbox} from "./components/systemcheckboxgroup";
import /*embed*/ {SystemCheckbox} from "./components/systemcheckbox";
import /*embed*/ {SystemCollabsableTab} from "./components/systemcollabsabletab";
import /*embed*/ {SystemComponentContainer} from "./components/systemcomponentcontainer";
import /*embed*/ {SystemComponentMissing} from "./components/systemcomponentmissing";
import /*embed*/ {SystemComponentSet} from "./components/systemcomponentset";
import /*embed*/ {SystemConfirmDialog} from "./components/systemconfirmdialog";
import /*embed*/ {SystemCustomIcon} from "./components/systemcustomicon";
import /*embed*/ {SystemDynamicComponent} from "./components/systemdynamiccomponent";
import /*embed*/ {SystemDynamicRouteContainer} from "./components/systemdynamicroutecontainer";
import /*embed*/ {SystemDynamicRouteInterceptor} from "./components/systemdynamicrouteinterceptor";
import /*embed*/ {SystemGooglePlacesAutocomplete} from "./components/systemgoogleplacesautocomplete";
import /*embed*/ {SystemGooglePlacesSearch} from "./components/systemgoogleplacessearch";
import /*embed*/ {SystemIcon} from "./components/systemicon";
import /*embed*/ {SystemFileIcon} from "./components/systemfileicon";
import /*embed*/ {SystemIllustrationNoAccess} from "./components/systemillustrationnoaccess";
import /*embed*/ {SystemIllustrationNoData} from "./components/systemillustrationnodata";
import /*embed*/ {SystemIllustrationNoRecords} from "./components/systemillustrationnorecords";
import /*embed*/ {SystemIllustrationNoTask} from "./components/systemillustrationnotask";
import /*embed*/ {SystemImagePreviewModal} from "./components/systemimagepreviewmodal";
import /*embed*/ {SystemInputText} from "./components/systeminputtext";
import /*embed*/ {SystemInputEnum} from "./components/systeminputenum";
import /*embed*/ {SystemInputMultiEnum} from "./components/systeminputmultienum";
import /*embed*/ {SystemInputInteger} from "./components/systeminputinteger";
import /*embed*/ {SystemInputActionset} from "./components/systeminputactionset";
import /*embed*/ {SystemInputComponentset} from "./components/systeminputcomponentset";
import /*embed*/ {SystemInputCountry} from "./components/systeminputcountry";
import /*embed*/ {SystemInputCountryCode} from "./components/systeminputcountrycode";
import /*embed*/ {SystemInputDatePicker} from "./components/systeminputdatepicker";
import /*embed*/ {SystemInputDate} from "./components/systeminputdate";
import /*embed*/ {SystemInputDelayed} from "./components/systeminputdelayed";
import /*embed*/ {SystemInputFieldset} from "./components/systeminputfieldset";
import /*embed*/ {SystemInputLabel} from "./components/systeminputlabel";
import /*embed*/ {SystemInputModule} from "./components/systeminputmodule";
import /*embed*/ {SystemInputModuleFilter} from "./components/systeminputmodulefilter";
import /*embed*/ {SystemInputModuleField} from "./components/systeminputmodulefield";
import /*embed*/ {SystemInputNumber} from "./components/systeminputnumber";
import /*embed*/ {SystemInputPassword} from "./components/systeminputpassword";
import /*embed*/ {SystemInputRadio} from "./components/systeminputradio";
import /*embed*/ {SystemInputRadioButtonGroup} from "./components/systeminputradiobuttongroup";
import /*embed*/ {SystemInputRelate} from "./components/systeminputrelate";
import /*embed*/ {SystemInputState} from "./components/systeminputstate";
import /*embed*/ {SystemInputTags} from "./components/systeminputtags";
import /*embed*/ {SystemInputTime} from "./components/systeminputtime";
import /*embed*/ {SystemInputCompanycodes} from "./components/systeminputcompanycodes";
import /*embed*/ {SystemInputBackendMethod} from "./components/systeminputbackendmethod";
import /*embed*/ {SystemLabel} from "./components/systemlabel";
import /*embed*/ {SystemLabelFieldname} from "./components/systemlabelfieldname";
import /*embed*/ {SystemLabelModulename} from "./components/systemlabelmodulename";
import /*embed*/ {SystemLanguageSelector} from "./components/systemlanguageselector";
import /*embed*/ {SystemLink} from "./components/systemlink";
import /*embed*/ {SystemLoaderProgress} from "./components/systemloaderprogress";
import /*embed*/ {SystemLoadingModal} from "./components/systemloadingmodal";
import /*embed*/ {SystemModalContent} from "./components/systemmodalcontent";
import /*embed*/ {SystemModalFooter} from "./components/systemmodalfooter";
import /*embed*/ {SystemModalHeaderRight} from "./components/systemmodalheaderright";
import /*embed*/ {SystemModalHeaderTagline} from "./components/systemmodalheadertagline";
import /*embed*/ {SystemModalHeader} from "./components/systemmodalheader";
import /*embed*/ {SystemModalWrapper} from "./components/systemmodalwrapper";
import /*embed*/ {SystemModal} from "./components/systemmodal";
import /*embed*/ {SystemNumberSpinner} from "./components/systemnumberspinner";
import /*embed*/ {SystemObjectPreviewModal} from "./components/systemobjectpreviewmodal";
import /*embed*/ {SystemProgressRing} from "./components/systemprogressring";
import /*embed*/ {SystemProgressBar} from "./components/systemprogressbar";
import /*embed*/ {SystemPrompt} from "./components/systemprompt";
import /*embed*/ {SystemRichTextEditor} from "./components/systemrichtexteditor";
import /*embed*/ {SystemRichTextEditorModal} from "./components/systemrichtexteditormodal";
import /*embed*/ {SystemRichTextSourceModal} from "./components/systemrichtextsourcemodal";
import /*embed*/ {SystemRoleSelector} from "./components/systemroleselector";
import /*embed*/ {SystemSection} from "./components/systemsection";
import /*embed*/ {SystemSelect} from "./components/systemselect";
import /*embed*/ {SystemSpinner} from "./components/systemspinner";
import /*embed*/ {SystemSplitView} from "./components/systemsplitview";
import /*embed*/ {SystemStencil} from "./components/systemstencil";
import /*embed*/ {SystemTableStencils} from "./components/systemtablestencils";
import /*embed*/ {SystemTinyMCEModal} from "./components/systemtinymcemodal";
import /*embed*/ {SystemTinyMCE} from "./components/systemtinymce";
import /*embed*/ {SystemToastContainer} from "./components/systemtoastcontainer";
import /*embed*/ {SystemTooltip} from "./components/systemtooltip";
import /*embed*/ {SystemTreeItem} from "./components/systemtreeitem";
import /*embed*/ {SystemTree} from "./components/systemtree";
import /*embed*/ {SystemUploadImage} from "./components/systemuploadimage";
import /*embed*/ {SystemPopover} from "./components/systempopover";
import /*embed*/ {SystemUtilityIcon} from "./components/systemutilityicon";
import /*embed*/ {SystemViewContainer} from "./components/systemviewcontainer";
import /*embed*/ {SystemIconHelpText} from "./components/systemiconhelptext";
import /*embed*/ {SystemMultipleSelect} from "./components/systemmultipleselect";

import /*embed*/ {PackageLoader} from "./components/packageloader";
import /*embed*/ {PackageLoaderPipe} from "./components/packageloaderpipe";
import /*embed*/ {PackageLoaderPackages} from "./components/packageloaderpackages";
import /*embed*/ {PackageLoaderPackage} from "./components/packageloaderpackage";
import /*embed*/ {PackageLoaderLanguages} from "./components/packageloaderlanguages";
import /*embed*/ {PackageLoaderLanguage} from "./components/packageloaderlanguage";

import /*embed*/ {SystemFilterBuilder} from "./components/systemfilterbuilder";
import /*embed*/ {SystemFilterBuilderFilterExpressionFields} from "./components/systemfilterbuilderfilterexpressionfields";
import /*embed*/ {SystemFilterBuilderFilterExpressionValue} from "./components/systemfilterbuilderfilterexpressionvalue";
import /*embed*/ {SystemFilterBuilderFilterExpressionValues} from "./components/systemfilterbuilderfilterexpressionvalues";
import /*embed*/ {SystemFilterBuilderFilterExpression} from "./components/systemfilterbuilderfilterexpression";
import /*embed*/ {SystemFilterBuilderFilterExpressionGroup} from "./components/systemfilterbuilderfilterexpressiongroup";
import /*embed*/ {SystemSelectUOM} from "./components/systemselectuom";
import /*embed*/ {SystemInputMedia} from './components/systeminputmedia';
import /*embed*/ {SystemInputTimezone} from './components/systeminputtimezone';
import /*embed*/ {SystemInputBase64} from './components/systeminputbase64';

import /*embed*/ {SystemModuleTree} from "./components/systemmoduletree";
import /*embed*/ {SystemModuleTreeItem} from "./components/systemmoduletreeitem";
import /*embed*/ {SystemTrendIndicator} from "./components/systemtrendindicator";
import /*embed*/ {SystemImageModal} from './components/systemimagemodal';
import /*embed*/ {SystemSlider} from "./components/systemslider";

import /*embed*/ {SystemNavigationCollector} from "./components/systemnavigationcollector";
import /*embed*/ {SystemNavigationManager} from "./components/systemnavigationmanager";
import /*embed*/ {SystemNavigationManagerRouteContainer} from "./components/systemnavigationmanagerroutecontainer";

@NgModule({
    imports: [
        DirectivesModule,
        CommonModule,
        FormsModule,
        DragDropModule
    ],
    declarations: [
        PackageLoader,
        PackageLoaderLanguage,
        PackageLoaderLanguages,
        PackageLoaderPackage,
        PackageLoaderPackages,
        PackageLoaderPipe,
        PaginationControlsComponent,
        PaginationPipe,
        SpeechRecognition,
        SystemActionIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemButtonIcon,
        SystemCaptureImage,
        SystemCard,
        SystemCardBody,
        SystemCardFooter,
        SystemCardHeader,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCollabsableTab,
        SystemComponentContainer,
        SystemComponentMissing,
        SystemComponentSet,
        SystemConfirmDialog,
        SystemCustomIcon,
        SystemDynamicComponent,
        SystemDynamicRouteContainer,
        SystemDynamicRouteInterceptor,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemIcon,
        SystemFileIcon,
        SystemIllustrationNoAccess,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemIllustrationNoTask,
        SystemImagePreviewModal,
        SystemInputText,
        SystemInputInteger,
        SystemInputEnum,
        SystemInputMultiEnum,
        SystemInputActionset,
        SystemInputComponentset,
        SystemInputCountry,
        SystemInputCountryCode,
        SystemInputDate,
        SystemInputDatePicker,
        SystemInputDelayed,
        SystemInputFieldset,
        SystemInputLabel,
        SystemInputModule,
        SystemInputModuleFilter,
        SystemInputModuleField,
        SystemInputNumber,
        SystemInputPassword,
        SystemInputRadio,
        SystemInputRadioButtonGroup,
        SystemInputRelate,
        SystemInputState,
        SystemInputTags,
        SystemInputTime,
        SystemInputCompanycodes,
        SystemInputBackendMethod,
        SystemInputBase64,
        SystemLabel,
        SystemLabelFieldname,
        SystemLabelModulename,
        SystemLanguageSelector,
        SystemLink,
        SystemLoaderProgress,
        SystemLoadingModal,
        SystemModal,
        SystemModalContent,
        SystemModalFooter,
        SystemModalHeader,
        SystemModalHeaderRight,
        SystemModalHeaderTagline,
        SystemModalWrapper,
        SystemModuleCustomPipe,
        SystemModuleGlobalPipe,
        SystemNumberSpinner,
        SystemObjectPreviewModal,
        SystemInputModuleFilter,
        SystemFilterBuilder,
        SystemFilterBuilderFilterExpressionGroup,
        SystemFilterBuilderFilterExpression,
        SystemFilterBuilderFilterExpressionFields,
        SystemFilterBuilderFilterExpressionValues,
        SystemFilterBuilderFilterExpressionValue,
        SystemPopover,
        SystemProgressRing,
        SystemProgressBar,
        SystemPrompt,
        SystemRichTextEditor,
        SystemRichTextEditorModal,
        SystemRichTextSourceModal,
        SystemRoleSelector,
        SystemSection,
        SystemSelect,
        SystemSpinner,
        SystemSplitView,
        SystemStencil,
        SystemTableStencils,
        SystemTinyMCE,
        SystemTinyMCEModal,
        SystemToastContainer,
        SystemTooltip,
        SystemTree,
        SystemTreeItem,
        SystemUploadImage,
        SystemUtilityIcon,
        SystemViewContainer,
        SystemIconHelpText,
        SystemMultipleSelect,
        SystemSelectUOM,
        SystemModuleTree,
        SystemModuleTreeItem,
        SystemSelectUOM,
        SystemInputMedia,
        SystemInputTimezone,
        SystemTrendIndicator,
        SystemSlider,
        SystemTrendIndicator,
        SystemImageModal,
        SystemNavigationCollector,
        SystemNavigationManager,
        SystemNavigationManagerRouteContainer
    ],
    entryComponents: [
        SystemDynamicRouteContainer,
        SystemNavigationCollector
    ],
    exports: [
        PaginationControlsComponent,
        PaginationPipe,
        SpeechRecognition,
        SystemActionIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemButtonIcon,
        SystemCard,
        SystemCardBody,
        SystemCardFooter,
        SystemCardHeader,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCollabsableTab,
        SystemComponentMissing,
        SystemComponentSet,
        SystemCustomIcon,
        SystemDynamicComponent,
        SystemFilterBuilderFilterExpression,
        SystemFilterBuilderFilterExpressionFields,
        SystemFilterBuilderFilterExpressionValues,
        SystemFilterBuilderFilterExpressionGroup,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemIcon,
        SystemFileIcon,
        SystemIllustrationNoAccess,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemIllustrationNoTask,
        SystemInputText,
        SystemInputInteger,
        SystemInputEnum,
        SystemInputMultiEnum,
        SystemInputActionset,
        SystemInputComponentset,
        SystemInputCountry,
        SystemInputCountryCode,
        SystemInputDate,
        SystemInputDatePicker,
        SystemInputDelayed,
        SystemInputFieldset,
        SystemInputLabel,
        SystemInputModule,
        SystemInputModuleFilter,
        SystemInputModuleField,
        SystemInputNumber,
        SystemInputPassword,
        SystemInputRadio,
        SystemInputRadioButtonGroup,
        SystemInputRelate,
        SystemInputState,
        SystemInputTags,
        SystemInputTime,
        SystemInputCompanycodes,
        SystemInputBackendMethod,
        SystemInputBase64,
        SystemLabel,
        SystemLabelFieldname,
        SystemLabelModulename,
        SystemLanguageSelector,
        SystemLink,
        SystemLoaderProgress,
        SystemModal,
        SystemModalContent,
        SystemModalFooter,
        SystemModalHeader,
        SystemModalHeaderRight,
        SystemModalHeaderTagline,
        SystemModalWrapper,
        SystemNumberSpinner,
        SystemProgressRing,
        SystemProgressBar,
        SystemPrompt,
        SystemRichTextEditor,
        SystemRoleSelector,
        SystemSection,
        SystemSelect,
        SystemSpinner,
        SystemSplitView,
        SystemStencil,
        SystemStencil,
        SystemTableStencils,
        SystemTinyMCE,
        SystemToastContainer,
        SystemTooltip,
        SystemTree,
        SystemTreeItem,
        SystemUtilityIcon,
        SystemViewContainer,
        SystemIconHelpText,
        SystemMultipleSelect,
        SystemInputModuleFilter,
        SystemFilterBuilder,
        SystemFilterBuilderFilterExpressionGroup,
        SystemFilterBuilderFilterExpression,
        SystemSelectUOM,
        SystemInputMedia,
        SystemSelectUOM,
        SystemModuleTree,
        SystemModuleTreeItem,
        SystemInputTimezone,
        SystemTrendIndicator,
        SystemSlider,
        SystemTrendIndicator,
        SystemImageModal,
        SystemNavigationCollector,
        SystemNavigationManager,
        SystemInputCountry,
        SystemInputState,
    ]
})
export class SystemComponents {
    private readonly version = "1.0";
    private readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
