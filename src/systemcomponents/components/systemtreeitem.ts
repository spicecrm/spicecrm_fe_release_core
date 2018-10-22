/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, Output, Renderer2} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem {

    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public treelistChange$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public selectedItem: string = "";
    @Input() public items: any = [];
    @Input() private config: any = {};

    constructor(private renderer: Renderer2) {
    }

    public expand(e, item) {
        if (!item) {
            return;
        }
        item.expanded = !item.expanded;
        e.stopPropagation();

    }

    public addItem(e, parentId, parentName) {
        this.handleAddEvent({id: parentId, name: parentName});
        e.stopPropagation();
    }

    public handleAddEvent(parent) {
        this.addItem$.emit(parent);
    }

    private selectItem(e, id) {
        this.selectedItem$.emit(id);
        e.stopPropagation();
    }

    private handleSelectItemEvent(id) {
        this.selectedItem$.emit(id);
    }

    private dragItem(e, id) {
        if (!this.config.draggable) {
            return;
        }
        e.dataTransfer.setDragImage(this.renderer.createElement("div"), 0, 0);
        e.dataTransfer.setData("itemId", id);
        e.stopPropagation();
    }

    private onDragging(e) {
        if (!this.config.draggable) {
            return;
        }
        this.renderer.setStyle(e.target, "border", "1px solid red");
        e.preventDefault();
    }

    private onDragLeave(e) {
        if (!this.config.draggable) {
            return;
        }
        this.renderer.removeStyle(e.target, "border");
    }

    // Pass to emitter: Ids of moved and targeted item
    private dropItem(e, dropitemId) {
        if (!this.config.draggable) {
            return;
        }
        this.renderer.removeStyle(e.target, "border");
        let itemId: string = e.dataTransfer.getData("itemId");
        if (itemId && itemId !== dropitemId) {
            this.handleDragDropEvent({child: itemId, parent: dropitemId});
        }

        e.dataTransfer.clearData();
        e.preventDefault();
        e.stopPropagation();
    }

    private handleDragDropEvent(obj: any) {
        this.treelistChange$.emit(obj);
    }
}
