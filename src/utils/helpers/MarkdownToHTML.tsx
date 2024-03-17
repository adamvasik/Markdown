import { Parser } from "../parser";
import { typeToFunctionMap, NodeType } from "./typeToFunctionMap";

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
