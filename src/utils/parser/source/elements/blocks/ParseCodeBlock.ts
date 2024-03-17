import { CodeBlockMarkdownNode, ParagraphMarkdownNode } from "../../models";
import { Token, TokenUtilities } from "../../utilities";
import { ParseParagraph } from "./ParseParagraph";
import { BlockParams, ParseBlock } from "./blockTypes";

/**
 * Parses code blocks in markdown text, enclosed by triple backticks.
 */
export class ParseCodeBlock implements ParseBlock {
    /**
     * Determines if the given token starts a code block.
     * @param {Token} token - The current token to evaluate.
     * @returns {boolean} True if the token matches the beginning of a code block.
     */
    matchElement(token: Token): boolean {
        return (
            TokenUtilities.compareTokenValue(token, "`") &&
            TokenUtilities.compareTokenValue(token.next, "`") &&
            TokenUtilities.compareTokenValue(token.next!.next, "`")
        );
    }

    /**
     * Parses tokens starting from the specified index as a code block.
     * @param {BlockParams} params - Parameters including the tokens, current index, parent node, and index update function.
     * @returns {CodeBlockMarkdownNode} The parsed code block markdown node.
     */
    parse({
        tokens,
        getIndex,
        parent,
        updateIndex,
    }: BlockParams): CodeBlockMarkdownNode | ParagraphMarkdownNode {
        let startIndex = getIndex();
        // init tempIndex and move past opening element
        let tempIndex = startIndex + 3;

        let result = TokenUtilities.consumeTokensUntil(
            tokens,
            tempIndex,
            this.matchElement,
            TokenUtilities.escapeAlwaysFalse
        );

        if (!result) {
            return new ParseParagraph().parse({
                tokens: tokens,
                getIndex: getIndex,
                parent: parent,
                updateIndex: updateIndex,
            });
        }

        const { text, index } = result;

        tempIndex = index + 3;

        updateIndex(tempIndex);

        return new CodeBlockMarkdownNode({
            parent: parent,
            type: "codeblock",
            children: text,
            rowStart: tokens[startIndex]?.position.row || 0,
            rowEnd: tokens[tempIndex - 1]?.position.row || 0,
            columnStart: tokens[startIndex]?.position.column,
            columnEnd: tokens[tempIndex - 1]?.position.column,
        });
    }
}
