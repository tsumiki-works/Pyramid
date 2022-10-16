// Global constants
const workspace = document.getElementById("workspace");
const enumerator = document.getElementById("enumerator");
const reset = document.getElementById("reset");
const trashbox = document.getElementById("trashbox");
const BLOCK_X = 0;
const BLOCK_Y = 1;
const BLOCK_W = 2;
const BLOCK_H = 3;
const BLOCK_PARENT = 4;
const BLOCK_CHILDREN = 5;
const BLOCK_CHILDREN_NUM = 6;
const BLOCK_CHILDREN_CONNECTIONS = 7;
const BLOCK_ID = 8;
const BLOCK_TYPE = 9;
const BLOCK_CONTENT = 10;
const BLOCK_ELEM = 11;

// Global variants
let blocks = [];
let x_dragstart = 0;
let y_dragstart = 0;
let listener_move = null;
let listener_up = null;

let menublocks = [];
let highlightBlock = [];

// Temp variants for BLOCK_ID
let block_num = 0;
let menublock_num = 0;

function createBlock(x, y, w, h, t, c, n) {
    const elem = document.createElement("div");
    elem.style.left = x + "px";
    elem.style.top = y + "px";
    elem.style.width = (n == 0 ? w : w * n - 50) + "px";
    elem.style.height = h + "px";
    elem.classList.add(t);
    elem.innerText = c[0];

    let block = [];
    block.push(x);
    block.push(y);
    block.push(n == 0 ? w : w * n - 50);
    block.push(h);
    block.push(null);
    block.push(new Array(n));
    block.push(n);
    block.push(getSplitLocalCenterX(n));
    block.push(block_num);
    block.push(t);
    block.push(c);
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

function createmenuBlock(x, y, w, h, t, c, n) {
    const elem = document.createElement("div");
    elem.style.left = x + "px";
    elem.style.top = y + "px";
    elem.style.width = (n == 0 ? w : w * n - 50) + "px";
    elem.style.height = h + "px";
    elem.classList.add(t);
    elem.innerHTML = c[0];
    let menublock = [];
    menublock.push(x);
    menublock.push(y);
    menublock.push(n == 0 ? w : w * n - 50);
    menublock.push(h);
    menublock.push(null);
    menublock.push([]);
    menublock.push(n);
    menublock.push([]);
    menublock.push(menublock_num);
    menublock.push(t);
    menublock.push(c[0]);
    menublock.push(elem);
    elem.onmousedown = event => funBlockOnMouseDown2(menublock, event);
    menu.appendChild(elem);

    menublock_num += 1;

    return menublock;
}

menublocks.push(createmenuBlock(10, 80, 100, 50, "plus", ["+"], 2));
menublocks.push(createmenuBlock(10, 140, 100, 50, "minus", ["-"], 2));
menublocks.push(createmenuBlock(10, 200, 100, 50, "times", ["*"], 2));
menublocks.push(createmenuBlock(10, 260, 100, 50, "divide", ["/"], 2));
menublocks.push(createmenuBlock(10, 320, 100, 50, "number", ["number"], 0));

function getCenterX(block) {
    return block[BLOCK_X] + block[BLOCK_W] / 2.0;
}

function getCenterY(block) {
    return block[BLOCK_Y] + block[BLOCK_H] / 2.0;
}

//n: input split, idx: index
function getSplitLocalCenterX(n) {
    let ret = [];
    for(let idx = 0; idx < n; ++idx){
        if(n > 0){
            ret.push(25 + 100 * idx);
        }
    }
    return ret
}

function updatePosition(block, x, y) {
    block[BLOCK_X] = x;
    block[BLOCK_Y] = y;
    block[BLOCK_ELEM].style.left = x + "px";
    block[BLOCK_ELEM].style.top = y + "px";
}

function updatePosition2(menublock, x, y) {
    menublock[BLOCK_X] = x;
    menublock[BLOCK_Y] = y;
    menublock[BLOCK_ELEM].style.left = x + "px";
    menublock[BLOCK_ELEM].style.top = y + "px";
}

function expandBlockWidth(w, n){

}

function shrinkBlockWidth(w, n){
    
}

function createHighlightBlock(block, x, y){
    let isSameBlock = false;
    if(highlightBlock.length > 0){
        if(highlightBlock[0] !== block){
            deleteHighlightBlock();
        }else{
            isSameBlock = true;
        }
    }
    if(!isSameBlock){
        const elem = document.createElement("div");
        elem.style.left = x + "px";
        elem.style.top = y + "px";
        elem.style.width = block[BLOCK_W] + "px";
        elem.style.height = block[BLOCK_H] + "px";
        elem.style.opacity = 0.3;
        elem.classList.add(block[BLOCK_TYPE]);
        elem.setAttribute("id", "highlight");
        elem.innerText = block[BLOCK_CONTENT][0];
        workspace.appendChild(elem);

        block[BLOCK_ELEM].style.opacity = 0;

        highlightBlock.push(block);
        highlightBlock.push(elem);
    }
}

function deleteHighlightBlock(){
    if(highlightBlock.length != 0){
        highlightBlock[0][BLOCK_ELEM].style.opacity = 1.0;
        workspace.removeChild(highlightBlock[1]);
        highlightBlock.splice(0);
    }
}

// Event/Block
function funBlockOnMouseDown(block, event) {
    const rect = block[BLOCK_ELEM].getBoundingClientRect();
    x_dragstart = event.pageX - rect.left;
    y_dragstart = event.pageY - rect.top;
    //delete me from parent's children
    if (block[BLOCK_PARENT] != null) {
        block[BLOCK_PARENT][BLOCK_CHILDREN][block[BLOCK_PARENT][BLOCK_CHILDREN].findIndex(n => n === block)] = null;
    }
    //delete child's parent
    for(const b of blocks){
        if(block[BLOCK_CHILDREN].includes(b)){
            b[BLOCK_PARENT] = null;
        }
    }
    block[BLOCK_PARENT] = null;
    block[BLOCK_CHILDREN] = new Array(block[BLOCK_CHILDREN_NUM]);
    

    listener_move = event => funBlockOnMouseMove(block, event);
    listener_up = event => funBlockOnMouseUp(block, event);
    document.addEventListener("mousemove", listener_move, false);
    document.addEventListener("mouseup", listener_up, false);
    document.addEventListener("mouseleave", listener_up, false);
}

function funBlockOnMouseDown2(menublock, event) {
    const rect = menublock[BLOCK_ELEM].getBoundingClientRect();
    x_dragstart = event.pageX - rect.left;
    y_dragstart = event.pageY - rect.top;
    if (menublock[BLOCK_PARENT] != null) {
        menublock[BLOCK_PARENT][BLOCK_CHILDREN] = menublock[BLOCK_PARENT][BLOCK_CHILDREN].filter(n => n !== block);
    }
/*    menublock[BLOCK_PARENT] = null;
    menublock[BLOCK_CHILDREN] = []; */
    listener_move = event => funBlockOnMouseMove2(menublock, event);
    listener_up = event => funBlockOnMouseUp2(menublock, event);
    document.addEventListener("mousemove", listener_move, false);
    document.addEventListener("mouseup", listener_up, false);
    document.addEventListener("mouseleave", listener_up, false);
}

function funBlockOnMouseMove(block, event) {
    const rect = workspace.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(rect.right, event.pageX - x_dragstart));
    const y = Math.max(rect.top, Math.min(rect.bottom, event.pageY - y_dragstart));
    updatePosition(block, x, y);

    //trashbox
    trash_rect = trashbox.getBoundingClientRect();
    if(getSquareDistance(event.pageX, trash_rect.left + trash_rect.width / 2, event.pageY, trash_rect.top + trash_rect.height / 2) < trash_rect.width ** 2){
        trashbox.src = "images/trash-opened.svg";
    }else{
        trashbox.src = "images/trash-closed.svg";
    }

    //highlight
    isHighlight = false;
    for (let i = 0; i < blocks.length; ++i) {
        if (blocks[i] === block)
            continue;
        if ((getCenterY(block) - getCenterY(blocks[i])) ** 2 >= Math.min(block[BLOCK_H], blocks[i][BLOCK_H]) ** 2)
            continue;

        // (parent, child) = (block[i], block)
        if (getCenterY(block) > getCenterY(blocks[i])) {
            // Search nearest parent's connection
            for(let j = 0; j < blocks[i][BLOCK_CHILDREN_NUM]; ++j){
                if ((getCenterX(block) - blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] - blocks[i][BLOCK_X]) ** 2 >= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2 || blocks[i][BLOCK_CHILDREN][j] != null) 
                    continue;
                //fit block size
                if(block[BLOCK_CHILDREN_NUM] > 1){
                    //Non-Implement
                    isHighlight = true;
                    createHighlightBlock(block, blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] + blocks[i][BLOCK_X] - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
                }else{
                    isHighlight = true;
                    createHighlightBlock(block, blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] + blocks[i][BLOCK_X] - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
                }
            }
        }
    }
    if(!isHighlight && highlightBlock.length > 0){
        deleteHighlightBlock();
    }

    event.preventDefault();
}
function funBlockOnMouseMove2(menublock, event) {
    const rect = all.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(rect.right, event.pageX - x_dragstart));
    const y = Math.max(rect.top, Math.min(rect.bottom, event.pageY - y_dragstart));
    updatePosition2(menublock, x, y);
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
                if ((getCenterX(block) - blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] - blocks[i][BLOCK_X]) ** 2 >= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2 || blocks[i][BLOCK_CHILDREN][j] != null) 
                    continue;
                //fit block size
                if(block[BLOCK_CHILDREN_NUM] > 1){
                    //Non-Implement
                    updatePosition(block, blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] + blocks[i][BLOCK_X] - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
                }else{
                    updatePosition(block, blocks[i][BLOCK_CHILDREN_CONNECTIONS][j] + blocks[i][BLOCK_X] - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] + blocks[i][BLOCK_H]);
                }
                blocks[i][BLOCK_CHILDREN][j] = block;
                block[BLOCK_PARENT] = blocks[i];
            }
        // (parent, child) = (block, block[i])
        } else {
            if((getCenterX(block) - getCenterX(blocks[i])) ** 2 <= Math.min(block[BLOCK_W] / 2.0, blocks[i][BLOCK_W] / 2.0) ** 2 && block[BLOCK_CHILDREN_NUM] != 0){
                updatePosition(block, getCenterX(blocks[i]) - block[BLOCK_W] / 2.0, blocks[i][BLOCK_Y] - block[BLOCK_H]);
                block[BLOCK_CHILDREN][0] = blocks[i];
                blocks[i][BLOCK_PARENT] = block;
            }
        }
    }
    deleteHighlightBlock();
    document.removeEventListener("mousemove", listener_move, false);
    document.removeEventListener("mouseup", listener_up, false);
    document.removeEventListener("mouseleave", listener_up, false);
    listener_move = null;
    listener_up = null;
    if(getSquareDistance(event.pageX, trash_rect.left + trash_rect.width / 2, event.pageY, trash_rect.top + trash_rect.height / 2) < trash_rect.width ** 2){
        workspace.removeChild(block[BLOCK_ELEM]);
        blocks = blocks.filter(n => n !== block);
        trashbox.src = "images/trash-closed.svg";
    }
}

function funBlockOnMouseUp2(menublock, event) {
        if (menublock[BLOCK_X] > 224 || menublock[BLOCK_Y] > 800 ) {
            if (menublock[BLOCK_TYPE] == "plus") {
                blocks.push(createBlock(menublock[BLOCK_X], menublock[BLOCK_Y], 100, 50, "plus", ["+"], 2));
                const x = 10;
                const y = 80;
                updatePosition2(menublock, x, y);
                event.preventDefault();
            } else if(menublock[BLOCK_TYPE] == "minus") {
                blocks.push(createBlock(menublock[BLOCK_X], menublock[BLOCK_Y], 100, 50, "minus", ["-"], 2));
                const x = 10;
                const y = 140;
                updatePosition2(menublock, x, y);
                event.preventDefault();
            } else if(menublock[BLOCK_TYPE] == "times") {
                blocks.push(createBlock(menublock[BLOCK_X], menublock[BLOCK_Y], 100, 50, "times", ["*"], 2));
                const x = 10;
                const y = 200;
                updatePosition2(menublock, x, y);
                event.preventDefault();
            } else if(menublock[BLOCK_TYPE] == "divide") {
                blocks.push(createBlock(menublock[BLOCK_X], menublock[BLOCK_Y], 100, 50, "divide", ["/"], 2));
                const x = 10;
                const y = 260;
                updatePosition2(menublock, x, y);
            } else if(menublock[BLOCK_TYPE] == "number") {
                blocks.push(createBlock(menublock[BLOCK_X], menublock[BLOCK_Y], 100, 50, "number", [document.forms["integer_form"].elements["integer_num"].value], 0));
                const x = 10;
                const y = 320;
                updatePosition2(menublock, x, y);
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
    debugField.style.left = (block[BLOCK_X] + block[BLOCK_W] + 20) + "px";
    debugField.style.top = (block[BLOCK_Y] - 20) + "px";
    debugField.style.position = "absolute";
    debugField.style.backgroundColor = "#7f7f7f";
    debugField.style.opacity = 0.75;
    let t = "id: "+ block[BLOCK_ID] + ", type: " + block[BLOCK_TYPE] + "\n Content_NAME: " + block[BLOCK_CONTENT][0];
    t += "\nleft: "+ block[BLOCK_X] +", top: " + block[BLOCK_Y] + "\n";
    t += "width: " + block[BLOCK_W] + ", height: " + block[BLOCK_H];
    debugField.innerText = t;
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
    blocks.push(createBlock(200, 100, 100, 50, "null", ["null"], 1));
}

function clickGenerator2(n, t, c) {
    blocks.push(createBlock(200, 100, (n == 0 ? 100 : 100 * n), 50, t, c, n));
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
                if(block != null){
                    s += block[BLOCK_CONTENT][0] + " ";
                    if(block[BLOCK_CHILDREN].length > 0){
                        enumerate(block[BLOCK_CHILDREN]);
                    }
                }
            }
            s += ")";
        }
        enumerate(roots);
        alert(s);
    }
}

function clickReset(){
    blocks = [];
    block_num = 0;
    function del(p){
        if(p.firstChild != null){
            p.removeChild(p.firstChild);
            del(p);
        }
    }
    del(workspace);
}

// Entry point
window.onload = () => {
    enumerator.onclick = clickEnumerator;
    reset.onclick = clickReset;

    workspace.onmousedown = event => screenOnMouseClick(event);
}
