/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, Input, Output, SimpleChanges} from "@angular/core";

declare var _: any;
/*
* -- @INPUT PARAMS --
* - treelist: any[] = [];
* - selectedItem: string = "";
* - config: any =
*   {
*       draggable: false,
*       canadd: false,
*       clickable: false,
*       expandall: false,
*       collapsible: true
*   };
*
* -- @OUTPUT PARAMS --
* - selectedItem$: string = selected item id;
* - addItem$: string = parent item id
* - treelistChange$: any =
*   {
*       id: string = moved item id,
*       parent_id: string = parent item id,
*       parent_name: string = parent item name,
*   };
* TODO:Lazy Load functionality
*/

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html"
})

export class SystemTree {
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public treelistChange$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public treelist: any[] = [];
    @Input() public selectedItem: string = "";
    public tree: Array<any> = [];
    private treeConfig: any = {
        draggable: false,
        canadd: false,
        clickable: false,
        expandall: false,
        collapsible: true,
    };
    @Input() set config(obj) {
        this.treeConfig.draggable = obj.draggable || false;
        this.treeConfig.canadd = obj.canadd || false;
        this.treeConfig.clickable = obj.clickable || false;
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    get config() {
        return this.treeConfig;
    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // parent_id
    // name
    // selected
    // clickable

    private ngOnChanges(changes: SimpleChanges) {
        this.resetTreelist();
        this.tree = this.buildTree(this.treelist);
    }

    private resetTreelist() {
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

                if (children.length) {
                    item.children = children;
                } else {
                    item.children = [];
                }

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

    private handleSelectItemEvent(id) {
        this.selectedItem$.emit(id);
    }

    private handleAddEvent(parent) {
        this.addItem$.emit(parent);
    }

    /*
    * Emit: moved Item with fields:
    * id, parent_id, parent_name
    */
    private handleDragDropEvent(obj: any) {
        let toEdit: any = {};
        let canDrop = true;
        for (let item of this.treelist) {
            if (item.id === obj.child && item.level === 1) {
                canDrop = false;
            }
            if (item.id === obj.parent && item.path.includes(obj.child)) {
                canDrop = false;
            }
        }
        if (canDrop) {
            toEdit.id = obj.child;
            toEdit.parent_id = obj.parent;
            toEdit.parent_name = this.treelist.find(unit => unit.id === obj.parent).name;
            this.treelistChange$.emit(toEdit);
        }
    }
}
