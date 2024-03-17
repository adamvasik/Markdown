import { InlineElementMarkdownNode } from "../../../models/markdownNodes";
import { TokenType } from "../../../models";
import { Token, TokenUtilities } from "../../../utilities";
import { InlineElementHandler, InlineParseParams } from "./inlineTypes";

export class ParseLink implements InlineElementHandler {
    matchElement(token: Token): boolean {
        return TokenUtilities.compareTokenValue(token, "[");
    }

    matchClosingSquareBracket(token: Token): boolean {
        return TokenUtilities.compareTokenValue(token, "]");
    }

    matchClosingParentheses(token: Token): boolean {
        return TokenUtilities.compareTokenValue(token, ")");
    }

    parse({ tokens, startIndex, parent }: InlineParseParams): {
        node: InlineElementMarkdownNode | string;
        index: number;
    } {
        let tempIndex = startIndex;

        let contentObject = {
            prefix: "[",
            value: "",
            suffix: "]",
        };

        const linkName = TokenUtilities.extractContentBetweenDelimeters(
            tokens,
            contentObject,
            tempIndex,
            this.matchClosingSquareBracket
        );

        if (typeof linkName.content === "string") {
            return { node: linkName.content, index: linkName.index };
        }

        tempIndex = linkName.index;

        if (
            TokenUtilities.compareTokenType(
                tokens[tempIndex] || null,
                TokenType.Space
            )
        ) {
            tempIndex++;
        }

        let exitText = `${contentObject.prefix}${contentObject.value}${contentObject.suffix}`;

        if (
            tokens[tempIndex] === undefined ||
            TokenUtilities.compareTokenValue(tokens[tempIndex], "(")
        ) {
            return { node: exitText, index: tempIndex };
        }

        contentObject = {
            prefix: "(",
            value: "",
            suffix: ")",
        };

        const urlName = TokenUtilities.extractContentBetweenDelimeters(
            tokens,
            contentObject,
            tempIndex,
            this.matchClosingParentheses
        );

        if (typeof urlName.content === "string") {
            return { node: exitText + urlName.content, index: urlName.index };
        }

        return {
            node: new InlineElementMarkdownNode({
                parent: parent,
                type: "link",
                children: { title: linkName.content, url: urlName.content },
                rowStart: tokens[startIndex]?.position.row || 0,
                rowEnd: tokens[urlName.index - 1]?.position.row || 0,
                columnStart: tokens[startIndex]?.position.column,
                columnEnd: tokens[urlName.index - 1]?.position.column,
            }),
            index: urlName.index,
        };
    }
}