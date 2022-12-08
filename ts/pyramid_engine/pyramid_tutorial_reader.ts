export class PyramidTutorialReader {
    private file_name: string;
    
    private title: string;
    private body: string;
    private check_texts: string[];
    
    constructor(_file_name: string){
        this.file_name = _file_name;
        this.read_all();
    }

    read_all(): void {


    }

    get_title(): string {
        return this.title;
    }

    get_body(): string {
        return this.body;
    }

    get_check_texts(): string[] {
        return this.check_texts;
    }


}