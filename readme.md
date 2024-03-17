## @adamvasik/markdown

A personalized React component that parses markdown and renders it into HTML. This component internally constructs a syntax tree from the input markdown, traverses this tree, and dynamically generates corresponding DOM elements.

**Installation:**
```bash
npm install @adamvasik/markdown 
```

**Example Usage:** 
```typescript
import { MarkdownPreview } from "@adamvasik/markdown";

const App = () => {
    return (
        <>
            <h1>Markdown:</h1>
            <MarkdownPreview markdownContent={"# Hello World!"} />
        </>
    );
}
```

**Supported Grammar:**

_Document is a series of blocks._

`document = { block }`

 _A block can be a paragraph, header, blockquote, list or code block._

 `block = paragraph | header | blockquote | list | code_block`

_Paragraphs are simply text separated by one or more blank lines._

`paragraph = text, { newline, newline, text }`

_Blockquotes._
`blockquote = ">", { ">", text }`

_Lists can be unordered or ordered._

`list = unordered_list | ordered_list`

`unordered_list = ( "*", " " ), text, { newline, ( "*", " " ), text }`

`ordered_list = digit, ".", " ", text, { newline, digit, ".", " ", text }`


_Code blocks._

`code_block = "```", newline*, { text }, newline*, "```"`

_Inline elements can be within other blocks like paragraphs and headers._

`text = { inline_element | chars }`

`inline_element = code | emph | strong | link | image`


_Inline code._

```code = "`", chars, "`"```


_Emphasis can be italics or bold, using either asterisks or underscores._

`emph = ( "*" | "_" ), text, ( "*" | "_" )`

`strong = ( "**" | "__" ), text, ( "**" | "__" )`


_Links._

`link = "[", text, "]", "(", url, ")"`


_Images._

`image = "!", "[", alt_text, "]", "(", url, ")"`


**Happy coding!**