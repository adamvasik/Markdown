import { BlockQuoteMarkdownNode, TokenType } from "../../models";
import { Token, TokenUtilities } from "../../utilities";
import { TextParser } from "../text/TextParser";
import { BlockParams, ParseBlock } from "./blockTypes";

/**
 * Parses block quotes in markdown text.
 */
export class ParseBlockQuote implements ParseBlock {
    /**
     * Determines if the given token starts a block quote.
     * @param {Token} token - The current token to evaluate.
     * @returns {boolean} True if the token matches the beginning of a block quote.
     */
    matchElement(token: Token): boolean {
        return (
            TokenUtilities.compareTokenValue(token, ">") &&
            TokenUtilities.compareTokenType(token.next, TokenType.Space) &&
            TextParser.matchText(token.next!.next)
        );
    }

    /**
     * Parses tokens starting from the specified index as a block quote.
     * @param {BlockParams} params - Parameters including the tokens, current index, parent node, and index update function.
     * @returns {BlockQuoteMarkdownNode} The parsed block quote markdown node.
     */
    parse({
        tokens,
        getIndex,
        parent,
        updateIndex,
    }: BlockParams): BlockQuoteMarkdownNode {
        let index = getIndex();
        // init tempIndex and move straight to text
        let tempIndex = index + 2;

        let blockQuote = new BlockQuoteMarkdownNode({
            parent: parent,
            type: "blockquote",
            children: null,
            rowStart: tokens[index]?.position.row || 0,
            rowEnd: tokens[tempIndex - 1]?.position.row || 0,
            columnStart: tokens[index]?.position.column,
            columnEnd: tokens[tempIndex - 1]?.position.column,
        });

        const text = new TextParser().parse({
            tokens: tokens,
            parent: blockQuote,
            startIndex: tempIndex,
            updateIndex,
        });

        blockQuote.children = { prefix: ">", text: text };

        return blockQuote;
    }
}
