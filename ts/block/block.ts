import { Vec4 } from "../webgl/math.js";
import { GLRequest } from "../webgl/glrequest.js";
import { PyramidObject, PyramidType, PyramidTypeID } from "./pyramid_object.js";

export class Block {

    /* ============================================================================================================= */
    /*     Constants                                                                                                 */
    /* ============================================================================================================= */

    static readonly UNIT_WIDTH = 1.0;
    static readonly UNIT_HALF_WIDTH = 0.5;
    static readonly UNIT_HEIGHT = 0.5;
    static readonly UNIT_HALF_HEIGHT = 0.25;
    static convert_type_to_children_num(pyramid_type: PyramidType): number {
        switch (pyramid_type.type_id) {
            case PyramidTypeID.Nil: return 0;
            case PyramidTypeID.I32: return 0;
            case PyramidTypeID.F32: return 0;
            case PyramidTypeID.Bool: return 0;
            case PyramidTypeID.String: return 0;
            case PyramidTypeID.Function: return pyramid_type.attribute.args_cnt;
            case PyramidTypeID.List: return
        }
    }
    static create_empty_block(): Block {
        return new Block(0, 0, [0, 0, 0, 0], { type_id: PyramidTypeID.Nil, attribute: null }, "nil");
    }

    /* ============================================================================================================= */
    /*     Block                                                                                                     */
    /* ============================================================================================================= */

    private max_children_num: number;
    private children: Block[];
    x: number;
    y: number;
    private color: Vec4;
    private width: number;
    private pyramid_type: PyramidType;
    private content: any;

    constructor(x: number, y: number, color: Vec4, pyramid_type: PyramidType, content: any) {
        this.max_children_num = Block.convert_type_to_children_num(pyramid_type);
        if (this.max_children_num === Infinity) {
            this.children = new Array<Block>();
        } else {
            this.children = new Array<Block>(Block.convert_type_to_children_num(pyramid_type));
        }
        for (let i = 0; i < this.children.length; i++) {
            this.children[i] = Block.create_empty_block();
        }
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = Math.max(this.children.length * Block.UNIT_WIDTH, Block.UNIT_WIDTH);
        this.pyramid_type = pyramid_type;
        this.content = content;
        this.leftmost = -Block.UNIT_HALF_WIDTH;
        this.rightmost = Block.UNIT_HALF_WIDTH;
    }

    private copy_with(target: Block) {
        this.children = target.children;
        this.x = target.x;
        this.y = target.y;
        this.color = target.color;
        this.width = target.width;
        this.pyramid_type = target.pyramid_type;
        this.content = target.content;
    }

    get_type(): PyramidType {
        return this.pyramid_type;
    }

    is_empty(): boolean {
        return this.pyramid_type.type_id === PyramidTypeID.Nil;
    }

    is_hit(x: number, y: number): boolean {
        return Math.abs(this.x - x) < this.width * 0.5
            && Math.abs(this.y - y) < Block.UNIT_HEIGHT * 0.5;
    }

    find(f: Function): Block {
        if (this.is_empty()) {
            return Block.create_empty_block();
        }
        if (f(this)) {
            return this;
        }
        for (const child of this.children) {
            if (child.is_empty()) {
                continue;
            }
            if (f(child)) {
                return child;
            }
            const res = child.find(f);
            if (!res.is_empty()) {
                return res;
            }
        }
        return Block.create_empty_block();
    }

    remove(target: Block): boolean {
        if (this === target) {
            throw new Error("Pyramid frontend error: tried to remove self.");
        }
        for (let i = 0; i < this.children.length; ++i) {
            if (this.children[i] === target) {
                this.children[i] = Block.create_empty_block();
                return true;
            }
            if (this.children[i].remove(target)) {
                return true;
            }
        }
        return false;
    }

    connect_with(target: Block): boolean {
        if (this.is_empty() && this.is_hit(target.x, target.y)) {
            this.copy_with(target);
            return true;
        }
        for (const child of this.children) {
            if (child.connect_with(target)) {
                return true;
            }
        }
        return false;
    }

    eval(env: Map<String, any>): PyramidObject {
        switch (this.pyramid_type.type_id) {
            case PyramidTypeID.Nil:
                throw new Error("evaluated nil");
            case PyramidTypeID.I32:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.content };
            case PyramidTypeID.F32:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.content };
            case PyramidTypeID.Bool:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.content };
            case PyramidTypeID.String:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.content };
            case PyramidTypeID.List:
                //! [TODO]
                return { pyramid_type: this.pyramid_type, value: this.content };
            case PyramidTypeID.Function:
                //! [TODO]
                const f = env.get(this.content);
                if (typeof f !== "function") {
                    throw new Error(this.content + " function undefined");
                } else {
                    return {
                        pyramid_type: this.pyramid_type.attribute.return_type,
                        value: f(this.children, env),
                    };
                }
        }
    }

    push_requests(requests: GLRequest[]): void {
        if (this.is_empty()) {
            return;
        }
        requests.push(this.create_request());
        for (const child of this.children) {
            if (child === null || child.is_empty()) {
                continue;
            }
            child.push_requests(requests);
        }
    }

    private create_request(): GLRequest {
        return {
            trans: [this.x, this.y, 0.0],
            scale: [this.width, Block.UNIT_HEIGHT, 1.0],
            view: null,
            base_color: this.color,
            uv_offset: [0.0, 0.0, 0.0, 0.0],
            texture: null,
            is_ui: false,
        };
    }

    /* ============================================================================================================= */
    /*     Arrangement                                                                                               */
    /* ============================================================================================================= */

    private leftmost: number;
    private rightmost: number;

    arrange(): void {
        const x = this.x;
        const y = this.y;
        this.determine_width();
        this.determine_pos(x, y);
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

    private determine_pos(x: number, y: number) {
        const center: number = x - this.x;
        this.x = x;
        this.y = y;
        let offset: number = center + this.leftmost;
        for (const child of this.children) {
            const child_area = (child.rightmost - child.leftmost);
            child.determine_pos(offset + child_area * 0.5 + child.x, y - Block.UNIT_HEIGHT);
            offset += child_area;
        }
    }
}