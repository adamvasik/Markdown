import {
    ParseBlock,
    ParseBlockQuote,
    ParseCodeBlock,
    ParseHeader,
    ParseList,
    ParseNewline,
    ParseParagraph,
    ParseSpace,
} from "./elements/blocks";
import { RootMarkdownNode } from "./models";
import { Lexer, Token } from "./utilities/Lexer";
// import { sampleA } from "../../markdownSamples";

/* 
    The `Parser` class in TypeScript is designed to parse a sequence of tokens into a structured
    Markdown document, handling various Markdown elements such as headers, blockquotes, lists, inline
    elements, and code blocks.
*/

export class Parser {
    private lexer: Lexer;
    private readonly tokens: Token[] = [];
    private tokensLength: number;
    private blockParsers: ParseBlock[] = [];
    private defaultParser: ParseBlock;
    private spaceParser;
    private index: number = 0;

    /**
     * Initializes the parser with the markdown text.
     * @param {string} markdown The markdown text to parse.
     */
    constructor(markdown: string) {
        this.lexer = new Lexer(markdown);
        this.tokens = this.lexer.createTokens();
        this.tokensLength = this.tokens.length;
        this.defaultParser = new ParseParagraph();
        this.spaceParser = new ParseSpace();
        this.index = 0;
        this.initializeBlockParsers();

        this.updateIndex = this.updateIndex.bind(this);
        this.getIndex = this.getIndex.bind(this);
    }

    /**
     * Initializes block parsers.
     */
    private initializeBlockParsers() {
        this.blockParsers = [
            new ParseHeader(),
            new ParseList(),
            new ParseBlockQuote(),
            new ParseCodeBlock(),
            new ParseNewline(),
        ];
    }

    private updateIndex(index: number): void {
        this.index = index;
    }

    private getIndex(): number {
        return this.index;
    }

    /**
     * Parses the markdown text into a structured tree.
     * @returns {RootMarkdownNode} The root node of the structured tree.
     */
    public parse(): RootMarkdownNode {
        let prevToken: Token | null = null;

        let children = [];

        let rootNode = new RootMarkdownNode({
            type: "root",
            children: [],
            rowStart: 0,
            rowEnd: 0,
            columnStart: 0,
            columnEnd: 0,
        });

        while (this.index < this.tokensLength) {
            let currentToken = this.tokens[this.index];

            if (prevToken === currentToken) {
                throw new Error(
                    `Praser stuck in an infinite loop, parsing input at [${prevToken.position.row}, ${prevToken.position.column}].`
                );
            }
            // handle space
            if (ParseSpace.matchElement(currentToken!)) {
                this.spaceParser.parse(
                    this.tokens,
                    this.getIndex,
                    this.updateIndex
                );

                currentToken = this.tokens[this.index];
            }

            const block = this.blockParsers.find((handler) =>
                handler.matchElement(currentToken!)
            );
         
            if (block === undefined) {
                const result = this.defaultParser.parse({
                    tokens: this.tokens,
                    getIndex: this.getIndex,
                    parent: rootNode,
                    updateIndex: this.updateIndex,
                });

                children.push(result);
            } else {
                const result = block.parse({
                    tokens: this.tokens,
                    getIndex: this.getIndex,
                    parent: rootNode,
                    updateIndex: this.updateIndex,
                });

                children.push(result);
            }

            prevToken = currentToken!;
        }

        rootNode.children = children;

        return rootNode;
    }
}
/*
const result = new Parser(sampleA).parse();

console.log(result);*/