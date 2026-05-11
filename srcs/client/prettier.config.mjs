const config = {
  printWidth: 80,
  tabWidth: 2,       // インデントはスペース2つ
  singleQuote: true, // 文字列はシングルクオートを使用
  quoteProps: "as-needed",
  jsxSingleQuote: true,
  bracketSameLine: false,
  endOfLine: "lf",
  semi: true,       // 行末にセミコロンを付ける
  trailingComma: "all",
  arrowParens: "always",
  bracketSpacing: true, // オブジェクトの波括弧の間にスペースを入れる
  proseWrap: "always",
  htmlWhitespaceSensitivity: "css",
  plugins: [
    'prettier-plugin-tailwindcss', // Tailwindクラス順を自動整理
  ], 

}

export default config