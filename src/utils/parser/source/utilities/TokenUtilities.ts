import { TokenType } from "../models";
import { Token } from "./Lexer";

type ContentObject = {
    prefix: string;
    value: string;
    suffix: string;
};

/**
 * Provides utility functions for token comparison and content extraction in markdown parsing.
 */
export class TokenUtilities {
    /**
     * Compares the type of a given token with a specified token type.
     * @param {Token | null} token - The token to be compared.
     * @param {TokenType} tokenType - The target token type for comparison.
     * @returns {boolean} True if the token's type matches the specified tokenType, false otherwise.
     */
    public static compareTokenType(
        token: Token | null,
        tokenType: TokenType
    ): boolean {
        if (!token || token === undefined) {
            return false;
        }

        return token.tokenType === tokenType;
    }

    /**
     * Checks if a given token's type matches any of the specified token types.
     * @param {Token | null} token - The token to be compared.
     * @param {string[]} tokenTypes - An array of token types to compare against.
     * @returns {boolean} True if the token's type is found within tokenTypes, false otherwise.
     */
    public static compareTokenTypes(
        token: Token | null,
        tokenTypes: string[]
    ): boolean {
        if (!token || token === undefined) {
            return false;
        }

        return tokenTypes.includes(token.tokenType);
    }

    /**
     * Compares the value of a given token with a specified string value.
     * @param {Token | null | undefined} token - The token whose value is to be compared.
     * @param {string} tokenValue - The string value to compare against the token's value.
     * @returns {boolean} True if the token's value matches tokenValue, false otherwise.
     */
    public static compareTokenValue(
        token: Token | null | undefined,
        tokenValue: string
    ): boolean {
        if (!token || token === undefined) {
            return false;
        }

        return token.value === tokenValue;
    }

    /**
     * Consumes tokens from a specified start index until a condition is met or an escape condition is encountered.
     * @param {Token[]} tokens - The array of tokens to consume.
     * @param {number} startIndex - The start index in the tokens array.
     * @param {(token: Token) => boolean} condition - A function that defines the condition to stop consuming tokens.
     * @param {(token: Token) => boolean} escape - A function that defines an escape condition to prematurely stop consuming tokens.
     * @returns {{ text: string; index: number } | null} An object containing the concatenated text of consumed tokens and the index after consumption, or null if the escape condition is met.
     */
    public static consumeTokensUntil(
        tokens: Token[],
        startIndex: number,
        condition: (token: Token) => boolean,
        escape: (token: Token) => boolean
    ): { text: string; index: number } | null {
        let result = "";
        let tempIndex = startIndex;
        let currentToken = tokens[tempIndex];

        if (!currentToken || escape(currentToken)) {
            return null; // Early return
        }

        while (currentToken && !condition(currentToken)) {
            if (escape(currentToken)) {
                return null;
            }
            result += tokens[tempIndex]?.value;
            tempIndex++;
            currentToken = tokens[tempIndex];
        }

        return { text: result, index: tempIndex }; // Return the new index along with the result
    }

    /**
     * Extracts inline content between delimiters based on a specified condition.
     * @param {Token[]} tokens - The array of tokens to extract content from.
     * @param {ContentObject} contentObject - An object specifying the prefix and suffix delimiters.
     * @param {number} startIndex - The start index in the tokens array.
     * @param {(token: Token) => boolean} condition - A function to determine the end of content extraction.
     * @returns {{ content: ContentObject | string; index: number }} An object containing the extracted content and the index after extraction.
     */
    public static extractContentBetweenDelimeters(
        tokens: Token[],
        contentObject: ContentObject,
        startIndex: number,
        condition: (token: Token) => boolean
    ): { content: ContentObject | string; index: number } {
        // init temporary index
        let tempIndex = startIndex;
        // move past prefix
        tempIndex += contentObject.prefix.length;

        const value = TokenUtilities.consumeTokensUntil(
            tokens,
            tempIndex,
            condition,
            TokenUtilities.isNewline
        );

        if (!value) {
            const result = TokenUtilities.consumeTokensUntil(
                tokens,
                startIndex,
                TokenUtilities.isNewline,
                TokenUtilities.escapeAlwaysFalse
            );

            if (!result) {
                return { content: contentObject.prefix, index: tempIndex };
            }

            const { text, index } = result;

            return { content: text, index: index };
        }

        const { text, index } = value;

        const returnObject = {
            prefix: contentObject.prefix,
            value: text,
            suffix: contentObject.suffix,
        };

        tempIndex = index + contentObject.suffix.length;

        return { content: returnObject, index: tempIndex };
    }

    /**
     * Determines if a given token represents a newline or carriage return.
     * @param {Token} [token] - The token to check.
     * @returns {boolean} True if the token is a newline or carriage return, false otherwise.
     */
    public static isNewline(token?: Token): boolean {
        if (!token || token === undefined) {
            return false;
        }

        return (
            TokenUtilities.compareTokenType(token, TokenType.Newline) ||
            TokenUtilities.compareTokenType(token, TokenType.CarriageReturn)
        );
    }

    /**
     * A utility function that always returns false, used as a default escape condition.
     * @param {Token} token - The token to evaluate.
     * @returns {false} Always returns false.
     */
    public static escapeAlwaysFalse(token: Token): false {
        token;
        return false;
    }
}
