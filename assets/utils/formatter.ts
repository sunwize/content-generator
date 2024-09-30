import prettierHTML from "prettier/plugins/html";
import prettierCSS from "prettier/plugins/postcss";
import prettier from "prettier/standalone";

export const minifyCode = (code: string) => {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, "")  // Remove multi-line comments (/* */)
        .replace(/\/\/.*/g, "")            // Remove single-line comments (//)
        .replace(/\n\s*/g, "")             // Remove newlines and excess spaces
        .replace(/\s*{\s*/g, "{")          // Remove space before and after curly braces
        .replace(/\s*}\s*/g, "}")          // Remove space before and after closing curly braces
        .replace(/\s*;\s*/g, ";")          // Remove space before and after semicolons
        .replace(/\s*:\s*/g, ":")          // Remove space before and after colons
        .trim();                           // Remove leading and trailing spaces
};

export const formatCode = async (code: string, language: string) => {
    return await prettier.format(code, {
        parser: language === "xml" ? "html" : language,
        plugins: [prettierHTML, prettierCSS],
    });
};