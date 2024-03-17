import { InlineElementMarkdownNode } from "../../../models/markdownNodes";
import { TokenType } from "../../../models";
import { Token, TokenUtilities } from "../../../utilities";
import { InlineElementHandler, InlineParseParams } from "./inlineTypes";

export class ParseImage implements InlineElementHandler {
    matchElement(token: Token): boolean {
        return TokenUtilities.compareTokenValue(token, "![");
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
            prefix: "![",
            value: "",
            suffix: "]",
        };

        const imageName = TokenUtilities.extractContentBetweenDelimeters(
            tokens,
            contentObject,
            tempIndex,
            this.matchClosingSquareBracket
        );

        if (typeof imageName.content === "string") {
            return { node: imageName.content, index: imageName.index };
        }

        tempIndex = imageName.index;

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
                type: "image",
                children: { title: imageName.content, url: urlName.content },
                rowStart: tokens[startIndex]?.position.row || 0,
                rowEnd: tokens[urlName.index - 1]?.position.row || 0,
                columnStart: tokens[startIndex]?.position.column,
                columnEnd: tokens[urlName.index - 1]?.position.column,
            }),
            index: urlName.index,
        };
    }
}
