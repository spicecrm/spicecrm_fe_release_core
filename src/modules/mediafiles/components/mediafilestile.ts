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
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    Component, Input,
    OnInit
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

/**
 * renders a tile for a media file
 */
@Component({
    selector: 'media-files-tile',
    templateUrl: './src/modules/mediafiles/templates/mediafilestile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model, view]
})
export class MediaFilesTile implements OnInit {

    /**
     * the data for the model
     */
    @Input() private data: any;

    /**
     * if this is rendered as a select box
     */
    @Input() private selectbox: boolean = false;

    /**
     * the fieldset to be rendered
     */
    private fieldset: string;

    /**
     * the actionset to be rendered
     */
    private actionset: string;

    constructor(private metadata: metadata, private model: model, private view: view, private sanitizer: DomSanitizer) {
        // load the config
        this.getConfig();
    }

    public ngOnInit(): void {
        // initializee the view
        this.initializeView();

        // initialize the model
        this.initializeModel();
    }

    /**
     * sets the view properties
     */
    private initializeView() {
        this.view.isEditable = false;
        this.view.displayLabels = false;

        if (this.selectbox == true) {
            this.view.displayLinks = false;
        }
    }

    /**
     * loads the config for the component
     */
    private getConfig() {
        let config = this.metadata.getComponentConfig('MediaFilesTile', 'MediaFiles');

        this.fieldset = config.fieldset;
        this.actionset = config.actionset;
    }

    /**
     * loads the model from teh data
     */
    private initializeModel() {
        this.model.module = 'MediaFiles';
        this.model.id = this.data.id;
        this.model.data = this.model.utils.backendModel2spice('MediaFiles', this.data);
    }

    /**
     * getter for the thumbnail
     */
    get thumbnail() {
        let thumbnail = this.model.getField('thumbnail');
        if (thumbnail) {
            return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + thumbnail);
        }
        return false;
    }

}
