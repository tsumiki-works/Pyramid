let log = "# ";
let cur = "";
let content = 1;

/**
 * A funciton to add input charactor to the tail of current command line.
*/
function input_char(char) {
    cur += char;
}
/**
 * A function to remove 1 charactor from the tail of current command line.
*/
function remove_char() {
    cur = cur.slice(0, -1);
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
                return ["pyramid frontend exception: 'enumerate' has to have 0 parameter.", false];
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
                    return ["pyramid frontend exception: x is not integer.", false];
                } else if (isNaN(y)) {
                    return ["pyramid frontend exception: y is not integer.", false];
                } else if (isNaN(type)) {
                    return ["pyramid frontend exception: type is not integer.", false];
                } else {
                    const pos_world = convert_2dscreen_to_3dworld([x, y]);
                    push_block_to_roots(create_block(pos_world[0], pos_world[1], type, ""));
                    return ["generated at (" + x + ", " + y + ") in screen", true];
                }
            } else {
                return ["pyramid frontend exception: 'generate' has to have 0 or 3 parameters.", false];
            }
        case "send":
            const res = await send_calc_request_to_server("(+ (+ 1 2) 3)", "console");
            return [res["result"], true];
        default:
            return ["pyramid frontend exception: invalid command", false];
    }
}
/**
 * A function to enter and run command.
 */
async function enter() {
    log += cur;
    log += "\n";
    if (cur.length == 0) {
        log += "# ";
        cur = "";
    } else {
        const res = await run_command(cur);
        log += res[0];
        log += "\n\n# ";
        cur = "";
    }
}
/**
 * A function push requests for drawing console.
*/
function push_requests_console(requests) {
    requests.push(entity_console());
    const text = log + cur;
    if (text.length == 0)
        return;
    const lines = text.split("\n");
    let cnt = 0;
    for (let i = Math.max(lines.length - 9, 0); i < lines.length; ++i) {
        if (cnt > 9)
            break;
        const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [MENU_WIDTH, CONSOLE_HEIGHT]);
        push_requests_text(
            lines[i],
            pos[0] + 20.0,
            -pos[1] - 20.0 - cnt * 20.0,
            10.0,
            20.0,
            [1.0, 1.0, 1.0, 1.0],
            true,
            requests
        );
        cnt += 1;
    }
}
