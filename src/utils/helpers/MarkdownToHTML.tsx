import { Parser } from "../parser";
import { typeToFunctionMap, NodeType } from "./typeToFunctionMap";

/**
 * Converts markdown text to HTML elements by parsing the markdown,
 * transforming it into an abstract syntax tree (AST), and then mapping
 * each node of the tree to a specific React component based on the node type.
 * 
 * This function leverages a predefined map (`typeToFunctionMap`) of node types
 * to component rendering functions, enabling dynamic rendering of various markdown
 * elements as React components.
 *
 * @param {string} markdown - The markdown text to be converted into HTML elements.
 * @returns {JSX.Element} A React fragment containing the rendered HTML elements.
 */
export function markdownToHTML(markdown: string) {
    const markdownTreeRoot = new Parser(markdown).parse();
    const markdownChildren = markdownTreeRoot.children!;
    return (
        <>
            {markdownChildren.map((ele) => {
                let creationMethod = typeToFunctionMap[ele.type as NodeType];
                return creationMethod(ele);
            })}
        </>
    );
}
