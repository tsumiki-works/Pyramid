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
const BLOCK_ELEM = 6;

// Global variants
let blocks = [];
let x_dragstart = 0;
let y_dragstart = 0;
let listener_move = null;
let listener_up = null;

function createBlock(x, y, w, h) {
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
    block.push(elem);
    elem.onmousedown = event => funBlockOnMouseDown(block, event);
    workspace.appendChild(elem);
    return block;
}

function getCenterX(block) {
    return block[BLOCK_X] - block[BLOCK_W] / 2.0;
}

function getCenterY(block) {
    return block[BLOCK_Y] - block[BLOCK_H] / 2.0;
}

function updatePosition(block, x, y) {
    block[BLOCK_X] = x;
    block[BLOCK_Y] = y;
    block[BLOCK_ELEM].style.left = x + "px";
    block[BLOCK_ELEM].style.top = y + "px";
}

function funBlockOnMouseDown(block, event) {
    const rect = block[BLOCK_ELEM].getBoundingClientRect();
    x_dragstart = event.pageX - rect.left;
    y_dragstart = event.pageY - rect.top;
    if (block[BLOCK_PARENT] != null) {
        block[BLOCK_PARENT][BLOCK_CHILDREN] = block[BLOCK_PARENT][BLOCK_CHILDREN].filter(n => n !== block);
    }
    block[BLOCK_PARENT] = null;
    block[BLOCK_CHILDREN] = [];
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
        if ((getCenterX(block) - getCenterX(blocks[i])) ** 2 >= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2)
            continue;
        if ((getCenterY(block) - getCenterY(blocks[i])) ** 2 >= Math.min(block[BLOCK_H], blocks[i][BLOCK_H]) ** 2)
            continue;
        if (getCenterY(block) > getCenterY(blocks[i])) {
            updatePosition(block, getCenterX(blocks[i]) + block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
            blocks[i][BLOCK_CHILDREN].push(block);
            block[BLOCK_PARENT] = blocks[i];
            alert("connected");
        } else {
            updatePosition(block, getCenterX(blocks[i]) + block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] - block[BLOCK_H]);
            block[BLOCK_CHILDREN].push(blocks[i]);
            blocks[i][BLOCK_PARENT] = block;
            alert("connected");
        }
    }
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
    blocks.push(createBlock(200, 100, 100, 50));
}

function clickEnumerator() {
    /*let roots = [];
    for (const i of blocks) {
        if (i.parent === -1) {
            roots.push(i.idx);
        }
    }
    let s = "";
    function enumerate(array) {
        for (const i of array) {
            s += "(" + i;
            if (blocks[i].children.length > 0) {
                s += " ";
                enumerate(blocks[i].children);
            }
            s += ")";
        }
    }
    enumerate(roots);
    alert(s);
    */
}

// Entry point
window.onload = () => {
    generator.onclick = clickGenerator;
    enumerator.onclick = clickEnumerator;
}
