import { Roots } from "../block/roots.js";

export class TutorialChecker {
    /**
    * For Macro
    */
    private static readonly symbolTags: string[] = ["pyramid-add-block", "pyramid-sub-block", "pyramid-div-block", "pyramid-mul-block", "pyramid-float-div-block", "pyramid-symbol-block"];
    private static readonly isTagExisting: Function = 
        ((tags: string[]) =>
            (_ => {
                for(const tag of tags){
                    if (document.getElementsByTagName(tag.toUpperCase()).length > 0){
                        return true;
                    };
                }
                return false;
            })
        );
    private static readonly isBlocksHasATag: Function =
        ((types: string[], tag: string) => 
            (_ => {
                let roots = Roots.get();
                for (const root of roots) {
                    if (types.includes(root.tagName.toLowerCase())) {
                        let tmp_children = root.get_children();
                        let has_block: boolean = false;
                        for (const child of tmp_children) {
                            has_block = has_block || (!child.is_empty()) && (child.tagName === tag.toUpperCase());
                        }
                        if (has_block) {
                            return true;
                        }
                    }
                }
                return false;
            })
        );
    private static readonly isEvalResult: Function =
        (res =>
            (_ => {
                let elem = document.getElementById("block-eval-result");
                if (elem !== null) {
                    for (let i = 0; i < elem.children.length; i++) {
                        if (elem.children.item(i).className == "content-wrapper") {
                            return String(res) === elem.children.item(i).firstChild.textContent;
                        }
                    }
                }
                return false;
            })
        );
    static get_checker(problem_number: number): { event: string, check_func: Function }[] {
        let ret_functions = new Array<{ event: string, check_func: Function }>();
        switch (problem_number) {
            case 1:
                ret_functions.push({
                    event: "mouseup",
                    check_func: TutorialChecker.isTagExisting(TutorialChecker.symbolTags)
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(TutorialChecker.symbolTags, "pyramid-literal-block")
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(2)
                });
                break;
            case 2:
                ret_functions.push({
                    event: "mouseup",
                    check_func: TutorialChecker.isTagExisting(TutorialChecker.symbolTags)
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(TutorialChecker.symbolTags, "pyramid-literal-block")
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(false)
                });
                break;
            case 3:
                ret_functions.push({
                    event: "mouseup",
                    check_func: TutorialChecker.isTagExisting(TutorialChecker.symbolTags)
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(TutorialChecker.symbolTags, "pyramid-literal-block")
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(1)
                });
                break;
            case 4:
                ret_functions.push({
                    event: "mouseup",
                    check_func: TutorialChecker.isTagExisting(TutorialChecker.symbolTags)
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(TutorialChecker.symbolTags, "pyramid-literal-block")
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(1)
                });
                break;
            case 5:
                ret_functions.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-list-block");
                        return elems.length > 0;
                    })
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-LIST-BLOCK") {
                                let tmp_children = root.get_children();
                                let count_block: number = 0;
                                for (const child of tmp_children) {
                                    count_block += child.is_empty() ? 1 : 0;
                                }
                                if (count_block > 0) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(["pyramid-list-block"], "pyramid-literal-block")
                });
                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        let ans = [2, 3, 4];
                        let child_idx = 0;
                        let res = true;
                        if(elem !== null){
                            for(let i=0; i < elem.children.length; i++){
                                let child = elem.children.item(i)
                                if(child.tagName === "PYRAMID-LITERAL-BLOCK"){
                                    for (let j = 0; j < child.children.length; j++) {
                                        if (child.children.item(j).className == "content-wrapper") {
                                            res = res && (String(ans[child_idx]) === child.children.item(j).textContent);
                                        }
                                    }
                                    child_idx += 1;
                                }
                            }
                        }else{
                            res = false;
                        }
                        return res;
                    })
                });
                break;
            case 6:
                ret_functions.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-define-block");
                        return elems.length > 0;
                    })
                });

                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-DEFINE-BLOCK") {
                                let tmp_children = root.get_children();
                                let count_block: number = 0;
                                for (const child of tmp_children) {
                                    count_block += child.is_empty() ? 1 : 0;
                                }
                                if (count_block > 0) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });

                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(4)
                });
                break;

            case 7:
                ret_functions.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-if-block");
                        return elems.length > 0;
                    })
                });
                ret_functions.push({
                    event: "mousemove",
                    check_func: TutorialChecker.isBlocksHasATag(["pyramid-if-block"], "pyramid-literal-block")
                });

                ret_functions.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                break;
            case 8:
                ret_functions.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-define-block");
                        return elems.length > 0;
                    })
                });

                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(120)
                });
                break;
            case 9:
                ret_functions.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(14)
                });
                break;
            default:
        }
        return ret_functions;
    }
}