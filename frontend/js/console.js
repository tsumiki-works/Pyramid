let log = "# ";
let cur = "";

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
let content = 1;
/**
 * A function to send current command with enter.
*/
async function enter() {
    log += cur;
    log += "\n";
    if (cur.length > 0) {
        if(cur[0] == '$'){
            // Console Commands for debug
            cmd = cur.slice(1, cur.length);
            cmd_array = cmd.split(" ");
            if(cmd_array.length == 1){
                switch (cmd_array[0]){
                    case "enumerate":
                        log += enumerate();
                        break;
                    case "generate":
                        const pos_world = convert_2dscreen_to_3dworld([400, 200]);
                        push_block_to_roots(create_block(pos_world[0], pos_world[1], 0, content++));
                        log += "generated at (400, 200) in screen";
                        break;
                    default:
                        log += "Console Error: Invalud Command"
                }
            }else if(cmd_array.length == 3){
                switch(cmd_array[0]){
                    case "generate":
                        const pos_world = convert_2dscreen_to_3dworld([cmd_array[1], cmd_array[2]]);
                        push_block_to_roots(create_block(pos_world[0], pos_world[1], 0, ""));
                        log += "generated at (" + cmd_array[1] + ", " + cmd_array[2] + ") in screen";
                        break;
                    default:
                        log += "Console Error: Invalud Command"
                }
            }
        }else{
            const res = await fetch("http://127.0.0.1:7878", {
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                body: cur
            })
            .catch(err => console.log(err))
            .then(data => {return data.text()})
            log += res;
        }
        log += "\n\n# ";
    }
    cur = "";
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
