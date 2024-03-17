import { Parser } from "../../utils/parser";

// Helper function to create a parser and parse the input markdown
const parseMarkdown = (markdown: string) => {
    const parser = new Parser(markdown);
    return parser.parse();
};

// Helper function to get the first child node from the parsed result
const getFirstChildNode = (result: any) => result.children?.[0] ?? null;

describe("Parser", () => {
    describe("Header tests", () => {
        it("parses level 5 headers correctly", () => {
            const markdownHeader = "##### Hello World!";
            const result = parseMarkdown(markdownHeader);

            expect(result.getStringValue()).toEqual(markdownHeader);
            expect(result.type).toEqual("root");

            const header = getFirstChildNode(result);
            expect(header?.getStringValue()).toEqual(markdownHeader);
            expect(header?.type).toEqual("heading5");
        });

        it("parses invalid headers as paragraphs", () => {
            const markdownHeader = "####### Hello World!";
            const result = parseMarkdown(markdownHeader);

            const paragraph = getFirstChildNode(result);
            expect(paragraph?.getStringValue()).toEqual(markdownHeader);
            expect(paragraph?.type).toEqual("paragraph");
        });
    });

    describe("Blockquote tests", () => {
        it("parses blockquotes correctly", () => {
            const markdownBlockquote = "> Hello World!";
            const result = parseMarkdown(markdownBlockquote);

            const blockquote = getFirstChildNode(result);
            expect(blockquote?.getStringValue()).toEqual(markdownBlockquote);
            expect(blockquote?.type).toEqual("blockquote");
        });

        it("parses incorrect blockquotes as paragraphs", () => {
            const markdownFalseBlockquote = ">> Hello World!";
            const result = parseMarkdown(markdownFalseBlockquote);

            const paragraph = getFirstChildNode(result);
            expect(paragraph?.getStringValue()).toEqual(markdownFalseBlockquote);
            expect(paragraph?.type).toEqual("paragraph");
        });
    });

    describe("List tests", () => {
        it("parses ordered lists correctly", () => {
            const markdownList = "1. Hello World!\n2. Hello Universe!";
            const result = parseMarkdown(markdownList);

            const list = getFirstChildNode(result);
            expect(list?.getStringValue()).toBe(markdownList);
            expect(list?.type).toEqual("orderedlist");
        });

        it("parses unordered lists correctly", () => {
            const markdownList = "* Hello World!\n* Hello Universe!";
            const result = parseMarkdown(markdownList);

            const list = getFirstChildNode(result);
            expect(list?.getStringValue()).toBe(markdownList);
            expect(list?.type).toEqual("unorderedlist");
        });
    });

    describe("Code Block", () => {
        it("parses code blocks correctly", () => {
            const markdownCodeBlock = "```Hello World!\n* Hello Universe!```";
            const result = parseMarkdown(markdownCodeBlock);

            const codeBlock = getFirstChildNode(result);
            expect(codeBlock?.getStringValue()).toBe(markdownCodeBlock);
            expect(codeBlock?.type).toEqual("codeblock");
        });
    });
});

