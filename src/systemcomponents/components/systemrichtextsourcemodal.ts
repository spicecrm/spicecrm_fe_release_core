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
    Component,
    EventEmitter,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {language} from '../../services/language.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "./src/systemcomponents/templates/systemrichtextsourcemodal.html",
})
export class SystemRichTextSourceModal implements OnInit {

    public self: any = {};
    private _html: string = '';
    private html: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('sourceeditor') private sourceEditor: any;

    constructor(private language: language, private renderer: Renderer2, public sanitized: DomSanitizer) {
    }

    public ngOnInit() {
        this.renderer.setProperty(this.sourceEditor.nativeElement, 'innerText', this._html);
    }

    private onContentChange(html) {
        this._html = html;
    }

    get sanitizedHtml() {
        return this.sanitized.bypassSecurityTrustHtml(this._html);
    }

    private close() {
        this.html.emit(this._html);
        this.self.destroy();
    }
}
