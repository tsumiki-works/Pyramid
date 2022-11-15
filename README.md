# Pyramid

## Outline

Pyramidは、プログラミング教育を目的とした、関数型パラダイムを支援する、ヴィジュアルプログラミング言語である。

## Debug

TypeScriptで書かれているため、npmが必要である。
npmが実行できることを前提に、Pyramidのデバッグ実行環境の構築手順を以下に示す。

```sh
$ git clone "https://github.com/tsumiki-works/Pyramid.git"
$ cd Pyramid
$ npm install typescript    # ./node_modules/typescript/bin/にtscがインストールされる
$ npx tsc                   # ./ts/のすべて各スクリプトを./js/へコンパイルする
```

以降、index.htmlを開き、適宜リロードする。
