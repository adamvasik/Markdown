import { ParagraphMarkdownNode } from "../../models";
import { Token } from "../../utilities";
import { TextParser } from "../text/TextParser";
import { BlockParams, ParseBlock } from "./blockTypes";

/**
 * Parses paragraphs in markdown text. This is used as a default parser when
 * no other block elements match the current token, capturing text as paragraph content.
 */
export class ParseParagraph implements ParseBlock {
    /**
     * Always matches to act as a default parser for any text.
     * @param {Token} token - The current token to evaluate.
     * @returns {boolean} Always returns true to match any token.
     */
    matchElement(token: Token): boolean {
        return token && token !== undefined;
    }

    /**
     * Parses tokens starting from the specified index as a paragraph block.
     * @param {BlockParams} params - Parameters including the tokens, current index, parent node, and index update function.
     * @returns {ParagraphMarkdownNode} The parsed paragraph markdown node.
     */
    parse({
        tokens,
        getIndex,
        parent,
        updateIndex,
    }: BlockParams): ParagraphMarkdownNode {
        let index = getIndex();
        // init tempIndex and move straight to text
        let tempIndex = index;

        let paragraph = new ParagraphMarkdownNode({
            parent: parent,
            type: "paragraph",
            children: null,
            rowStart: tokens[index]?.position.row || 0,
            rowEnd: 0,
            columnStart: tokens[index]?.position.column,
            columnEnd: 0,
        });

        const text = new TextParser().parse({
            tokens: tokens,
            parent: paragraph,
            startIndex: tempIndex,
            updateIndex,
        });

        tempIndex = getIndex();
        paragraph.rowEnd = tokens[tempIndex - 1]?.position.row || 0;
        paragraph.columnEnd = tokens[tempIndex - 1]?.position.column || 0;
        paragraph.children = text;

        return paragraph;
    }
}
