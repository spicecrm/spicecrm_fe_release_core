/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Directive, Input, HostListener, OnDestroy, ElementRef, OnInit, Optional} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";


@Directive({
    selector: '[modelPopOver]',
})
export class ModelPopOverDirective implements OnInit, OnDestroy {
    @Input() private module: string;
    @Input() private id: string;
    private popoverCmp = null;
    private self: any = null;
    private showPopover: boolean = false;
    private showPopoverTimeout: any = {};
    private hidePopoverTimeout: any = {};

    constructor(
        private metadata: metadata,
        private footer: footer,
        @Optional() private model: model,
        private elementRef: ElementRef,
        private router: Router
    ) {

    }

    @HostListener('mouseenter')
    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }
    }

    @HostListener('click')
    private goRelated() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.id]);
    }

    private renderPopover() {
        this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer).subscribe(
            popover => {
                popover.instance.popovermodule = this.module;
                popover.instance.popoverid = this.id;
                popover.instance.parentElementRef = this.elementRef;

                this.popoverCmp = popover.instance;
            }
        );
    }

    public ngOnInit() {
        if (!this.module && this.model) {
            this.module = this.model.module;
        }
        if (!this.id && this.model) {
            this.id = this.model.id;
        }
    }

    public ngOnDestroy() {
        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}
