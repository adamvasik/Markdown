import { Token } from "../../utilities/Lexer";
import { TokenUtilities } from "../../utilities/TokenUtilities";
import {
    InlineElementMarkdownNode,
    TextMarkdownNode,
} from "../../models/markdownNodes";
import {
    InlineElementHandler,
    ParseCode,
    ParseEmphasis,
    ParseStrong,
    ParseImage,
    ParseLink,
} from "./inline";
import { TextMarkdownNodeParent, TokenType } from "../../models";

type TextParseParams = {
    tokens: Token[];
    parent: TextMarkdownNodeParent;
    startIndex: number;
    updateIndex: (newIndex: number) => void;
};

export class TextParser {
    private elements: InlineElementHandler[];
    /**
     * Initializes the TextParser with predefined inline element handlers.
     */
    constructor() {
        this.elements = [
            new ParseCode(),
            new ParseEmphasis(),
            new ParseStrong(),
            new ParseImage(),
            new ParseLink(),
        ];
    }

    /**
     * Matches tokens that are considered as text in markdown.
     * @param {Token | null} token - The token to match against text criteria.
     * @returns {boolean} True if the token is a text token, false otherwise.
     */
    public static matchText(token: Token | null): boolean {
        const text = [
            TokenType.Letter,
            TokenType.Digit,
            TokenType.Space,
            TokenType.Unknown,
        ];
        return TokenUtilities.compareTokenTypes(token, text);
    }

    /**
     * Matches tokens that may indicate the start of an inline element.
     * @param {Token | null} token - The token to match against inline element criteria.
     * @returns {boolean} True if the token can start an inline element, false otherwise.
     */
    public static matchInline(token: Token | null): boolean {
        return TokenUtilities.compareTokenType(token, TokenType.Sign);
    }

    /**
     * Matches tokens that are not considered as text in markdown.
     * @param {Token | null} token - The token to match against non-text criteria.
     * @returns {boolean} True if the token is not a text token, false otherwise.
     */
    public static matchNotText(token: Token | null): boolean {
        const notText = [
            TokenType.CarriageReturn,
            TokenType.Sign,
            TokenType.Newline,
        ];

        return TokenUtilities.compareTokenTypes(token, notText);
    }

    /**
     * Parses inline elements found within the text, identifying specific markdown
     * inline syntax and handling accordingly.
     *
     * @param {TextMarkdownNode} parent - The parent node for the inline element.
     * @param {Token[]} tokens - The array of tokens to be parsed.
     * @param {number} startIndex - The starting index in the tokens array for parsing.
     * @returns {{node: InlineElementMarkdownNode | string; index: number}} An object containing the parsed node and the next index position.
     */
    parseInline(
        parent: TextMarkdownNode,
        tokens: Token[],
        startIndex: number
    ): {
        node: InlineElementMarkdownNode | string;
        index: number;
    } {
        const currentToken = tokens[startIndex];
        // should never happen
        if (!currentToken || currentToken === undefined) {
            return { node: "", index: startIndex };
        }

        const inline = this.elements.find((e) => e.matchElement(currentToken));

        if (!inline || inline === undefined) {
            return { node: currentToken.value, index: startIndex + 1 };
        } else {
            return inline.parse({ tokens, startIndex, parent });
        }
    }

    /**
     * Parses the provided tokens into a TextMarkdownNode, identifying and handling
     * inline elements and text content.
     *
     * @param {TextParseParams} params - Parameters including tokens, parent node, starting index, and an index update function.
     * @returns {TextMarkdownNode} The parsed text markdown node containing any identified inline elements and text content.
     */
    public parse({
        tokens,
        parent,
        startIndex,
        updateIndex,
    }: TextParseParams): TextMarkdownNode {
        let children = [];
        let tempIndex = startIndex;
        let currentToken = tokens[tempIndex] || null;
        let prevToken: Token | null;

        let textNode = new TextMarkdownNode({
            parent: parent,
            type: "text",
            children: null,
            rowStart: currentToken?.position.row || 0,
            rowEnd: 0,
            columnStart: currentToken?.position.column,
            columnEnd: 0,
        });

        while (
            currentToken &&
            currentToken.value !== "\n" &&
            currentToken !== undefined
        ) {
            prevToken = currentToken;
            if (TextParser.matchText(currentToken)) {
                const result = TokenUtilities.consumeTokensUntil(
                    tokens,
                    tempIndex,
                    TextParser.matchNotText,
                    TokenUtilities.isNewline
                );
                if (!result) {
                    break;
                }
                const { text, index } = result;
                tempIndex = index;
                currentToken = tokens[tempIndex] || null;
                children.push(text);
            }

            if (TextParser.matchInline(currentToken)) {
                const { node, index } = this.parseInline(
                    textNode,
                    tokens,
                    tempIndex
                );
                
                tempIndex = index;
                currentToken = tokens[tempIndex] || null;
                children.push(node);
            }
            if (prevToken === currentToken) {
                throw new Error(
                    `Praser stuck in an infinite loop, parsing input at [${prevToken.position.row}, ${prevToken.position.column}].`
                );
            }
        }
        
        if (TokenUtilities.isNewline(currentToken!)) {
            children.push("\n");
        }

        textNode.children = children;
        textNode.rowEnd = currentToken?.position.row || 0;
        textNode.columnEnd = currentToken?.position.column || 0;

        updateIndex(tempIndex + 1);
        
        return textNode;
    }
}
