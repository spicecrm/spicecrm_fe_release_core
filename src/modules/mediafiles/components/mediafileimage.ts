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
 * @module ModuleMediaFiles
 */
import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';

@Component({
    selector: 'media-file-image',
    templateUrl: './src/modules/mediafiles/templates/mediafileimage.html',
    providers: [ mediafiles ],
    styles: [
        'img.withFrameHeight { position:absolute; top:0; left:0; bottom:0; right:0; margin:auto; }'
    ]
})
export class MediaFileImage implements OnChanges {

    @Input() media_id: string;
    @Input() variant: string;
    @Input() classImage: string = '';
    @Input() classOuter: string = '';
    @Input() styleImage: string = '';
    @Input() align: string = '';
    @Input() size: number = null;
    @Input() width: number = null;
    @Input() height: number = null;
    @Input() frameWidth: number = null;
    @Input() frameHeight: number = null;
    @Input() frameSize: number = null;
    @Input() displayInline: boolean = false;
    @Input() title: string = '';
    @Input() alttext: string = '';

    imageUrl: any;

    dimensions: any = {};

    isFirstChange: boolean = true;
    variantStatic: string;
    lastMediaId: string = '';

    withFrameHeight = true;

    constructor ( private mediafiles: mediafiles, private elRef:ElementRef ) {}

    ngOnChanges() {

        if ( this.isFirstChange ) {
            this.isFirstChange = false;
            this.variantStatic = this.variant;
        }

        if( this.variantStatic === 'mw' || this.variantStatic === 'mwh' ) {

            if ( this.width != null ) this.dimensions.width = this.width;
            if ( this.height != null ) this.dimensions.height = this.height;

            if ( this.frameWidth === null ) this.frameWidth = this.determineWidthOfImage();
            if ( this.variantStatic === 'mwh' && this.frameHeight === null ) this.frameHeight = this.determineHeightOfImage();
            if ( this.variantStatic === 'mw' ) this.withFrameHeight = false;

        } else { // this.variant === 'th'

            if ( this.size != null ) this.dimensions.height = this.dimensions.width = this.size;
            if ( this.frameSize === null ) this.frameSize = this.determineWidthOfImage();

        }

        if ( this.lastMediaId !== this.media_id ) {
            if( this.media_id ) {
                let sizes4variant;
                switch( this.variantStatic ) {
                    case 'mw':
                        sizes4variant = this.frameWidth;
                        break;
                    case 'mwh':
                        sizes4variant = this.frameWidth + '/' + this.frameHeight;
                        break;
                    case 'th':
                        sizes4variant = this.frameSize;
                }
                this.mediafiles.getImageVariant( this.media_id, this.variantStatic + '/' + sizes4variant ).subscribe( url => {
                    this.imageUrl = url;
                } );
            } else this.imageUrl = '';

        }

    }

    get styleDisplay() {
        return this.displayInline ? 'inline-block':'block';
    }

    get styleOuter() {
        switch ( this.align ) {
            case 'left': return {'margin-left':0,'margin-right':'auto'};
            case 'right': return {'margin-left':'auto','margin-right':0};
            case 'center': return {'margin-left':'auto','margin-right':'auto'};
            default: return {};
        }
    }

    getWidthOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).width.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingLeft.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingRight.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderLeftWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderRightWidth.replace( /px$/, '' ));
    }
    determineWidthOfImage() {
        return Math.round( this.getWidthOfParent() );
    }

    getHeightOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).height.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingTop.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingBottom.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderTopWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderBottomWidth.replace( /px$/, '' ));
    }
    determineHeightOfImage() {
        return Math.round( this.getHeightOfParent() );
    }

}