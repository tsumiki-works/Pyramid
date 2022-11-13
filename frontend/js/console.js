const console_div = document.getElementById("console");
const content = document.getElementById("console-content");
const console_log = document.getElementById("console-log");
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
    const line = document.getElementById("console-line");
    line.addEventListener("keydown", fun_prevent_enter_console_line);
    line.focus();
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
        await run_command(document.getElementById("console-line").innerText);
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
async function send_calc_request_to_server(defines, stree, out_type) {
    const res = await fetch("http://127.0.0.1:7878", {
        "method": "POST",
        "header": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "defines": defines,
            "stree": stree,
            "out_type": out_type,
        }),
    })
        .catch(err => alert(err))
        .then(data => { return data.json(); });
    return res;
}
/**
 * A function to run command.
 * @param {string} command
 */
async function run_command(command) {
    const words = command.trim().split(/\s+/);
    console.log(words[0]);
    let res = "";
    switch (words[0]) {
        case "":
            break;
        case "generate":
            if (words.length == 1) {
                const pos_world = convert_2dscreen_to_3dworld([400, 200]);
                get_roots().push(create_block(pos_world[0], pos_world[1], 0, "0"));
                res = "generated at (400, 200) on screen";
            } else if (words.length == 4) {
                const x = parseInt(words[1]);
                const y = parseInt(words[2]);
                const type = parseInt(words[3]);
                if (isNaN(x)) {
                    res = exception_message("x is not integer.");
                } else if (isNaN(y)) {
                    res = exception_message("y is not integer.");
                } else if (isNaN(type)) {
                    res = exception_message("type is not integer.");
                } else {
                    const pos_world = convert_2dscreen_to_3dworld([x, y]);
                    get_roots().push(create_block(pos_world[0], pos_world[1], type, "0"));
                    res = "generated at (" + x + ", " + y + ") in screen";
                }
            } else {
                res = exception_message("'generate' has to have 0 or 3 parameters.");
            }
            break;
        case "eval":
            let stree = "";
            if (words.length > 1) {
                let tmp = words;
                tmp.shift();
                stree = tmp.join(" ");
                const response = await send_calc_request_to_server(["(define int add (x y) (+ x y))", "(define int hoge () 1)"], stree, "console");
                res = maybe_backend_error_message(response["result"]);
            } else {
                res = exception_message("'eval' has to have 1 parameter.")
            }
            break;
        default:
            res = exception_message("invalid command '" + words[0] + "'.");
            break;
    }
    start_newline(res);
}
/**
 * A function to start new line.
 * @param {string} log if it's "" then nothing will be printed.
 */
function start_newline(log) {
    const prev_line = document.getElementById("console-line");
    const prev_line_head = document.getElementById("console-line-head");
    const line_head = document.createElement("label");
    const new_line = document.createElement("label");
    prev_line.removeEventListener("keydown", fun_prevent_enter_console_line);
    prev_line.contentEditable = false;
    prev_line.id = "";
    prev_line_head.id = "";
    line_head.innerText = "# ";
    line_head.id = "console-line-head";
    new_line.contentEditable = true;
    new_line.id = "console-line";
    console_log.innerHTML += "# " + prev_line.innerText + "<br>";
    content.removeChild(prev_line);
    content.removeChild(prev_line_head);
    if (log.length != 0) {
        console_log.innerHTML += log + "<br>";
    }
    content.appendChild(line_head);
    content.appendChild(new_line);
    new_line.focus();
    new_line.addEventListener("keydown", fun_prevent_enter_console_line);
}