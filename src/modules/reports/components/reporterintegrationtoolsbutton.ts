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
 * @module ModuleReports
 */
import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-tools-button',
    templateUrl: './src/modules/reports/templates/reporterintegrationtoolsbutton.html'
})
export class ReporterIntegrationToolsButton implements OnChanges, OnDestroy {

    @ViewChild('actionitems', {read: ViewContainerRef, static: true}) private actionitems: ViewContainerRef;

    @Input() private integrationParams: any = {};

    private clickListener: any;
    private opened: boolean = false;
    private actionComponents: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private footer: footer, private reporterconfig: reporterconfig, private renderer: Renderer2, private elementRef: ElementRef) {
    }

    public ngOnChanges() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'kqueryanalizer':
                        this.metadata.addComponent('ReporterIntegrationQueryanalyzerButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                }
            }
        }
    }

    public ngOnDestroy() {
        if (this.clickListener) this.clickListener();
    }

    get isDisabled() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'kqueryanalizer':
                        return false;
                }
            }
        }

        return true;
    }

    private toggleOpen() {
        this.opened = !this.opened;

        if (this.opened) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }


    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.opened = false;
            this.clickListener();
        }
    }
}