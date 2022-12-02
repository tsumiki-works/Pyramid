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

なお、WebGL2.0はリソースの取扱いに対し、厳しいセキュリティを持っている。
このために、ローカルデバッグ時でも、ローカルサーバーを立てる必要がある。

frontendserver.pyは、このためのスクリプトで、これを実行すれば良い。

```sh
$ python frontendserver.py
```

[http://localhost:8000/](http://localhost:8000/)にアクセスすると、index.htmlが表示される。

## Naming Rules of Branch
`dev/`から始まるブランチはプルリク時にデプロイされるので、デプロイしたいブランチ名には`dev/`をつける。
