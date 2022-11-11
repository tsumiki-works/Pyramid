function enumerate(node) {
    let res = "";
    if (node == null) { }
    else if (node[BLOCK_IDX_CHILDREN_NUM] == 0) {
        res += node[BLOCK_IDX_CONTENT];
    }
    else {
        console.log("Hello!");
        res += "(";
        res += node[BLOCK_IDX_CONTENT];
        node[BLOCK_IDX_CHILDREN].forEach(child => {
            res += " ";
            res += enumerate(child);
        });
        res += ")";
    }
    return res;
}

function fuga() {
    roots.forEach(root => {
        let res = enumerate(root);
        console.log(res);
    });
}