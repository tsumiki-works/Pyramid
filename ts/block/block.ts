import { Vec3, Vec4 } from "../webgl/math.js";
import { Request } from "../webgl/request.js";

export class Block {

    /* ===================================================================== */
    /*                      Block Constants                                  */
    /* ===================================================================== */

    static readonly UNIT_WIDTH = 1.0;
    static readonly UNIT_HALF_WIDTH = 0.5;
    static readonly UNIT_HEIGHT = 0.5;
    static readonly UNIT_HALF_HEIGHT = 0.25;
    static convert_type_to_children_num(type: number): number {
        switch (type) {
            case 0: return 0;
            case 1: return 2;
            case 2: return 2;
            case 3: return 2;
            case 4: return 2;
            case 5: return 2;
            default: return 0;
        }
    }
    static convert_type_to_color(type: number): Vec4 {
        switch (type) {
            case 0: return [0.15, 0.75, 0.75, 1.0];
            case 1: return [0.15, 0.8, 0.2, 1.0];
            case 2: return [0.15, 0.2, 0.8, 1.0];
            case 3: return [0.35, 0.75, 0.35, 1.0];
            case 4: return [0.2, 0.6, 0.6, 1.0];
            default: return [0.0, 0.0, 0.0, 1.0];
        }
    }
    static create_empty_block(): Block {
        return new Block(0, 0, -1, "");
    }

    /* ===================================================================== */
    /*                                Block                                  */
    /* ===================================================================== */

    parent: Block | null;
    children: Block[];
    x: number;
    y: number;
    width: number;
    type: number;
    content: string;
    leftmost: number;
    rightmost: number;

    constructor(_x: number, _y: number, _type: number, _content: string){
        this.parent = null;
        this.children = new Array<Block>(Block.convert_type_to_children_num(_type));
        for(let i = 0; i < this.children.length; i++) {
            this.children[i] = new Block(0, 0, -1, "");
        }
        this.x = _x;
        this.y = _y;
        this.width = Math.max(this.children.length * Block.UNIT_WIDTH, Block.UNIT_WIDTH),
        this.type = _type;
        this.content = _content;
        this.leftmost = -Block.UNIT_HALF_WIDTH;
        this.rightmost = Block.UNIT_HALF_WIDTH;
    }

    is_empty(): boolean {
        return this.type == -1;
    }

    private create_request(wr: number, hr: number, view: Vec3, is_ui: boolean): Request {
        return {
            trans: [this.x, this.y, 0.0],
            scale: [this.width * wr, Block.UNIT_HEIGHT * hr, 1.0],
            view: view,
            base_color: Block.convert_type_to_color(this.type),
            uv_offset: [0.0, 0.0, 0.0, 0.0],
            texture: null,
            is_ui: is_ui,
        };
    }

    push_requests(wr: number, hr: number, view: Vec3, is_ui: boolean, requests: Request[]): void {
        if (this.is_empty()) {
            return;
        }
        requests.push(this.create_request(wr, hr, view, is_ui));
        for (const child of this.children) {
            if (child === null || child.is_empty()) {
                continue;
            }
            child.push_requests(wr, hr, view, is_ui, requests);
        }
    }

    enumerate(): string {
        let res = "";
        if (this.children.length == 0) {
            res += this.content;
        } else {
            res += "(";
            res += this.content;
            this.children.forEach(child => {
                res += " ";
                res += child.enumerate();
            });
            res += ")";
        }
        return res;
    }

    /* ===================================================================== */
    /*                              Arrangement                              */
    /* ===================================================================== */

    arrange(wr: number, hr: number): void {
        const x = this.x;
        const y = this.y;
        this.determine_width();
        this.determine_pos(x, y, wr, hr);
    }

    private determine_width() {
        if (this.is_empty() || this.children.length == 0) {
            this.x = 0.0;
            this.width = Block.UNIT_WIDTH;
            this.leftmost = -Block.UNIT_WIDTH * 0.5;
            this.rightmost = Block.UNIT_WIDTH * 0.5;
            return;
        }
        if (this.children.length == 1) {
            this.children[0].determine_width();
            this.x = this.children[0].x;
            this.width = Block.UNIT_WIDTH;
            this.leftmost = this.children[0].leftmost;
            this.rightmost = this.children[0].rightmost;
            return;
        }
        this.width = 1.0;
        this.leftmost = 0.0;
        this.rightmost = 0.0;
        let i = 0;
        for (const child of this.children) {
            child.determine_width();
            this.leftmost += child.leftmost;
            this.rightmost += child.rightmost;
            if (i == 0) {
                this.width += child.rightmost - child.x - child.width * 0.5;
            } else if (i == this.children.length - 1) {
                this.width += child.x - child.width * 0.5 - child.leftmost;
            } else {
                this.width += child.rightmost - child.leftmost;
            }
            i += 1;
        }
        this.x = this.leftmost
            + (this.children[0].x - this.children[0].leftmost)
            + (this.children[0].width * 0.5 - 0.5)
            + this.width * 0.5;
    }

    private determine_pos(x: number, y: number, wr: number, hr: number) {
        const center: number = x - this.x * wr;
        this.x = x;
        this.y = y;
        let offset: number = center + this.leftmost * wr;
        for (const child of this.children) {
            const child_area = (child.rightmost - child.leftmost) * wr;
            child.determine_pos(offset + child_area * 0.5 + child.x * wr, y - Block.UNIT_HEIGHT * hr, wr, hr);
            offset += child_area;
        }
    }

}