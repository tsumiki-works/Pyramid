import { EventBlock } from "./event_block.js";

export abstract class TypedBlock extends EventBlock {

    protected pyramid_type: PyramidType;
    private type_span: HTMLSpanElement;

    constructor(
        pyramid_type: PyramidType,
        lr: Vec2,
        mouse_leftdown_event: Function,
        mouse_rightdown_event: Function,
        mouse_move_event: Function,
        mouse_up_event: Function,
    ) {
        super(
            lr,
            mouse_leftdown_event,
            mouse_rightdown_event,
            mouse_move_event,
            mouse_up_event
        );
        this.type_span = document.createElement("span");
        this.type_span.classList.add("type");
        this.appendChild(this.type_span);
        this.set_type(pyramid_type);
    }

    override is_empty(): boolean {
        return false;
    }

    protected set_type(pyramid_type: PyramidType, is_invalid?: boolean) {
        this.pyramid_type = pyramid_type;
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
            } else {
                buf += typeid_to_string(t.type_id);
            }
        };
        inner(this.pyramid_type);
        if (this.pyramid_type.type_id === PyramidTypeID.Function) {
            buf = buf.substring(1, buf.length - 1);
        }
        this.type_span.innerText = buf;
        if (typeof is_invalid !== "boolean" || is_invalid) {
            this.classList.remove("pyramid-invalid-block");
        } else {
            this.classList.add("pyramid-invalid-block");
        }
    }

    get_type(): PyramidType {
        return this.pyramid_type;
    }
}