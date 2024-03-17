import { InlineElementMarkdownNode } from "../../../models/markdownNodes";
import { Token, TokenUtilities } from "../../../utilities";
import { InlineElementHandler, InlineParseParams } from "./inlineTypes";

export class ParseStrong implements InlineElementHandler {
    matchElement(token: Token): boolean {
        return (
            (TokenUtilities.compareTokenValue(token, "*") &&
                TokenUtilities.compareTokenValue(token.next, "*")) ||
            (TokenUtilities.compareTokenValue(token, "_") &&
                TokenUtilities.compareTokenValue(token.next, "_"))
        );
    }

    parse({ tokens, startIndex, parent }: InlineParseParams): {
        node: InlineElementMarkdownNode | string;
        index: number;
    } {
        const sign = tokens[startIndex]?.value || "";

        const contentObject = {
            prefix: [sign, sign].join(""),
            value: "",
            suffix: [sign, sign].join(""),
        };

        const result = TokenUtilities.extractContentBetweenDelimeters(
            tokens,
            contentObject,
            startIndex,
            this.matchElement
        );

        const { content, index } = result;

        if (typeof content === "object") {
            return {
                node: new InlineElementMarkdownNode({
                    parent: parent,
                    type: "strong",
                    children: content,
                    rowStart: tokens[startIndex]?.position.row || 0,
                    rowEnd: tokens[index - 1]?.position.row || 0,
                    columnStart: tokens[startIndex]?.position.column,
                    columnEnd: tokens[index - 1]?.position.column,
                }),
                index: index,
            };
        } else {
            return {
                node: content,
                index: index,
            };
        }
    }
}