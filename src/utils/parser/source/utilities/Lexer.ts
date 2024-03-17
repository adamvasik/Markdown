import { TokenType } from "../models/TokenType";

export type Token = {
    tokenType: TokenType;
    value: string;
    position: { row: number; column: number };
    next: Token | null
};

const signs = new Set([
    "!",
    '"',
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "{",
    "|",
    "}",
    "~",
]);

export class Lexer {
    private tokens: Token[] = [];
    private lastToken: Token | null = null; // Keep track of the last token added
    private index = 0;
    private column = 0;
    private row = 1;
    private readonly inputLength: number;

    constructor(private markdown: string) {
        this.inputLength = markdown.length;
    }

    getPosition() {
        return { column: this.column, row: this.row };
    }

    addToken(tokenType: TokenType, value: string) {
        const position = this.getPosition();
        const newToken: Token = { tokenType, value, position, next: null };

        if (this.lastToken) {
            this.lastToken.next = newToken; // Link the new token to the previous token
        }

        this.tokens.push(newToken);
        this.lastToken = newToken; // Update the lastToken reference to point to the new token
    }

    getNext() {
        return this.markdown.charAt(this.index + 1);
    }

    getCurrent() {
        return this.markdown.charAt(this.index);
    }

    move() {
        const current = this.getCurrent();
        this.index++;
        this.column++;

        if (current === "\n") {
            this.row++;
            this.column = 0;
        }
    }

    isDigit(char: string) {
        return char >= "0" && char <= "9";
    }

    isLetter(char: string) {
        return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
    }

    isSign(char: string) {
        return signs.has(char);
    }

    isSpace(char: string) {
        return char === " ";
    }

    isNewline(char: string) {
        return char === "\n";
    }

    isCarriageReturn(char: string) {
        return char === "\r";
    }

    createTokens() {
        while (this.index < this.inputLength) {
            const currentChar = this.getCurrent();

            if (this.isDigit(currentChar)) {
                this.addToken(TokenType.Digit, currentChar);
            } else if (this.isLetter(currentChar)) {
                this.addToken(TokenType.Letter, currentChar);
            } else if (this.isSign(currentChar)) {
                this.addToken(TokenType.Sign, currentChar);
            } else if (this.isSpace(currentChar)) {
                this.addToken(TokenType.Space, currentChar);
            } else if (this.isNewline(currentChar)) {
                this.addToken(TokenType.Newline, currentChar);
            } else if (this.isCarriageReturn(currentChar)) {
                if (this.getNext() === "\n") {
                    this.move(); // Skip '\n' as part of '\r\n'
                }
                this.addToken(TokenType.CarriageReturn, currentChar);
            } else {
                this.addToken(TokenType.Unknown, currentChar);
            }

            this.move();
        }

        return this.tokens;
    }
}
