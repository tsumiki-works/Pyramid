import { BlockConst } from "../block_const.js";
import { ParentBlock } from "../parent_block.js";
import { TypedBlock } from "../typed_block.js";
import { TypeEnv, unify } from "../inference/typeenv.js";
import { TempPyramidType, TempPyramidTypeTree, TempFunctionAttribute } from "../inference/typeenv.js";

export class ListBlock extends ParentBlock {

    constructor(lr: Vec2, content: string, args_cnt: number) {
        super(
            lr,
            [
                ["引数の数を変更", (e: MouseEvent) => this.popup_event_edit(e, (value: string) => {
                    if (value.length !== 0 && !isNaN(parseInt(value))) {
                        this.set_content("List(" + value + ")");
                        this.set_children_cnt(parseInt(value));
                    }
                })],
                ["実行", _ => this.popup_event_eval()],
                ["削除", _ => this.popup_event_kill_self()],
                ["子も削除", _ => this.popup_event_kill()],
            ]
        );
        this.set_content(content);
        this.set_children_cnt(args_cnt);
        this.format();
    }

    override eval(env: Environment): PyramidObject {
        let children_values = Array<PyramidObject>();
        for (const child of this.get_children()) {
            children_values.push(child.eval(env));
        }
        return {
            pyramid_type: {
                type_id: PyramidTypeID.List,
                attribute: null,
            },
            value: children_values.reverse()
        }
    }

    override infer_type(env: TypeEnv): TempPyramidTypeTree {
        if (this.get_children().length == 0) {
            return {
                // TODO: Use Generics List<T>
                node: {
                    id: PyramidTypeID.List,
                    var: null,
                    attribute: {
                        args: [],
                        return: {
                            id: null,
                            var: null,
                            attribute: null
                        }
                    },
                },
                children: null,
            }
        } else {
            let is_invalid: boolean = false;
            let children_type = new Array<TempPyramidTypeTree>();
            let first_child = this.get_children()[0];
            let first_child_type: TempPyramidTypeTree;
            let unify_result = false;
            let t = {
                id: null,
                var: null,
                attribute: null
            }

            for (const child of this.get_children()) {
                if (first_child === child && !first_child.is_empty()) {
                    first_child_type = (first_child as TypedBlock).infer_type(env);
                    unify_result = unify(t, first_child_type.node);
                    children_type.push(first_child_type);
                } else {
                    if (child.is_empty()) {
                        // FIXME: This is 'POWER' codeing. Remove Error from 'not' adding empty_block's TempPyramidTypeTree
                        /** ex) (List [empty, List<num>]) ==> 
                         * node: List
                         * children: [
                         *      node: List,
                         *      children: [num]
                         * ]
                         */
                        is_invalid = true;
                    } else {
                        let c_type = (child as TypedBlock).infer_type(env);
                        unify_result = unify(t, c_type.node) && unify_result;
                        children_type.push(c_type);
                    }
                }
            }

            // There're no empty child
            if (unify_result && !is_invalid) {
                return ({
                    node: {
                        id: PyramidTypeID.List,
                        var: null,
                        attribute: {
                            args: [],
                            return: t,
                        },
                    },
                    children: children_type,
                })
            } else {
                return ({
                    node: {
                        id: PyramidTypeID.Invalid,
                        var: null,
                        attribute: null,
                    },
                    children: children_type,
                })
            }
        }
    }
    override determine_pos(x: number, y: number, res: FormatResult) {
        const center: number = x - res.x;
        this.set_left(x);
        this.set_top(y);
        let offset: number = center + res.leftmost;
        for (let i = 0; i < res.childrens.length; ++i) {
            const child_area = (res.childrens[i].rightmost - res.childrens[i].leftmost);
            this.get_children()[i].determine_pos(
                offset + child_area * 0.5 + res.childrens[i].x,
                y + this.get_height(),
                res.childrens[i]
            );
            offset += child_area;
        }
    }
    override determine_width(): FormatResult {
        const children = this.get_children();
        if (this.is_empty() || children.length == 0 || this.classList.contains("pyramid-block-folding")) {
            this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: 0,
                leftmost: -this.get_width() * 0.5,
                rightmost: this.get_width() * 0.5,
                childrens: [],
            };
        }
        if (children.length == 1) {
            const res = children[0].determine_width();
            this.style.minWidth = BlockConst.UNIT_WIDTH + "px";
            return {
                x: res.x,
                leftmost: res.leftmost,
                rightmost: res.rightmost,
                childrens: [res],
            };
        }
        let width = BlockConst.UNIT_WIDTH;
        let leftmost = 0.0;
        let rightmost = 0.0;
        let childrens: FormatResult[] = [];
        let i = 0;
        for (const child of children) {
            const res = child.determine_width();
            leftmost += res.leftmost;
            rightmost += res.rightmost;
            if (i == 0) {
                width += res.rightmost - res.x - child.get_width() * 0.5;
            } else if (i == children.length - 1) {
                width += res.x - child.get_width() * 0.5 - res.leftmost;
            } else {
                width += res.rightmost - res.leftmost;
            }
            childrens.push(res);
            i += 1;
        }
        this.style.minWidth = width + "px";
        const x = leftmost
            + (childrens[0].x - childrens[0].leftmost)
            + (children[0].get_width() * 0.5 - BlockConst.UNIT_HALF_WIDTH)
            + this.get_width() * 0.5;
        return {
            x: x,
            leftmost: leftmost,
            rightmost: rightmost,
            childrens: childrens,
        };
    }
}
customElements.define('pyramid-list-block', ListBlock);