import { BasicBlock } from "./basic_block.js";
import { TypeEnv, TempPyramidTypeTree, decode_temptype } from "./inference/typeenv.js";

export abstract class TypedBlock extends BasicBlock {

    private ptype: PyramidType;
    private type_span: HTMLSpanElement;

    constructor(lr: Vec2, popup_events: PopupEvent[]) {
        super(lr, popup_events);
        this.type_span = document.createElement("span");
        this.type_span.classList.add("type");
        this.appendChild(this.type_span);
    }

    set_type(tree: TempPyramidTypeTree) {
        this.ptype = decode_temptype(tree.node);
        let buf = "";
        const inner = (t: PyramidType) => {
            if (t.type_id === PyramidTypeID.Function) {
                buf += "(";
                for (const t_ of t.attribute.args) {
                    inner(t_);
                    buf += "->";
                }
                inner(t.attribute.return_type);
                buf += ")";
            } else if (t.type_id === PyramidTypeID.List) {
                // TODO: FIXME: Where list_type should be?
                buf += "List<";
                if(t.attribute === null){
                    buf += "T";
                }else{
                    inner(t.attribute.return_type);
                }
                buf += ">";
            } else {
                buf += typeid_to_string(t.type_id);
            }
        };
        inner(this.ptype);
        if (this.ptype.type_id === PyramidTypeID.Function) {
            buf = buf.substring(1, buf.length - 1);
        }
        this.type_span.innerText = buf;
        if (this.ptype.type_id === PyramidTypeID.Invalid) {
            this.classList.add("pyramid-invalid-block");
        } else {
            this.classList.remove("pyramid-invalid-block");
        }
        let cnt = 0;
        for (const child of this.get_children()) {
            if (!child.is_empty()) {
                (child as TypedBlock).set_type(tree.children[cnt]);
                cnt += 1;
            }
        }
    }

    get_type(): PyramidType {
        return this.ptype;
    }

    abstract infer_type(env: TypeEnv): TempPyramidTypeTree;
}