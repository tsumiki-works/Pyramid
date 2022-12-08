export class Pager {
    static goto_toppage() {
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            e.returnValue = "ページ移動すると作業内容が失われます。";
          });
        window.location.href = ""
    }
    static goto_tutorial(){
        // debug
        window.location.href = "./tutorial/index.html";
    }
}