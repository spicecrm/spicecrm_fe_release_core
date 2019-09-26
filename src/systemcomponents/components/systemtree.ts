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
import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

/**
 * @ignore
 */
declare var _: any;

/* -----------------------------------
*  -- REQUIRED INPUT LIST STRUCTURE --
* ------------------------------------
* - id: string
* - parent_id: string
* - parent_sequence: string
* - name: string
* - selected: boolean
* - clickable: boolean
* -------------------
* -- @INPUT PARAMS --
* -------------------
* - treelist: any[] = [];
* - selectedItem: string = "";
* - config: any = {
*       draggable: false,
*       canadd: false,
*       clickable: false,
*       expandall: false,
*       collapsible: true
*   };
*---------------------
* -- @OUTPUT PARAMS --
* --------------------
* - selectedItem$: string = selected item id;
* - addItem$: string = parent item id
* - itemPosition$: any = {
*       id: string = moved item id,
*       parent_id: string = parent item id,
*       parent_name: string = parent item name,
*       parent_sequence: string = item new sequence
*   };
* ----------------------------
* TODO:Lazy Load functionality
*/

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html"
})

export class SystemTree implements OnChanges {
    @Input() public treelist: any[] = [];
    @Input() public selectedItem: string = "";

    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public itemPosition$: EventEmitter<any> = new EventEmitter<any>();

    public tree: any[] = [];
    public droplistids: any[] = [];
    private treeConfig: any = {
        draggable: false,
        canadd: false,
        clickable: false,
        expandall: false,
        collapsible: true,
    };

    get config() {
        return this.treeConfig;
    }

    @Input()
    set config(obj) {
        this.treeConfig.draggable = obj.draggable || false;
        this.treeConfig.canadd = obj.canadd || false;
        this.treeConfig.clickable = obj.clickable || false;
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    get dropListIds() {
        return this.droplistids;
    }

    set dropListIds(val) {
        this.droplistids = val;
    }

    public ngOnChanges() {
        this.resetTreeList();
        this.tree = this.buildTree(this.treelist);
    }

    private resetTreeList() {
        this.treelist.map(item => {
            if (item.parent_id === "" || item.parent_id === undefined) {
                item.parent_id = null;
            }
            item.parent_name = "";
            item = _.omit(item, "path", "level", "children");
            return item;
        });
    }

    private buildTree(treelist, parent = null, level = 0, parentpath = []) {
        let tree = [];
        for (let item of treelist) {
            if (item.parent_id === parent) {

                item.expanded = this.config.collapsible ? this.config.expandall : true;
                item.clickable = this.config.clickable;
                item.level = level + 1;
                item.path = parentpath.slice();
                item.path[level] = item.id;

                let children = this.buildTree(treelist, item.id, level + 1, item.path);
                delete item.path[level + 1];

                item.children = children.length ? children : [];

                // set expanded if child is selected or also expanded
                for (let child of children) {
                    if (child.id === this.selectedItem || child.expanded) {
                        item.expanded = true;
                    }
                }
                tree.push(item);
            }
        }
        return tree;
    }

    private handleDrop(dragEvent: CdkDragDrop<any>) {
        let newParent: any = dragEvent.container.data[0];
        let newItemPosition = {
            id: dragEvent.item.data.id,
            parent_id: newParent.parent_id,
            parent_sequence: dragEvent.currentIndex
        };
        let canDrop = !this.treelist
            .some(item => item.id === newItemPosition.parent_id && item.path.includes(newItemPosition.id));

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
            this.itemPosition$.emit(newItemPosition);
        } else if (canDrop) {
            dragEvent.item.data.level = newParent.level;
            transferArrayItem(dragEvent.previousContainer.data,
                dragEvent.container.data,
                dragEvent.previousIndex,
                dragEvent.currentIndex);
            this.itemPosition$.emit(newItemPosition);
        }
    }

    private handleDropListId(obj) {
        if (obj.action == 'add') {
            this.droplistids.push(obj.id);
        } else {
            this.droplistids = this.droplistids.filter(id => id != obj.id);
        }
    }
}
