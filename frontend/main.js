// Global constants
const workspace = document.getElementById("workspace");
const generator = document.getElementById("generator");
const enumerator = document.getElementById("enumerator");
const BLOCK_X = 0;
const BLOCK_Y = 1;
const BLOCK_W = 2;
const BLOCK_H = 3;
const BLOCK_PARENT = 4;
const BLOCK_CHILDREN = 5;
const BLOCK_ID = 6;
const BLOCK_TYPE = 7;
const BLOCK_CHILDREN_NUM = 8;
const BLOCK_ELEM = 9;

// Global variants
let blocks = [];
let x_dragstart = 0;
let y_dragstart = 0;
let listener_move = null;
let listener_up = null;

// Temp variants for BLOCK_ID
let block_num = 0;

function createBlock(x, y, w, h, t, n) {
    const elem = document.createElement("div");
    elem.style.left = x + "px";
    elem.style.top = y + "px";
    elem.style.width = w + "px";
    elem.style.height = h + "px";
    elem.classList.add("block");
    let block = [];
    block.push(x);
    block.push(y);
    block.push(w);
    block.push(h);
    block.push(null);
    block.push([]);
    block.push(block_num);
    block.push(t);
    block.push(n);
    block.push(elem);
    elem.onmousedown = event => funBlockOnMouseDown(block, event);
    elem.addEventListener('mouseover', (event) => {
        createBlockHoverDebug(event, block);
    }, false);
    elem.addEventListener('mouseleave', (event)=> {
        deleteBlockHoverDebug(event, block);
    }, false);
    workspace.appendChild(elem);

    block_num += 1;

    return block;
}

function getCenterX(block) {
    return block[BLOCK_X] + block[BLOCK_W] / 2.0;
}

function getCenterY(block) {
    return block[BLOCK_Y] + block[BLOCK_H] / 2.0;
}

//n: input split, idx: index
function getSplitCenterX(block, idx) {
    let ret = -1;
    let n = block[BLOCK_CHILDREN_NUM];
    if(n > 0 && idx < n){
        ret = block[BLOCK_X] + (((block[BLOCK_W] / (2 * n))) * ((2 * idx) + 1));
    }
    return ret 
}

function updatePosition(block, x, y) {
    block[BLOCK_X] = x;
    block[BLOCK_Y] = y;
    block[BLOCK_ELEM].style.left = x + "px";
    block[BLOCK_ELEM].style.top = y + "px";
}

// Event/Block

function funBlockOnMouseDown(block, event) {
    const rect = block[BLOCK_ELEM].getBoundingClientRect();
    x_dragstart = event.pageX - rect.left;
    y_dragstart = event.pageY - rect.top;
    if (block[BLOCK_PARENT] != null) {
        block[BLOCK_PARENT][BLOCK_CHILDREN] = block[BLOCK_PARENT][BLOCK_CHILDREN].filter(n => n !== block);
    }
    for(const b of blocks){
        if(block[BLOCK_CHILDREN].includes(b)){
            b[BLOCK_PARENT] = null;
        }
    }
    block[BLOCK_PARENT] = null;
    block[BLOCK_CHILDREN] = [];
    
    console.log("MouseDown");
    console.log(blocks[1]);

    listener_move = event => funBlockOnMouseMove(block, event);
    listener_up = event => funBlockOnMouseUp(block, event);
    document.addEventListener("mousemove", listener_move, false);
    document.addEventListener("mouseup", listener_up, false);
    document.addEventListener("mouseleave", listener_up, false);
}

function funBlockOnMouseMove(block, event) {
    const rect = workspace.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(rect.right, event.pageX - x_dragstart));
    const y = Math.max(rect.top, Math.min(rect.bottom, event.pageY - y_dragstart));
    updatePosition(block, x, y);
    event.preventDefault();
}

function funBlockOnMouseUp(block, event) {
    for (let i = 0; i < blocks.length; ++i) {
        if (blocks[i] === block)
            continue;
        if ((getCenterY(block) - getCenterY(blocks[i])) ** 2 >= Math.min(block[BLOCK_H], blocks[i][BLOCK_H]) ** 2)
            continue;

        // (parent, child) = (block[i], block)
        if (getCenterY(block) > getCenterY(blocks[i])) {
            // Search nearest parent's connection
            for(let j = 0; j < blocks[i][BLOCK_CHILDREN_NUM]; ++j){
                if ((getCenterX(block) - getSplitCenterX(blocks[i], j)) ** 2 >= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2)
                    continue;
                updatePosition(block, getSplitCenterX(blocks[i], j) - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
                blocks[i][BLOCK_CHILDREN].push(block);
                block[BLOCK_PARENT] = blocks[i];
                console.log("MouseUp");
                console.log(blocks[1]);
            }
        } else {
            if((getCenterX(block) - getCenterX(blocks[i])) ** 2 <= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2){
                updatePosition(block, getCenterX(blocks[i]) - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] - block[BLOCK_H]);
                block[BLOCK_CHILDREN].push(blocks[i]);
                blocks[i][BLOCK_PARENT] = block;
                console.log("MouseUp");
                console.log(blocks[1]);
            }
        }
    }
    document.removeEventListener("mousemove", listener_move, false);
    document.removeEventListener("mouseup", listener_up, false);
    document.removeEventListener("mouseleave", listener_up, false);
    listener_move = null;
    listener_up = null;
}

function createBlockHoverDebug(event, block){
    debugField = document.createElement("div");
    debugField.id = "debug";
    debugField.style.left = (block[BLOCK_X] + block[BLOCK_W] + 10) + "px";
    debugField.style.top = (block[BLOCK_Y] - 10) + "px";
    debugField.style.width = "50px";
    debugField.style.height = "20px";
    debugField.style.position = "absolute";
    debugField.style.backgroundColor = "#7f7f7f";
    debugField.style.opacity = 0.75;
    debugField.innerText = "id : "+ block[BLOCK_ID];
    workspace.appendChild(debugField);
}

function deleteBlockHoverDebug(event, block){
    function del(){
        target = document.getElementById("debug");
        if(target != null){
            workspace.removeChild(target);
            del();
        }
    }
    del();
}

// Event/workspace

function screenOnMouseClick(event) {
    // if not glab block
    // this will fix -> create new global variant for judge of clicking object
    if(listener_move == null && listener_up == null){
        listener_move = event => screenOnMouseMove(event);
        listener_up = event => screenOnMouseUp(event);

        x_dragstart = event.pageX;
        y_dragstart = event.pageY;

        document.addEventListener("mousemove", listener_move, false);
        document.addEventListener("mouseup", listener_up, false);
        document.addEventListener("mouseleave", listener_up, false);
    }
}

// maybe make bugs
function screenOnMouseMove(event) {
    const workspaceRect = workspace.getBoundingClientRect();
    let deltaMoveX = event.pageX - x_dragstart;
    let deltaMoveY = event.pageY - y_dragstart;
    for (const b of blocks){
        updatePosition(b, b[BLOCK_X] + deltaMoveX, b[BLOCK_Y] + deltaMoveY);
    }
    x_dragstart = event.pageX;
    y_dragstart = event.pageY;
    event.preventDefault();
}

function screenOnMouseUp(event) {
    document.removeEventListener("mousemove", listener_move, false);
    document.removeEventListener("mouseup", listener_up, false);
    document.removeEventListener("mouseleave", listener_up, false);

    listener_move = null;
    listener_up = null;
}

// Functions
function getSquareDistance(x1, x2, y1, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

// Button
function clickGenerator() {
    blocks.push(createBlock(200, 100, 100, 50, "normal", 1));
}

function clickGenerator2(n) {
    blocks.push(createBlock(200, 100, 100 * n, 50, "longer", n));
}

function clickEnumerator() {
    let roots = [];
    for (const i of blocks) {
        if (i[BLOCK_PARENT] === null) {
            roots.push(i);
        }
    }
    console.log(roots);
    if(roots.length == 0 ){
        alert("There are no blocks");
    }else if(roots.length > 1){
        alert("All blocks aren't connected")
    }else{
        let s = "";
        function enumerate(array) {
            s += "("
            for (const block of array){
                s += block[BLOCK_ID] + " ";
                if(block[BLOCK_CHILDREN].length > 0){
                    enumerate(block[BLOCK_CHILDREN]);
                }
            }
            s += ")";
        }
        enumerate(roots);
        alert(s);
    }
}

// Entry point
window.onload = () => {
    generator.onclick = clickGenerator;
    enumerator.onclick = clickEnumerator;

    workspace.onmousedown = event => screenOnMouseClick(event);
}
