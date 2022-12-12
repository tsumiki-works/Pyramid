# Pyramid

## Outline

Pyramidは、プログラミング教育を目的とした、関数型パラダイムを支援する、ヴィジュアルプログラミング言語である。

## Debug

TypeScriptで書かれているため、npmが必要である。
npmが実行できることを前提に、実行環境の構築手順を以下に示す。

```sh
$ git clone "https://github.com/tsumiki-works/Pyramid.git"
$ cd Pyramid
$ npm ci    # package.json, package-lock.jsonを元に環境が用意される
```

### Build & Run Pyramid

環境構築が終わったら、tsファイルをコンパイルする。

```sh
$ npx tsc
```

なお、JavaScriptのimport文export文の仕様により、ローカルデバッグ時でも、ローカルサーバーを立てる必要がある。

VSCodeの拡張機能Live Serverを使うか、以下のPythonコマンドを打てば良い。但し、後者の場合はPythonコマンドのPathが通っている必要がある。

```python
python -m http.server
```

[http://localhost:8000/](http://localhost:8000/)にアクセスすると、index.htmlが表示される。

## Naming Rules of Branch

`dev/`から始まるブランチはプルリク時にデプロイされるので、デプロイしたいブランチ名には`dev/`をつける。
