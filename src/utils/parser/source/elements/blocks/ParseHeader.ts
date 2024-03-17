import { HeaderMarkdownNode, TokenType } from "../../models";
import { Token, TokenUtilities } from "../../utilities";
import { TextParser } from "../text/TextParser";
import { BlockParams, ParseBlock } from "./blockTypes";

/**
 * Parses markdown headers, identifying syntax with leading '#' characters.
 */
export class ParseHeader implements ParseBlock {
    /**
     * Determines if the given token starts a header block.
     * @param {Token} token - The current token to evaluate.
     * @returns {boolean} True if the token matches the beginning of a header block.
     */
    matchElement(token: Token): boolean {    
        if (
            !token ||
            token === undefined ||
            !TokenUtilities.compareTokenValue(token, "#")
        ) {          
            return false;
        }

        let currentToken: Token | null = token;
        let prefixCount = 0;

        while (
            currentToken &&
            TokenUtilities.compareTokenValue(currentToken, "#")
        ) {
            if (prefixCount > 6) {
                return false;
            }
            prefixCount += 1;
            currentToken = currentToken.next;
        }

        return (
            prefixCount <= 6 &&
            TokenUtilities.compareTokenType(currentToken, TokenType.Space) &&
            (TextParser.matchText(currentToken!.next) ||
                TextParser.matchInline(currentToken!.next))
        );
    }
    /**
     * Parses tokens starting from the specified index as a header block.
     * @param {BlockParams} params - The parameters including tokens, current index, parent node, and an index update function.
     * @returns {HeaderMarkdownNode} The parsed header markdown node.
     */
    parse({
        tokens,
        getIndex,
        parent,
        updateIndex,
    }: BlockParams): HeaderMarkdownNode {
        const index = getIndex();
        // init temporary index
        let tempIndex = index;

        // get header prefix
        let prefix = "";

        while (tokens[tempIndex]?.value === "#") {
            prefix += "#";
            tempIndex++;
        }

        let header = new HeaderMarkdownNode({
            parent: parent,
            type: `heading${prefix.length}`,
            children: null,
            rowStart: tokens[index]?.position.row || 0,
            rowEnd: tokens[index]?.position.row || 0,
            columnStart: tokens[index]?.position.column,
            columnEnd: tokens[tempIndex - 1]?.position.column,
        });

        tempIndex += 1; // move past space

        let text = new TextParser().parse({
            tokens: tokens,
            parent: header,
            startIndex: tempIndex,
            updateIndex,
        });

        header.children = { prefix: prefix, text: text };

        return header;
    }
}
