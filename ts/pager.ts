export class Pager {
    static goto_toppage() {
        window.addEventListener('beforeunload', function (e) {
            e.preventDefault();
            e.returnValue = "ページ移動すると作業内容が失われます。";
        });
        window.location.href = "";
    }
    static goto_top_from_tutorial() {
        window.location.href = "../../../";
    }
    static goto_tutorial_top() {
        // debug
        window.location.href = "./tutorial/index.html";
    }
    static goto_tutorial(i: number) {
        // maybe useless method
        window.location.href = "/tutorial/tutorial.html/" + i.toString();
    }
}