


type token = {
    tokenType: string;
    value: string;
}


class Lexer {

    private markdown: string;
    private tokens: token[];
    private index: number;
    private column: number;
    private row: number;
    private inputLength: number;

    public constructor(markdown: string) {
        this.markdown = markdown;
        this.tokens = [];
        this.index = 0;
        this.column = 0;
        this.row = 0;
        this.inputLength = markdown.length;
    }

    addToken = (tokenType: string, value: string) => {
        this.tokens.push({tokenType, value});
    }

    getPosition = () => {
        return {column: this.column, row: this.row};
    }

    errorMessage = (errorType: string) => {
        switch(errorType) {
            case "MAX_ITERATIONS":
                return "Infinite loop has been detected."
            default:
                break;
        }
    }

    getNext = () => {
        if(this.index < this.inputLength) {
            return this.markdown[this.index + 1];
        }

        return "END";
    }

    getCurrent = () => {
        if(this.index < this.inputLength) {
            return this.markdown[this.index];
        }
        return "END";
    }

    move = () => {
        this.index++;
    }

    maxIterations = (iteration: number) => {
        if(iteration > this.inputLength) {
            throw new Error(this.errorMessage("MAX_ITERATIONS"));
        }
        return null;
    }


    getASCIIValue = (char: string) => {
        return char.charCodeAt(0);
    }

    nextNotEqual = (value: number) => {
        const next  = this.getNext();

        if(next === "END" || next === undefined) {
            return false;
        }

        return Number(next.charCodeAt(0)) !== Number(value);
    }
    
    consumeString = () => {
        let string = "";
        let i = 0;

        while(this.nextNotEqual(8)) {
            this.maxIterations(i);
            string = string + this.getCurrent();
            this.move();
            i++;
        }

        return string;
    }

    consumeNumber = () => {
        let string = "";
        let i = 0;

        while(this.nextNotEqual(8) || this.nextNotEqual(32)) {
            this.maxIterations(i);
            string = string + this.getCurrent();
            this.move();
            i++;
        }

        return string;
    }

    
}