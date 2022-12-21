import { Roots } from "../block/roots.js";

export class TutorialChecker {
    /**
    * For Macro
    */

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
        switch (problem_number) {
            case 1:
                // TODO: Write this.
                let ret_functions1 = new Array<{ event: string, check_func: Function }>();
                ret_functions1.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-symbol-block");
                        return elems.length > 0;
                    })
                });
                ret_functions1.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-SYMBOL-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions1.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions1.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(2)
                });
                return ret_functions1;
            case 2:
                // TODO: Write this.
                let ret_functions2 = new Array<{ event: string, check_func: Function }>();
                ret_functions2.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-symbol-block");
                        return elems.length > 0;
                    })
                });
                ret_functions2.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-SYMBOL-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions2.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions2.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(false)
                });
                return ret_functions2;

            case 3:
                // TODO: Write this.
                let ret_functions3 = new Array<{ event: string, check_func: Function }>();
                ret_functions3.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-symbol-block");
                        return elems.length > 0;
                    })
                });
                ret_functions3.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-SYMBOL-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions3.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions3.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(1)
                });
                return ret_functions3;

            case 4:
                // TODO: Write this.
                let ret_functions4 = new Array<{ event: string, check_func: Function }>();
                ret_functions4.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-symbol-block");
                        return elems.length > 0;
                    })
                });
                ret_functions4.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-SYMBOL-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions4.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                ret_functions4.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(1)
                });
                return ret_functions4;

            case 5:
                // TODO: Write this.
                let ret_functions5 = new Array<{ event: string, check_func: Function }>();
                ret_functions5.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-list-block");
                        return elems.length > 0;
                    })
                });
                ret_functions5.push({
                    event: "mouseenter",
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
                ret_functions5.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-LIST-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });
                ret_functions5.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult("2,3,4")
                });
                return ret_functions5;

            case 6:
                let ret_functions6 = new Array<{ event: string, check_func: Function }>();
                ret_functions6.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-define-block");
                        return elems.length > 0;
                    })
                });

                ret_functions6.push({
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

                ret_functions6.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(4)
                });
                return ret_functions6;

            case 7:
                let ret_functions7 = new Array<{ event: string, check_func: Function }>();
                ret_functions7.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-if-block");
                        return elems.length > 0;
                    })
                });
                ret_functions7.push({
                    event: "mousemove",
                    check_func: (_ => {
                        let roots = Roots.get();
                        for (const root of roots) {
                            if (root.tagName === "PYRAMID-IF-BLOCK") {
                                let tmp_children = root.get_children();
                                let has_block: boolean = false;
                                for (const child of tmp_children) {
                                    has_block = has_block || (!child.is_empty()) && (child.tagName === "PYRAMID-LITERAL-BLOCK");
                                }
                                if (has_block) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                });

                ret_functions7.push({
                    event: "mouseenter",
                    check_func: (_ => {
                        let elem = document.getElementById("block-eval-result");
                        return elem !== null;
                    })
                });
                return ret_functions7;
            case 8:
                let ret_functions8 = new Array<{ event: string, check_func: Function }>();
                ret_functions8.push({
                    event: "mouseup",
                    check_func: (_ => {
                        let elems = document.getElementsByTagName("pyramid-define-block");
                        return elems.length > 0;
                    })
                });

                ret_functions8.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(120)
                });
                return ret_functions8;
            case 9:
                let ret_functions9 = new Array<{ event: string, check_func: Function }>();
                ret_functions9.push({
                    event: "mouseenter",
                    check_func: TutorialChecker.isEvalResult(14)
                });
                return ret_functions9;
            default:
                return [];
        }
    }
}