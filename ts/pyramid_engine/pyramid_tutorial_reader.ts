type CheckText = {
    head: string;
    captions: string[];
}

export class PyramidTutorialReader {
    private file_idx: number;

    private title: string;
    private body: string;
    private check_texts: CheckText[];

    constructor(_file_idx: number) {
        this.file_idx = _file_idx;
        this.check_texts = new Array<CheckText>();

        this.read_all();
    }

    read_all(): void {
        // debug
        let texts = "## This is the title.\n[] CheckTitle 1\n- aaa\n- aab\n[] CheckTitle 2\n- bbb\n[] CheckTitle 3\n";
        let text_array = texts.split("\n");
        let tmp_head: string = "";
        let tmp_caption: string[] = new Array<string>();
        for (const line of text_array) {
            let formed_line = this.delete_head_space(line);
            switch (formed_line.slice(0, 2)) {
                case "":
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
                    if(tmp_head.length != 0){
                        tmp_caption.push(formed_line.slice(2, formed_line.length));
                    }else{
                        alert("Tutorial Reader Error: Not Found Check Title.")
                    }
                    break;
                default:
                    alert("Tutorial Reader Error: Failed to load Tutorial doc.");
            }
        }
        if(tmp_head.length != 0){
            this.check_texts.push({head: tmp_head, captions: tmp_caption});
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