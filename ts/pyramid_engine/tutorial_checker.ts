import { Roots } from "../block/roots.js";

export class TutorialChecker {
    static get_checker(problem_number: number): {event: string, check_func: Function}[]{
        switch(problem_number){
            case 1:
                // TODO: Write this.
                let ret_functions = new Array<{event: string, check_func: Function}>();
                ret_functions.push({
                    event: "mouseup",
                    check_func: (_ => { 
                        let elems = document.getElementsByTagName("pyramid-symbol-block");
                        return elems.length > 0;
                    })
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for(const root of roots){
                            if(root.tagName === "PYRAMID-SYMBOL-BLOCK"){
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for(const child of tmp_children){
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if(has_block){
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                return ret_functions;  
            default:
                return [];
        }
    }
}
