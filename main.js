// Global constants
const workspace = document.getElementById("workspace");
const generator = document.getElementById("generator");
const enumerator = document.getElementById("enumerator");

// Global variants
let blocks = [];
let x_dragstart = 0;
let y_dragstart = 0;

// Class definitions
class Block {
    constructor(x, y, w, h, idx) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.idx = idx;
        this.parent = -1;
        this.children = [];
        this.elem = document.createElement("div");
        this.elem.style.left = x + "px";
        this.elem.style.top = y + "px";
        this.elem.style.width = w + "px";
        this.elem.style.height = h + "px";
        this.elem.classList.add("block");
        this.elem.onmousedown = this.onMouseDown;
        workspace.appendChild(this.elem);
    }
    get centerX() {
        return this.x - this.w / 2.0;
    }
    get centerY() {
        return this.y - this.y / 2.0;
    }
    changePosition(x, y) {
        this.x = x;
        this.y = y;
        this.elem.style.left = x + "px";
        this.elem.style.top = y + "px";
    }
    onMouseDown = (event) => {
        const rect = this.elem.getBoundingClientRect();
        x_dragstart = event.pageX - rect.left;
        y_dragstart = event.pageY - rect.top;
        if (this.parent >= 0)
            blocks[this.parent].children = blocks[this.parent].children.filter(n => n !== this.idx);
        this.parent = -1;
        this.children = [];
        document.addEventListener("mousemove", this.onMouseMove, false);
        document.addEventListener("mouseup", this.onMouseUp, false);
        document.addEventListener("mouseleave", this.onMouseUp, false);
    }
    onMouseMove = (event) => {
        const rect = workspace.getBoundingClientRect();
        event.preventDefault();
        let x = Math.max(rect.left, Math.min(rect.right, event.pageX - x_dragstart));
        let y = Math.max(rect.top, Math.min(rect.bottom, event.pageY - y_dragstart));
        this.changePosition(x, y);
    }
    onMouseUp = (event) => {
        for (let i = 0; i < blocks.length; ++i) {
            if (i == this.idx)
                continue;
            if ((this.centerX - blocks[i].centerX) ** 2 < Math.min(this.w / 2.0, blocks[i].w / 2.0) ** 2) {
                if ((this.centerY - blocks[i].centerY) ** 2 < Math.min(this.h / 2.0, blocks[i].h / 2.0) ** 2) {
                    if (this.centerY > blocks[i].centerY) {
                        this.changePosition(blocks[i].centerX + this.w / 2.0, blocks[i].y + blocks[i].h);
                        blocks[i].children.push(this.idx);
                        this.parent = blocks[i].idx;
                        alert("connected : " + blocks[i].idx + " has " + this.idx);
                    } else {
                        this.changePosition(blocks[i].centerX + this.w / 2.0, blocks[i].y - this.h);
                        this.children.push(blocks[i].idx);
                        blocks[i].parent = this.idx;
                        alert("connected : " + this.idx + " has " + blocks[i].idx);
                    }
                }
            }
        }
        document.removeEventListener("mousemove", this.onMouseMove, false);
        document.removeEventListener("mouseup", this.onMouseUp, false);
        document.removeEventListener("mouseleave", this.onMouseUp, false);
    }
}

// Functions
function getSquareDistance(x1, x2, y1, y2) {
    return (x1 - x1) ** 2 + (y1 - y2) ** 2;
}

// Events
function clickGenerator() {
    blocks.push(new Block(200, 100, 100, 50, blocks.length));
}
function clickEnumerator() {
    let roots = [];
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
}

// Entry point
window.onload = () => {
    generator.onclick = clickGenerator;
    enumerator.onclick = clickEnumerator;
}
