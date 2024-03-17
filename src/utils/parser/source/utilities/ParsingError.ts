import { Token } from "./Lexer";

export class ParsingError extends Error {
    constructor(message: string, public token: Token) {
        super(`Parsing error at [${token.position.row}, ${token.position.column}]: ${message}`);
        this.name = "ParsingError";
    }
}
