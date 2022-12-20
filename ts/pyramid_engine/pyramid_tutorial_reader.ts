type CheckText = {
    head: string;
    captions: string[];
}

export class PyramidTutorialReader {
    private file_idx: number;

    private title: string;
    private body: string;
    private texts: Array<string>;
    private check_texts: CheckText[];

    constructor(_file_idx: number) {
        this.file_idx = _file_idx;
        this.check_texts = new Array<CheckText>();
        this.texts = [
            "",
            "## 1-1 四則演算をしてみよう\n[] 演算子ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- 陰になっている部分に数値ブロックをくっつけることができます\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックがくっついた状態で押してみましょう。",
            "## 1-2 論理演算ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 演算子ブロックにboolブロックをくっつけてみよう\n- 陰になっている部分にboolブロックをくっつけることができます\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、boolブロックがくっついた状態で押してみましょう。",
            "## 1-3 三角関数ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- 陰になっている部分に数値ブロックをくっつけることができます\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックがくっついた状態で押してみましょう。",
            "## 1-4 指数・対数ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- 陰になっている部分に数値ブロックをくっつけることができます\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックがくっついた状態で押してみましょう。",
            "## 1-5 リストブロックを使ってみよう\n[] リストブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] リストブロックの引数の数を決めよう\n- リストブロックを右クリックすると「引数の数を変更」という項目が出るので、そこから引数の数を指定しましょう。\n [] リストブロックにブロックをくっつけてみよう\n- 陰になっている部分にリテラルブロックをくっつけることができます。",
            "## 1-6 関数ブロックを使ってみよう\n[] 関数ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 演算子ブロックにboolブロックをくっつけてみよう\n- 陰になっている部分にboolブロックをくっつけることができます\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、boolブロックがくっついた状態で押してみましょう。",
            "## 2-1 ",
            "## 2-2",
            "## 2-3",
            "## 2-4",
            "## 2-5",
            "## 2-6"
        ];
        this.read_all(_file_idx);
    }

    read_all(problem_number: number): void {
        // debug

        //問題番号によってtextsを変える
        let text_array = this.texts[problem_number].split("\n");
        let tmp_head: string = "";
        let tmp_caption: string[] = new Array<string>();
        for (const line of text_array) {
            let formed_line = this.delete_head_space(line);
            switch (formed_line.slice(0, 2)) {
                case "":
                case "//":
                    break;
                case "##":
                    this.title = formed_line.slice(2, formed_line.length);
                    break;
                case "[]":
                    if (tmp_head.length == 0) {
                        tmp_head = formed_line.slice(2, formed_line.length);
                    } else {
                        this.check_texts.push({ head: tmp_head, captions: tmp_caption });
                        tmp_head = formed_line.slice(2, formed_line.length)
                        tmp_caption = tmp_caption.slice(0, 0);
                    }
                    break;
                case "- ":
                    if (tmp_head.length != 0) {
                        tmp_caption.push(formed_line.slice(2, formed_line.length));
                    } else {
                        alert("Tutorial Reader Error: Not Found Check Title.")
                    }
                    break;
                default:
                    alert("Tutorial Reader Error: Failed to load Tutorial doc.");
            }
        }
        if (tmp_head.length != 0) {
            this.check_texts.push({ head: tmp_head, captions: tmp_caption });
        }
    }

    private delete_head_space(text: string): string {
        let res: string = "";
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) != " ") {
                res = text.slice(i, text.length);
                break;
            }
        }
        return res;
    }

    get_title(): string {
        return this.title;
    }

    get_body(): string {
        return this.body;
    }

    get_check_texts(): CheckText[] {
        return this.check_texts;
    }
    debug(): void {
        console.log(this.title);
        console.log(this.check_texts);
    }

}