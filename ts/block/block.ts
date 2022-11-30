import { Vec3, Vec4 } from "../webgl/math.js";
import { Request } from "../webgl/request.js";

export class Block {

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
}