import { Vec3, Vec4 } from "../webgl/math.js";
import { Translation } from "../lib/translation.js";
import { BlockManager } from "../block/block_manager.js";
import { ConstantBlock } from "../constant/constant_block.js";
import { BlockCalc } from "../lib/block_calc.js";
import { ConstantEntity } from "../constant/constant_entity.js";
import { Popup } from "./popup.js";
import { Pager } from "./pager.js";
import { Block } from "../block/block.js";
import { ConsoleManager } from "./console.js";

export class EventManager {
    private mouse_pos_before_drag_x: number = 0.0;
    private mouse_pos_before_drag_y: number = 0.0;
    private view_pos_before_drag_x: number = 0.0;
    private view_pos_before_drag_y: number = 0.0;

    private canvas: HTMLCanvasElement;
    private view: Vec3;
    private render: Function;

    private popup: Popup;
    private blockManager: BlockManager;
    private consoleManager: ConsoleManager;

    private mousedown_listener: EventListener;
    private mousewheel_listener: EventListener;
    private left_mousemove_listener: EventListener;
    private left_mouseup_listener: EventListener;
    private right_mousemove_listener: EventListener;
    private right_mouseup_listener: EventListener;

    constructor(_canvas: HTMLCanvasElement, _view: Vec3, _render: Function, _blockManager: BlockManager, _consoleManager: ConsoleManager){
        this.canvas = _canvas;
        this.view = _view;
        this.render = _render;
        this.popup = new Popup(_render, _consoleManager);
        this.blockManager = _blockManager;
        this.consoleManager = _consoleManager;
    }
    init_canvas_event(): void {
        this.mousedown_listener = e => this.fun_mousedown(e);
        this.mousewheel_listener = e => this.fun_wheel(e);
        
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        this.canvas.addEventListener("wheel", this.mousewheel_listener);
    }

    private fun_mousedown(event): void {
        const pos_world: Vec3 = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [event.pageX, event.pageY]);
        const pos_2dunnormalizedviewport: number[] = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas.width, this.canvas.height, [event.pageX, event.pageY]);
        // hiddle popup-menu
        this.popup.delete_popup_menu();
        // mouseleft down
        if (event.which == 1) {
            if (event.pageX < ConstantEntity.LOGO_WIDTH + 12 && event.pageY < ConstantEntity.LOGO_HEIGHT + 18){
            window.confirm("トップページに戻ると作業内容が失われます。よろしいですか。");
                Pager.goto_toppage();
            }
            else if (event.pageX < ConstantEntity.MENU_WIDTH) {
                let is_generate = false;
                if (event.pageX > 40 && event.pageX < 140) {
                    if (event.pageY > 75 && event.pageY < 125) {
                        this.blockManager.set_holding_block((BlockManager.create_block(pos_world[0], pos_world[1], 0, "0")));
                        is_generate = true;
                    }
                    if (event.pageY > 135 && event.pageY < 185) {
                        this.blockManager.set_holding_block((BlockManager.create_block(pos_world[0], pos_world[1], 1, "+")));
                        is_generate = true;
                    }
                    if (event.pageY > 195 && event.pageY < 245) {
                        this.blockManager.set_holding_block((BlockManager.create_block(pos_world[0], pos_world[1], 2, "-")));
                        is_generate = true;
                    }
                    if (event.pageY > 255 && event.pageY < 305) {
                        this.blockManager.set_holding_block((BlockManager.create_block(pos_world[0], pos_world[1], 3, "*")));
                        is_generate = true;
                    }
                    if (event.pageY > 315 && event.pageY < 365) {
                        this.blockManager.set_holding_block((BlockManager.create_block(pos_world[0], pos_world[1], 4, "/")));
                        is_generate = true;
                    }
                }
                if (is_generate) {
                    this.blockManager.set_holding_block_pos([pos_2dunnormalizedviewport[0], pos_2dunnormalizedviewport[1]]);

                    this.left_mousemove_listener = e => this.fun_left_mousemove(e);
                    this.left_mouseup_listener = e => this.fun_left_mouseup(e);

                    this.canvas.addEventListener("mousemove", this.left_mousemove_listener);
                    this.canvas.addEventListener("mouseup", this.left_mouseup_listener);
                    this.canvas.removeEventListener("mousedown", this.mousedown_listener);
                }
            } else {
                const hit_result = this.blockManager.find_block(this.blockManager.get_roots(), (block) => {
                    const block_half_width = block.width * 0.5;
                    return Math.abs(block.x - pos_world[0]) < block_half_width
                        && Math.abs(block.y - pos_world[1]) < ConstantBlock.BLOCK_HALF_HEIGHT;
                });
                if (!hit_result.is_empty()) {
                    this.blockManager.set_holding_block(hit_result);
                    console.log("hit_result = " + hit_result);
                    this.blockManager.remove_block_from_roots(hit_result);
                    this.blockManager.set_holding_block_pos([pos_2dunnormalizedviewport[0], pos_2dunnormalizedviewport[1]]);

                    this.left_mousemove_listener = e => this.fun_left_mousemove(e);
                    this.left_mouseup_listener = e => this.fun_left_mouseup(e);

                    this.canvas.addEventListener("mousemove", this.left_mousemove_listener);
                    this.canvas.addEventListener("mouseup", this.left_mouseup_listener);
                    this.canvas.removeEventListener("mousedown", this.mousedown_listener);
                    //this.open_trashbox = true;
                } else {
                    console.log("MOUSEPOS: " + event.pageX + ", " + event.pageY);
                }
            }
        }
        // mouseright down : move around workspace
        else if (event.which == 3) {
            const hit_result = this.blockManager.find_block(this.blockManager.get_roots(), (block) => {
                const block_half_width = block.width * 0.5;
                return Math.abs(block.x - pos_world[0]) < block_half_width
                    && Math.abs(block.y - pos_world[1]) < ConstantBlock.BLOCK_HALF_HEIGHT;
            });
            if(!hit_result.is_empty()){
                // create popup menu
                this.popup.create_popup_menu(this.blockManager, event, hit_result);

            }else{
                this.mouse_pos_before_drag_x = event.pageX;
                this.mouse_pos_before_drag_y = event.pageY;
                this.view_pos_before_drag_x = this.view[0];
                this.view_pos_before_drag_y = this.view[1];

                this.right_mousemove_listener = e => this.fun_right_mousemove(e);
                this.right_mouseup_listener = e => this.fun_right_mouseup(e);

                this.canvas.addEventListener("mousemove", this.right_mousemove_listener);
                this.canvas.addEventListener("mouseup", this.right_mouseup_listener);
                this.canvas.removeEventListener("mousedown", this.mousedown_listener);
            }
        }
        this.render();
    }

    private fun_left_mouseup(_) {
        console.log("mouseup");
        const pos_viewport: number[] = [this.blockManager.get_holding_block().x / this.canvas.width * 2.0, this.blockManager.get_holding_block().y / this.canvas.height * 2.0];
        const pos_clipping: Vec3 = Translation.convert_2dviewport_to_3dclipping(this.view[2], pos_viewport);
        const pos_view: Vec4 = Translation.convert_3dclipping_to_3dview(this.canvas.width, this.canvas.height, pos_clipping);
        const pos_view_vec3: Vec3 = [pos_view[0], pos_view[1], pos_view[2]];
        const pos_world: Vec3 = Translation.convert_3dview_to_3dworld(this.view, pos_view_vec3);
        const pos_trashbox = Translation.convert_2dscreen_to_2dunnormalizedviewport(
            this.canvas.width,
            this.canvas.height,
            [this.canvas.width - ConstantEntity.TRASHBOX_WIDTH * 0.5, this.canvas.height - this.consoleManager.get_console_height() - ConstantEntity.TRASHBOX_HEIGHT * 0.5]
        );

        this.mousedown_listener = e => this.fun_mousedown(e);

        this.canvas.removeEventListener("mousemove", this.left_mousemove_listener);
        this.canvas.removeEventListener("mouseup", this.left_mouseup_listener);
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        if (BlockCalc.square_distance(pos_trashbox[0], pos_trashbox[1], this.blockManager.get_holding_block().x, this.blockManager.get_holding_block().y) > 10000) {
            this.blockManager.set_holding_block_pos([pos_world[0], pos_world[1]]);
            this.blockManager.connect_block();
        }
        else {

        }
        this.blockManager.reset_holding_block();
        //this.open_trashbox = false;
        this.render();
    }

    private fun_left_mousemove(event) {
        console.log("mousemove");
        const pos = Translation.convert_2dscreen_to_2dunnormalizedviewport(this.canvas.width, this.canvas.height, [event.pageX, event.pageY]);
        this.blockManager.set_holding_block_pos([pos[0], pos[1]]);
        this.render();
    }


    private fun_right_mouseup(_) {
        this.mousedown_listener = e => this.fun_mousedown(e);

        this.canvas.removeEventListener("mousemove", this.right_mousemove_listener);
        this.canvas.removeEventListener("mouseup", this.right_mouseup_listener);
        this.canvas.addEventListener("mousedown", this.mousedown_listener);
        this.render();
    }

    private fun_right_mousemove(event) {
        const c = -0.00176 * this.view[2] + 0.00235;
        this.view[0] = this.view_pos_before_drag_x - (this.mouse_pos_before_drag_x - event.pageX) * c;
        this.view[1] = this.view_pos_before_drag_y + (this.mouse_pos_before_drag_y - event.pageY) * c;
        this.render();
    }

    private fun_wheel(event) {
        if (event.pageX > ConstantEntity.MENU_WIDTH) {
            if (event.wheelDelta == 0)
                return;
            const prev_pos = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [event.pageX, event.pageY]);
            if (event.wheelDelta > 0) {
                this.view[2] = this.view[2] / 1.08;
            } else if (event.wheelDelta < 0) {
                this.view[2] = this.view[2] * 1.08;
            }
            this.view[2] = Math.max(Math.min(this.view[2], -1.5), -10.0);
            const next_pos = Translation.convert_2dscreen_to_3dworld(this.canvas.width, this.canvas.height, this.view, [event.pageX, event.pageY]);
            this.view[0] += next_pos[0] - prev_pos[0];
            this.view[1] += next_pos[1] - prev_pos[1];
            event.preventDefault();
            this.render();
        }
        else {
            // メニューバーをスクロールさせるかも
            event.preventDefault();
        }
    }

}