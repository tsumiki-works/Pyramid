import { BlockFormatter } from "./block_formatter.js";
import { EmptyBlock } from "./concrete_block/empty-block.js";
import { FullBlock } from "./full_block.js";

export abstract class Block extends HTMLElement {

    static readonly UNIT_WIDTH = 100.0;
    static readonly UNIT_HALF_WIDTH = 50.0;
    static readonly UNIT_HEIGHT = 50.0;
    static readonly UNIT_HALF_HEIGHT = 25.0;

    protected pyramid_type: PyramidType;
    protected parent: Block | null;

    constructor(backgroundColor: string, pyramid_type: PyramidType) {
        super();
        // fields
        this.pyramid_type = pyramid_type;
        this.parent = null;
        // html div element
        this.classList.add("pyramid-block");
        this.style.left = "-10px";
        this.style.top = "-10px";
        //! [TODO] invaild literal check
        // Now, the way to set colors are dangerous.
        //ex) "blue", "rgba(0, 0, 0, 0.2)"...
        this.style.backgroundColor = backgroundColor;
        this.style.minWidth = Block.UNIT_WIDTH + "px";
        this.style.minHeight = Block.UNIT_HEIGHT + "px";
        document.getElementById("blocks").appendChild(this);
    }

    abstract kill(): void;
    connect_with(target: Block): boolean {
        if (this === target) {
            return false;
        }
        for (const child of this.get_children()) {
            if (child.is_empty() && child.is_hit(target)) {
                this.replaceChild(target, child);
                target.parent = this;
                this.get_root().format();
                child.parent = null;
                child.kill();
                return true;
            }
            const res = child.connect_with(target);
            if (res) {
                return true;
            }
        }
        return false;
    }
    copy_with(block: Block): void {
        this.pyramid_type = block.pyramid_type;
        this.parent = block.parent;
    }

    set_left(x: number): void {
        const left = x - this.get_width() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.left = -(parent.getBoundingClientRect().left - left) + "px";
    }
    set_top(y: number): void {
        const top = y - this.get_height() * 0.5;
        let parent: HTMLElement = null;
        if (this.parent === null) {
            parent = document.getElementById("workspace");
        } else {
            parent = this.parent;
        }
        this.style.top = -(parent.getBoundingClientRect().top - top) + "px";
    }
    //! [ToDo]
    set_parent(parent: Block): void {
        this.parent = parent;
    }


    get_x(): number {
        return this.getBoundingClientRect().left + this.get_width() * 0.5;
    }
    get_y(): number {
        return this.getBoundingClientRect().top + this.get_height() * 0.5;
    }
    get_width(): number {
        return this.offsetWidth;
    }
    get_height(): number {
        return this.offsetHeight;
    }
    get_type(): PyramidType {
        return this.pyramid_type;
    }
    get_root(): Block {
        if (this.parent === null) {
            return this;
        } else {
            return this.parent.get_root();
        }
    }
    get_children(): Array<Block>{
        return Array.from(this.children) as Array<FullBlock>;
    }
    is_hit(target: Block): boolean {
        return Math.abs(this.get_x() - target.get_x()) < this.get_width() * 0.5
            && Math.abs(this.get_y() - target.get_y()) < Block.UNIT_HEIGHT * 0.5;
    }
    is_empty(): boolean {
        return this.pyramid_type.type_id === PyramidTypeID.Empty;
    }
    format() {
        BlockFormatter.format(this);
    }
}