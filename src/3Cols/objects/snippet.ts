
export class Snippet {
    public snippetID: string;
    public subcategoryID: string;
    public name: string;
    public content: string;
    public language: string;

    constructor(subcategoryID: string, name: string, content: string, language: string = "text") {
        this.subcategoryID = subcategoryID;
        this.name = name;
        this.content = content;
        this.language = language;
    }
}