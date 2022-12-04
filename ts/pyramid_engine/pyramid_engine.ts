export abstract class PyramidEngine {

    protected workspace: HTMLDivElement;

    protected mousedown_listener: EventListener;
    protected mousemove_listener: EventListener;
    protected mouseup_listener: EventListener;

    constructor(){
        this.workspace = document.getElementById("workspace") as HTMLDivElement;
        this.init();
    }
    protected init(): void {
        this.init_events();
        this.init_menu();
    };
    protected init_events() {
        this.mousedown_listener = (e: MouseEvent) => this.event_mousedown(e);
        this.mousemove_listener = (e: MouseEvent) => this.event_mousemove(e);
        this.mouseup_listener = (e: MouseEvent) => this.event_mouseup(e);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
    }

    protected event_mousedown(e: MouseEvent) {
        this.workspace.removeEventListener("mousedown", this.mousedown_listener);
        document.addEventListener("mousemove", this.mousemove_listener);
        document.addEventListener("mouseup", this.mouseup_listener);
    }

    protected event_mouseup(_: MouseEvent) {
        document.removeEventListener("mousemove", this.mousemove_listener);
        document.removeEventListener("mouseup", this.mouseup_listener);
        this.workspace.addEventListener("mousedown", this.mousedown_listener);
    }

    protected event_mousemove(_: MouseEvent) { }

    protected init_menu(){
        
    }
}