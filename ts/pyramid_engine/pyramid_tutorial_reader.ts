type CheckText = {
    head: string;
    captions: CheckBody[];
}

type CheckBody = {
    type: string;
    body: string;
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
            "## 1-1 四則演算をしてみよう\n[] 演算子ブロックを置こう\n- 四則演算（+, -, *, /）などができるブロックが演算子ブロックです。左側のメニュー欄からドラッグできます。\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- デフォルトでは0が入っているブロックが数値ブロックです。陰になっている部分に数値ブロックをくっつけることができます。\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックが2個くっついた状態で押してみましょう。\n[] 数字を編集しよう\n- 数値ブロックを右クリックして編集を押すと、数字の編集ができます。全角で入力すると文字列として認識されるので数字は半角で入力。エンターキーで確定します。\n[] 練習 \n- 1+1を評価してみよう。",
            "## 1-2 論理演算ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 演算子ブロックには、否定(!)、論理積(&&)、論理和(||)といった論理演算子も用意されています。左側のメニュー欄からドラッグしよう。\n[] 演算子ブロックにboolブロックをくっつけてみよう\n- 真(true)や偽(false)といった値を与えることができるのがboolブロックです。陰になっている部分にboolブロックをくっつけることができます。\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、boolブロックがくっついた状態で押してみましょう。\n[] 練習\n- true && falseを評価してみよう。",
            "## 1-3 三角関数ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 三角関数も演算子ブロックとして用意されています。左側のメニュー欄からドラッグしよう。\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- 陰になっている部分に数値ブロックをくっつけることができます。\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックがくっついた状態で押してみましょう。\n[] 練習\n- sin(π/2)を評価してみよう。",
            "## 1-4 指数・対数ブロックを使ってみよう\n[] 演算子ブロックを置こう\n- 演算子ブロックではexpやlogの計算もできます。左側のメニュー欄からドラッグしよう。\n[] 演算子ブロックに数値ブロックをくっつけてみよう\n- 陰になっている部分に数値ブロックをくっつけることができます。\n[] 演算子ブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、数値ブロックがくっついた状態で押してみましょう。\n[] 練習\n- exp(0)を評価してみよう。",
            "## 1-5 リストブロックを使ってみよう\n[] リストブロックを置こう\n- LISTと書かれたブロックを左側のメニュー欄からドラッグしよう。デフォルトでは引数の数（リストの中身の数）は0になっています。\n[] リストブロックの引数の数を決めよう\n- リストブロックを右クリックすると「引数の数を変更」という項目が出るので、そこから引数の数を指定しましょう。\n [] リストブロックにブロックをくっつけてみよう\n- 陰になっている部分にリテラルブロック（数値ブロックや文字列ブロックなど）をくっつけることができます。\n[] 練習\n- [2, 3, 4]を出力してみよう。",
            "## 1-6 関数ブロックを使ってみよう\n[] 関数ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 仮引数を編集しよう\n- 関数ブロックを右クリックして、仮引数を編集できます。ここで用意した仮引数の数が関数ブロックの引数の数になります。\n[] 簡単な関数を作ろう\n- f(x)=x+1という関数を作ってみましょう。\n[] 仮引数に実引数を代入しよう\n- 作った関数と名前が同じ演算子ブロックをxを編集することで用意しましょう。また、その演算子ブロックの引数の数を作った関数の仮引数の数と一致させましょう。\n[] f(3)を出力しよう\n- f(3)を出力してみよう。\npi [../q1-6.svg]",
            "## 1-7 ifブロックを使ってみよう\n[] ifブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] ifブロックにブロックをくっつけてみよう\n- 陰になっている部分にブロックをくっつけることができます。\n- 左が条件式、真ん中が条件式を満たした時の結果、右が条件を満たさない時の結果です。\n[] ifブロックで評価しよう\n- 演算子ブロックを右クリックすると評価という項目が出るので、ブロックがくっついた状態で押してみましょう。",
            "## 1-8 階乗を計算する関数を作ってみよう\n[] 関数ブロックを置こう\n- 左側のメニュー欄からドラッグ\n[] 階乗を計算する関数を作ってみよう\n- 階乗を計算する関数を作って、試しに5!を出力してみましょう。",
            "## 1-9 リストを扱う関数を作ってみよう\n[] リストの全ての要素を足し合わせる関数を作りましょう\n- その関数を作り[1, 10, 3]に作用させてみましょう。"
        ];
        this.read_all(_file_idx);
    }

    read_all(problem_number: number): void {
        // debug

        //問題番号によってtextsを変える
        let text_array = this.texts[problem_number].split("\n");
        let tmp_head: string = "";
        let tmp_caption: CheckBody[] = new Array<CheckBody>();
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
                case "pi":
                    // pi [./your-image-pass]
                    let pi_body = formed_line.slice(2, formed_line.length);
                    let formed_pi_body = pi_body.slice(2, pi_body.length - 1);
                    tmp_caption.push({type: "img", body: formed_pi_body});
                    break;
                case "- ":
                    if (tmp_head.length != 0) {
                        tmp_caption.push({type: "text", body: formed_line.slice(2, formed_line.length)});
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