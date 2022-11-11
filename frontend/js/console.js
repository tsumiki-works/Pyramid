let content = 1; // unneccessary variable
const console_div = document.getElementById("console");

/**
 * A function to initialize console.
 */
function init_console() {
    console_div.addEventListener("click", fun_click_console);
    console_div.addEventListener("keydown", fun_keydown_console);
    const observer = new MutationObserver(() => render());
    const options = {
        attriblutes: true,
        attributeFilter: ["style"]
    };
    observer.observe(console_div, options);
    document.getElementById("console-line").addEventListener("keydown", fun_prevent_enter_console_line);
}
/**
 * A function to get console element's height.
 * @return {float} the offfset height of console element.
 */
function get_console_height() {
    return console_div.offsetHeight;
}
/**
 * An event handler for console.onclick.
 * Wherever you click on console, you're focused on console line.
 */
function fun_click_console(_) {
    document.getElementById("console-line").focus();
}
/**
 * An event handler for console.onkeydown.
 * Detecting enter hit and run command inputed.
 */
async function fun_keydown_console(event) {
    if (event.key == "Enter") {
        const content = document.getElementById("console-content");
        const prev_line = document.getElementById("console-line");
        const line_head = document.createElement("label");
        const new_line = document.createElement("label");
        prev_line.contentEditable = false;
        prev_line.id = "";
        line_head.innerText = "# ";
        new_line.contentEditable = true;
        new_line.id = "console-line";
        content.appendChild(document.createElement("br"));
        if (prev_line.innerText.length > 0) {
            const res_label = document.createElement("label");
            const res = await run_command(prev_line.innerText);
            res_label.innerHTML = res[0];
            content.appendChild(res_label);
            content.appendChild(document.createElement("br"));
        }
        content.appendChild(line_head);
        content.appendChild(new_line);
        new_line.focus();
        new_line.addEventListener("keydown", fun_prevent_enter_console_line);
        render();
    }
}
/**
 * An event handler for console-line.onkeydown.
 * It prevents enter and make a newline in console-line.
 */
function fun_prevent_enter_console_line(event) {
    if (event.key === 'Enter') {
        return event.preventDefault();
    }
}
/**
 * A function to send calculation request to backend server.
 * @param {string} stree like (+ (+ 1 2) 3)
 * @param {string} out_type console, 
 */
async function send_calc_request_to_server(stree, out_type) {
    const body = {
        stree: stree,
        out_type: out_type,
    };
    const res = await fetch("http://127.0.0.1:7878", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
        .catch(err => console.log(err))
        .then(data => { return data.json() });
    return res;
}
/**
 * A function to run command.
 * @param {string} command
 * @return {[string, boolean]} [the log, is succeeded]. If you want to hide the log, you have to throw away this.
 */
async function run_command(command) {
    const words = command.split(" ");
    switch (words[0]) {
        case "enumerate":
            if (words.length == 1) {
                return [enumerate(), true];
            } else {
                return [exception_message("'enumerate' has to have 0 parameter."), false];
            }
        case "generate":
            if (words.length == 1) {
                const pos_world = convert_2dscreen_to_3dworld([400, 200]);
                push_block_to_roots(create_block(pos_world[0], pos_world[1], 0, content++));
                return ["generated at (400, 200) on screen", true];
            } else if (words.length == 4) {
                const x = parseInt(words[1]);
                const y = parseInt(words[2]);
                const type = parseInt(words[3]);
                if (isNaN(x)) {
                    return [exception_message("x is not integer."), false];
                } else if (isNaN(y)) {
                    return [exception_message("y is not integer."), false];
                } else if (isNaN(type)) {
                    return [exception_message("type is not integer."), false];
                } else {
                    const pos_world = convert_2dscreen_to_3dworld([x, y]);
                    push_block_to_roots(create_block(pos_world[0], pos_world[1], type, ""));
                    return ["generated at (" + x + ", " + y + ") in screen", true];
                }
            } else {
                return [exception_message("'generate' has to have 0 or 3 parameters."), false];
            }
        case "send":
            const res = await send_calc_request_to_server("(+ (+ 1 2) 3)", "console");
            return [res["result"], true];
        default:
            return [exception_message("invalid command"), false];
    }
}
