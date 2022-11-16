// A module to create windows, such as popup-menu.

/**
 * A function to create popup-menu nearly clicked-block.
 * Create below DOMs basicly.
 * The contents of `li` are changed by the block's type.
 * 
    <div id="popup-menu">
        <ul>
            <li class="popup-menu-item">Run</li> # if block isn't int, float.
            <li class="popup-menu-item">Edit</li> # if block is int or float.
            <li class="popup-menu-item">Delete</li>
        </ul>
    </div>
 * 
 * @param {object} block 
 */
function create_popup_menu(event, block){
    let elem = document.createElement("div");
    elem.id = "popup-menu";
    elem.style.display = "block";
    elem.style.left = event.pageX + "px";
    elem.style.top = event.pageY + "px";
    let elem_ul = document.createElement("ul");
    let elem_li_array = [];
    if(block.type == 0){
        let elem_li_edit = document.createElement("li");
        elem_li_edit.classList.add("popup-menu-item");
        elem_li_edit.innerText = "編集";
        elem_li_edit.onclick = (e => popup_menu_content_edit(block));
        elem_li_array.push(elem_li_edit);
        
    }else if([1, 2, 3, 4].includes(block.type)){
        let elem_li_run = document.createElement("li");
        elem_li_run.classList.add("popup-menu-item");
        elem_li_run.innerText = "実行";
        elem_li_run.onclick = (e => {run_command("eval " + enumerate(block)); delete_popup_menu()});
        elem_li_array.push(elem_li_run);
    }else{
        alert("Pyramid Frontend error: the block type is not considered in `window.js`");
    }
    let elem_li_del = document.createElement("li");
    elem_li_del.classList.add("popup-menu-item");
    elem_li_del.innerText = "削除";
    elem_li_del.onclick = (e => {popup_menu_content_delete(block); delete_popup_menu()});
    elem_li_array.push(elem_li_del);

    for(let i = 0; i < elem_li_array.length; i++){
        elem_ul.appendChild(elem_li_array[i]);
    }
    elem.appendChild(elem_ul);
    document.body.appendChild(elem);
}

function delete_popup_menu(){
    const elem = document.getElementById("popup-menu");
    if(elem !== null){
        document.body.removeChild(elem);
    }
}

function popup_menu_content_delete(block){
    remove_block_from_roots(block);
    render();
}

function popup_menu_content_edit(block){
    const elem_menu = document.getElementById("popup-menu");
    elem_menu.removeChild(elem_menu.firstChild);

    const elem_edit = document.createElement("input");
    elem_edit.id = "popup-menu-edit";
    elem_edit.style.width = "100px";
    elem_edit.style.height = "30px";
    elem_edit.contentEditable = true;
    elem_edit.addEventListener("keydown", (e => {
        if(e.key == "Enter"){
            if(!isNaN(elem_edit.value)){
                block.content = elem_edit.value;
                render();
            }else{
                start_newline(exception_message("This block's value must be integer."));
            }
            delete_popup_menu();
        }
    }));
    elem_menu.appendChild(elem_edit);
    elem_edit.focus();
}