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
 * @module GlobalComponents
 */
import {Component, Renderer2, ElementRef} from '@angular/core';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';
import {metadata} from '../../services/metadata.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'global-header-favorite',
    templateUrl: './src/globalcomponents/templates/globalheaderfavorite.html',
    providers: [popup],
    styles: [
        ':host >>> .spicecrm-favorite--inactive svg {fill: transparent; stroke: grey;}',
        ':host >>> .slds-button.spicecrm-favorite--inactive:focus  svg {fill: transparent; stroke: grey;}',
        ':host >>> .slds-button.spicecrm-favorite--inactive:not(:disabled):hover svg {fill: transparent; stroke: #CA1B21;}',
    ]
})
export class GlobalHeaderFavorite {
    private clickListener: any;
    private showFavorites: boolean = false;

    constructor(
        private metadata: metadata,
        private favorite: favorite,
        private router: Router,
        private popup: popup,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private language: language
    ) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                this.favorite.disable();
            }
        });

        popup.closePopup$.subscribe(close => {
            this.showFavorites = false;
            if (this.clickListener) {
                this.clickListener();
            }
        });
    }

    get canShowFavorites() {
        return this.metadata.getActiveRole().showfavorites && this.metadata.getActiveRole().showfavorites != '0';
    }

    get nofavorites() {
        return this.favorite.favorites.length == 0;
    }

    private isDisabled() {
        return !this.favorite.isEnabled;
    }

    get isfavorite() {
        return this.favorite.isFavorite;
    }

    private getFavoriteActive() {
        if (this.favorite.isFavorite) {
            return 'spicecrm-favorite--active';
        } else {
            return 'spicecrm-favorite--inactive';
        }
    }

    private toggleFavorite() {
        if (this.favorite.isFavorite) {
            this.favorite.deleteFavorite();
        } else {
            this.favorite.setFavorite();
        }
    }

    private closeFavorites() {
        this.showFavorites = false;
    }

    private toggleFavorites() {
        this.showFavorites = !this.showFavorites;

        if (this.showFavorites) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showFavorites = false;
            this.clickListener();
        }
    }
}
