import { ListMarkdownNode, TokenType } from "../../models";
import { Token, TokenUtilities } from "../../utilities";
import { TextParser } from "../text/TextParser";
import { BlockParams, ParseBlock } from "./blockTypes";

/**
 * Parses list items in markdown text, including both ordered and unordered lists.
 */
export class ParseList implements ParseBlock {
    /**
     * Determines if the given token starts a list block, either ordered or unordered.
     * @param {Token} token - The current token to evaluate.
     * @returns {boolean} True if the token matches the beginning of a list block.
     */
    matchElement(token: Token): boolean {
        if(!token || token === undefined) {
            return false;
        }

        if (
            TokenUtilities.compareTokenValue(token, "*") &&
            TokenUtilities.compareTokenType(token.next, TokenType.Space) &&
            TextParser.matchText(token.next!.next)
        ) {
            return true;
        } else if(TokenUtilities.compareTokenType(token, TokenType.Digit)) {
            let currentToken = token;
            let nextToken = currentToken.next;

            while (
                nextToken &&
                TokenUtilities.compareTokenType(nextToken, TokenType.Digit)
            ) {
                currentToken = nextToken;
                nextToken = currentToken.next;
            }

            return (
                TokenUtilities.compareTokenType(
                    currentToken,
                    TokenType.Digit
                ) &&
                TokenUtilities.compareTokenValue(nextToken, ".") &&
                TokenUtilities.compareTokenType(
                    nextToken!.next,
                    TokenType.Space
                ) &&
                TextParser.matchText(nextToken!.next!.next)
            );
        }
        return false;
    }

    matchSpace(token: Token): boolean {
        return TokenUtilities.compareTokenType(token, TokenType.Space);
    }

    private handleValidPrefix(
        prevPrefix: string | null,
        currentPrefix: string
    ): boolean {
        if (!prevPrefix && currentPrefix.length > 0) {
            return true;
        } else if (prevPrefix === "*" && currentPrefix === "*") {
            return true;
        } else if (prevPrefix?.endsWith(".") && currentPrefix.endsWith(".")) {
            let prevValue = Number(
                prevPrefix.substring(0, prevPrefix.length - 1)
            );
            let currentValue = Number(
                currentPrefix.substring(0, currentPrefix.length - 1)
            );
            return prevValue + 1 === currentValue;
        }
        return false;
    }

    /**
     * Parses tokens starting from the specified index as a list block.
     * @param {BlockParams} params - Parameters including the tokens, current index, parent node, and index update function.
     * @returns {ListMarkdownNode} The parsed list markdown node.
     */
    parse({
        tokens,
        getIndex,
        parent,
        updateIndex,
    }: BlockParams): ListMarkdownNode {
        const index = getIndex();
        // init temporary index
        let tempIndex = index;
        // get list type from first token
        let listType = TokenUtilities.compareTokenType(
            tokens[tempIndex]!,
            TokenType.Sign
        )
            ? "unorderedlist"
            : "orderedlist";

        let list = new ListMarkdownNode({
            parent: parent,
            type: listType,
            children: null,
            rowStart: tokens[index]?.position.row || 0,
            rowEnd: 0,
            columnStart: tokens[index]?.position.column,
            columnEnd: 0,
        });

        let children = [];

        let prevPrefix: string | null = null;

        while (this.matchElement(tokens[tempIndex]!)) {
            // get prefix
            const prefix = TokenUtilities.consumeTokensUntil(
                tokens,
                tempIndex,
                this.matchSpace,
                TokenUtilities.isNewline
            );

            if (!prefix) {
                break;
            }

            const { text, index } = prefix;

            if (!this.handleValidPrefix(prevPrefix, text)) {
                break;
            }

            tempIndex = index + 1; // move past space

            const listObject = {
                prefix: text,
                text: new TextParser().parse({
                    tokens: tokens,
                    parent: list,
                    startIndex: tempIndex,
                    updateIndex,
                }),
            };

            children.push(listObject);
            prevPrefix = text;
            tempIndex = getIndex();
        }
        updateIndex(tempIndex);
        list.rowEnd = tokens[tempIndex - 1]?.position.row || 0;
        list.columnEnd = tokens[tempIndex - 1]?.position.column || 0;
        list.children = children;

        return list;
    }
}
