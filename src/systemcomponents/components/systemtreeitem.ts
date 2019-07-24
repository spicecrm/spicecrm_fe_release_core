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
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem implements AfterViewInit, OnDestroy {
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public itemPosition$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public dropListId$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public selectedItem: string = "";
    @Input() public items: any = [];
    @Input() private dropListIds: any = [];
    @Input() private config: any = {};
    @Input() private hasChildren: boolean = false;
    @ViewChild('dropList', {static: false} ) private dropList;

    get connectionList() {
        return (this.dropList && this.hasChildren) ? this.dropListIds.filter(i => i != this.dropList.id) : this.dropListIds;
    }

    public ngAfterViewInit() {
        if (this.hasChildren && this.dropList && this.config.draggable) {
            window.setTimeout(() => this.dropListId$.emit({id: this.dropList.id, action: 'add'}), 100);
        }
    }

    public ngOnDestroy() {
        if (this.dropList && this.config.draggable) {
            window.setTimeout(() => this.dropListId$.emit({id: this.dropList.id, action: 'remove'}), 100);
        }
    }

    public expand(item, e?) {
        item.expanded = !item.expanded;
        e.stopPropagation();
    }

    public addItem(e, parentId, parentName) {
        this.addItem$.emit({id: parentId, name: parentName});
        e.stopPropagation();
    }

    private selectItem(e, id) {
        this.selectedItem$.emit(id);
        e.stopPropagation();
    }

    private trackByFn(i, item) {
        return item.id;
    }
}
