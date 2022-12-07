export class ConsoleManager {

    private pconsole: HTMLDivElement;
    private content: HTMLDivElement;
    private console_log: HTMLLabelElement;

    private click_listener: EventListener;
    private keydown_listener: EventListener;
    private prevent_enter_listener: EventListener;

    constructor() {
        this.pconsole = document.getElementById("console") as HTMLDivElement;
        this.content = document.getElementById("console-content") as HTMLDivElement;
        this.console_log = document.getElementById("console-log") as HTMLLabelElement;
        this.click_listener = (e: Event) => this.event_click_console(e);
        this.keydown_listener = (e: KeyboardEvent) => this.event_keydown_console(e);
        this.prevent_enter_listener = (e: KeyboardEvent) => this.prevent_enter_listener(e);
        this.pconsole.addEventListener("click", this.click_listener);
        this.pconsole.addEventListener("keydown", this.keydown_listener);
        const line = document.getElementById("console-line");
        line.addEventListener("keydown", this.prevent_enter_listener);
        line.focus();
    }
    
    private event_click_console(_: Event): void {
        document.getElementById("console-line").focus();
    }

    private event_keydown_console(event: KeyboardEvent): void{
        if (event.key == "Enter") {
            this.run_command(document.getElementById("console-line").innerText);
        }
    }

    private event_prevent_enter_console_line(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            return event.preventDefault();
        }
    }

    private run_command(command: string): void {
        const words: string[] = command.trim().split(/\s+/);
        console.log(words[0]);
        let res = "";
        switch (words[0]) {
            case "":
                break;
            default:
                res = this.exception_message("invalid command '" + words[0] + "'.");
                break;
        }
        this.start_newline(res);
    }

    private replace_escape(message: string): string {
        let message1: string = message.replaceAll("<", "&lt;");
        let message2: string = message1.replaceAll(">", "&gt;");
        return message2;
    }

    private exception_message(message: string): string {
        return "<span class=\"exception\">pyramid frontend exception:</span> " + this.replace_escape(message);
    }

    private start_newline(log): void {
        const prev_line: HTMLLabelElement = document.getElementById("console-line") as HTMLLabelElement;
        const prev_line_head: HTMLLabelElement = document.getElementById("console-line-head") as HTMLLabelElement;
        const line_head: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const new_line: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        prev_line.removeEventListener("keydown", this.prevent_enter_listener);
        prev_line.contentEditable = "false";
        prev_line.id = "";
        prev_line_head.id = "";
        line_head.innerText = "# ";
        line_head.id = "console-line-head";
        new_line.contentEditable = "true";
        new_line.id = "console-line";
        this.console_log.innerHTML += "# " + prev_line.innerText + "<br>";
        this.content.removeChild(prev_line);
        this.content.removeChild(prev_line_head);
        if (log.length != 0) {
            this.console_log.innerHTML += log + "<br>";
        }
        this.content.appendChild(line_head);
        this.content.appendChild(new_line);
        new_line.focus();
        new_line.addEventListener("keydown", this.prevent_enter_listener);
    }
}