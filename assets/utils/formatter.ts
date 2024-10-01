import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";
import prettierHTML from "prettier/plugins/html";
import prettierCSS from "prettier/plugins/postcss";
import prettier from "prettier/standalone";

export const formatCode = async (code: string, parser: string) => {
    return await prettier.format(code, {
        parser,
        plugins: [prettierBabel, prettierEstree, prettierHTML, prettierCSS],
    });
};