/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    Output,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    OnDestroy,
    EventEmitter,
    ElementRef,
    ChangeDetectorRef,
    ApplicationRef,
    Pipe,
    forwardRef,
    Directive,
    Renderer2,
    SimpleChanges,
    OnChanges,
    Host,
    Injectable,
    Inject
} from "@angular/core";
import {Subject} from "rxjs";
import {Observable} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DOCUMENT} from "@angular/common";
import {DomSanitizer} from '@angular/platform-browser';

// MODULEs
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../directives/directives";
// SERVICEs
import {ActivatedRoute, Router} from "@angular/router";
import {metadata} from "../services/metadata.service";
import {toast} from "../services/toast.service";
import {language} from "../services/language.service";
import {backend} from "../services/backend.service";
import {VersionManagerService} from "../services/versionmanager.service";
import {configurationService} from "../services/configuration.service";
import {modal} from "../services/modal.service";
import {userpreferences} from "../services/userpreferences.service";
import {loader} from "../services/loader.service";
import {modelutilities} from "../services/modelutilities.service";
import {broadcast} from "../services/broadcast.service";
import {layout} from "../services/layout.service";


import /*embed*/ {systemrichtextservice} from "./services/systemrichtext.service";

// COMPONENTs...
import /*embed*/ {SystemIcon} from "./components/systemicon";
import /*embed*/ {SystemComponentContainer} from "./components/systemcomponentcontainer";
import /*embed*/ {SystemDynamicComponent} from "./components/systemdynamiccomponent";
import /*embed*/ {SystemUtilityIcon} from "./components/systemutilityicon";
import /*embed*/ {SystemStencil} from "./components/systemstencil";
import /*embed*/ {SystemTableStencils} from "./components/systemtablestencils";
import /*embed*/ {SystemSpinner} from "./components/systemspinner";
import /*embed*/ {SystemComponentMissing} from "./components/systemcomponentmissing";
import /*embed*/ {SystemDynamicRouteContainer} from "./components/systemdynamicroutecontainer";
import /*embed*/ {SystemTooltip} from "./components/systemtooltip";
import /*embed*/ {SystemToastContainer} from "./components/systemtoastcontainer";
import /*embed*/ {SystemButtonIcon} from "./components/systembuttonicon";
import /*embed*/ {SystemButtonCustomIcon} from "./components/systembuttoncustomicon";
import /*embed*/ {SystemButtonGroup} from "./components/systembuttongroup";
import /*embed*/ {SystemActionIcon} from "./components/systemactionicon";
import /*embed*/ {SystemConfirmDialog} from "./components/systemconfirmdialog";
import /*embed*/ {SystemTinyMCE} from "./components/systemtinymce";
import /*embed*/ {SystemTinyMCEModal} from "./components/systemtinymcemodal";
import /*embed*/ {SystemCaptureImage} from "./components/systemcaptureimage";
import /*embed*/ {SpeechRecognition} from "./components/speechrecognition";
import /*embed*/ {PaginationControlsComponent, PaginationPipe} from "./components/pagination";
import /*embed*/ {SystemPrompt} from "./components/systemprompt";
import /*embed*/ {SystemModalWrapper} from "./components/systemmodalwrapper";
import /*embed*/ {SystemLoadingModal} from "./components/systemloadingmodal";
import /*embed*/ {SystemLink} from "./components/systemlink";
import /*embed*/ {SystemModal} from "./components/systemmodal";
import /*embed*/ {SystemModalHeader} from "./components/systemmodalheader";
import /*embed*/ {SystemModalContent} from "./components/systemmodalcontent";
import /*embed*/ {SystemModalFooter} from "./components/systemmodalfooter";
import /*embed*/ {SystemCollabsableTab} from "./components/systemcollabsabletab";
import /*embed*/ {SystemCustomIcon} from "./components/systemcustomicon";
import /*embed*/ {SystemCheckbox} from "./components/systemcheckbox";
import /*embed*/ {SystemCard, SystemCardBody, SystemCardFooter, SystemCardHeaderTitle} from "./components/card";
import /*embed*/ {SystemTree} from "./components/systemtree";
import /*embed*/ {SystemTreeItem} from "./components/systemtreeitem";
import /*embed*/ {SystemSelect} from "./components/systemselect";
import /*embed*/ {SystemCheckboxGroup, SystemCheckboxGroupCheckbox} from "./components/systemcheckboxgroup";
import /*embed*/ {SystemSection} from "./components/systemsection";
import /*embed*/ {SystemRichTextEditor} from "./components/systemrichtexteditor";
import /*embed*/ {SystemRichTextSourceModal} from "./components/systemrichtextsourcemodal";
import /*embed*/ {SystemInputRadio} from "./components/systeminputradio";
import /*embed*/ {SystemInputTime} from "./components/systeminputtime";
import /*embed*/ {SystemInputDate} from "./components/systeminputdate";
import /*embed*/ {SystemInputDatePicker} from "./components/systeminputdatepicker";
import /*embed*/ {SystemGooglePlacesAutocomplete} from "./components/systemgoogleplacesautocomplete";
import /*embed*/ {SystemGooglePlacesSearch} from "./components/systemgoogleplacessearch";
import /*embed*/ {SystemComponentSet} from "./components/systemcomponentset";
import /*embed*/ {SystemProgressRing} from "./components/systemprogressring";
import /*embed*/ {SystemLoaderProgress} from "./components/systemloaderprogress";
import /*embed*/ {SystemIllustrationNoAccess} from "./components/systemillustrationnoaccess";
import /*embed*/ {SystemIllustrationNoTask} from "./components/systemillustrationnotask";
import /*embed*/ {SystemIllustrationNoData} from "./components/systemillustrationnodata";
import /*embed*/ {SystemIllustrationNoRecords} from "./components/systemillustrationnorecords";
import /*embed*/ {SystemInputLabel} from "./components/systeminputlabel";
import /*embed*/ {SystemUploadImage} from "./components/systemuploadimage";
import /*embed*/ {SystemImagePreviewModal} from "./components/systemimagepreviewmodal";
import /*embed*/ {SystemObjectPreviewModal} from "./components/systemobjectpreviewmodal";

import /*embed*/ {PackageLoader} from "./components/packageloader";
import /*embed*/ {PackageLoaderPipe} from "./components/packageloaderpipe";
import /*embed*/ {PackageLoaderPackages} from "./components/packageloaderpackages";
import /*embed*/ {PackageLoaderPackage} from "./components/packageloaderpackage";
import /*embed*/ {PackageLoaderLanguages} from "./components/packageloaderlanguages";
import /*embed*/ {PackageLoaderLanguage} from "./components/packageloaderlanguage";
import /*embed*/ {SystemInputNumber} from "./components/systeminputnumber";

@NgModule({
    imports: [
        DirectivesModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        SystemIcon,
        SystemComponentContainer,
        SystemDynamicComponent,
        SystemUtilityIcon,
        SystemStencil,
        SystemTableStencils,
        SystemSpinner,
        SystemComponentMissing,
        SystemDynamicRouteContainer,
        SystemTooltip,
        SystemToastContainer,
        SystemButtonIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemActionIcon,
        SystemConfirmDialog,
        SystemTinyMCE,
        SystemTinyMCEModal,
        SpeechRecognition,
        SystemCaptureImage,
        PaginationControlsComponent,
        PaginationPipe,
        SystemPrompt,
        SystemModalWrapper,
        SystemLoadingModal,
        SystemModal,
        SystemModalHeader,
        SystemModalContent,
        SystemModalFooter,
        SystemCollabsableTab,
        SystemLink,
        SystemCustomIcon,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCard,
        SystemCardHeaderTitle,
        SystemCardBody,
        SystemCardFooter,
        SystemTree,
        SystemTreeItem,
        SystemSelect,
        SystemSection,
        SystemRichTextEditor,
        SystemRichTextSourceModal,
        SystemInputTime,
        SystemInputNumber,
        SystemInputDate,
        SystemInputDatePicker,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemComponentSet,
        SystemProgressRing,
        SystemLoaderProgress,
        SystemUploadImage,
        PackageLoader,
        PackageLoaderPipe,
        PackageLoaderPackages,
        PackageLoaderPackage,
        PackageLoaderLanguages,
        PackageLoaderLanguage,
        SystemIllustrationNoAccess,
        SystemIllustrationNoTask,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemInputRadio,
        SystemInputLabel,
        SystemImagePreviewModal,
        SystemObjectPreviewModal
    ],
    entryComponents: [
        SystemDynamicRouteContainer
    ],
    exports: [
        SystemIcon,
        SystemUtilityIcon,
        SystemStencil,
        SystemTableStencils,
        SystemSpinner,
        SystemDynamicComponent,
        SystemComponentMissing,
        SystemTooltip,
        SystemToastContainer,
        SystemButtonIcon,
        SystemButtonCustomIcon,
        SystemButtonGroup,
        SystemActionIcon,
        SystemTinyMCE,
        SpeechRecognition,
        PaginationControlsComponent,
        PaginationPipe,
        SystemPrompt,
        SystemModalWrapper,
        SystemModal,
        SystemModalHeader,
        SystemModalContent,
        SystemModalFooter,
        SystemCollabsableTab,
        SystemLink,
        SystemCustomIcon,
        SystemCheckbox,
        SystemCheckboxGroup,
        SystemCheckboxGroupCheckbox,
        SystemCard,
        SystemCardHeaderTitle,
        SystemCardBody,
        SystemCardFooter,
        SystemTree,
        SystemTreeItem,
        SystemSelect,
        SystemSection,
        SystemRichTextEditor,
        SystemInputRadio,
        SystemInputTime,
        SystemInputNumber,
        SystemInputDate,
        SystemInputDatePicker,
        SystemGooglePlacesAutocomplete,
        SystemGooglePlacesSearch,
        SystemStencil,
        SystemComponentSet,
        SystemProgressRing,
        SystemLoaderProgress,
        SystemIllustrationNoAccess,
        SystemIllustrationNoTask,
        SystemIllustrationNoData,
        SystemIllustrationNoRecords,
        SystemInputLabel
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