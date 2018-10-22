/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';



@Component({
    selector: '[administration-menu]',
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu
{
    @ViewChild('admincontentcontainer', {read: ViewContainerRef}) admincontentcontainer: ViewContainerRef;
    @ViewChild('adminitemscontainer', {read: ViewContainerRef}) adminitemscontainer: ViewContainerRef;

    admincontentObject: any = null;
    adminNavigation: any = {};
    itemfilter: string = '';
    opened_item:any = {};

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private navigation: navigation,
        private elementref: ElementRef
    ) {
        this.backend.getRequest('spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
                // default open version control...
                this.openContent('Versioning','Version Control');
            }
        );

        this.navigation.setActiveModule('Administration');

    }

    getContainerStyle(){
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)'
        }
    }

    getItemsStyle(){
        return {
            height: 'calc(100vh - ' + this.adminitemscontainer.element.nativeElement.offsetTop + 'px)'
        }
    }

    getNavigationBlocks() {
        let blocks = [];
        for (let block in this.adminNavigation) {

            let isRelevant = this.itemfilter == '';

            // check if we find an item
            if(!isRelevant){
                this.adminNavigation[block].some(item => {
                    let name = item.adminaction;
                    if(item.admin_label)
                        name = this.language.getLabel(item.admin_label);
                    if(name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0){
                        isRelevant = true;
                        return true;
                    }
                })
            }

            if(isRelevant)
                blocks.push(block);

        }

        return blocks.sort();
    }

    getNavigationItems(block)
    {
        let items = [];

        for (let item of this.adminNavigation[block])
        {
            item.name = item.adminaction;
            if(item.admin_label)
                item.name = this.language.getLabel(item.admin_label);

            if(this.itemfilter == '' || item.name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0)
            {
                items.push(item);
            }

        }
        return items;
    }

    openContent(block: string, item)
    {
        // already loaded?
        if( this.opened_item == item )
            return true;

        this.opened_item = item;
        if (this.admincontentObject)
            this.admincontentObject.destroy();

        let adminItem: any = {};

        if( !this.adminNavigation[block] )
            return false;

        this.adminNavigation[block].some(blockAction => {
                if (blockAction.id == item.id) {
                    adminItem = blockAction;
                    return true;
                }
            }
        );

        if (adminItem.component)
            this.metadata.addComponent(adminItem.component, this.admincontentcontainer).subscribe(admObject => {
                admObject.instance.componentconfig = adminItem.componentconfig;
                this.admincontentObject = admObject;
            })
    }

    openDictionaryManager(item: string) {
        if (this.admincontentObject) this.admincontentObject.destroy();

        this.metadata.addComponent("AdministrationDictionaryManager", this.admincontentcontainer).subscribe(admObject => {
            admObject.instance['dictionaryitem'] = item;
            this.admincontentObject = admObject;
        })
    }
}