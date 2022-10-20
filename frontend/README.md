# Pyramid frontend

## WebGL2.0

WebGL2.0を用いて描画を行う。

WebGLに関するすべて処理はjs/webgl内のスクリプトで閉じている。
従って、初期化時及び描画時のみ、以下のAPIを用いて欲しい。

* init_webgl
  * WebGLを初期化する関数
  * WebGLを用いるcanvasを指定する
* update_webgl
  * WebGLで描画を行う関数
  * 描画リクエスト配列を指定する
  * 各描画リクエストは次の配列
    1. テクスチャ
    2. 移動量
    3. 拡縮率 (`[0.0,0.0,0.0]`だとサイズが0になることに注意)
* create_image_texture
  * テクスチャをimgエレメントから生成する関数
  * imgエレメントを指定する

## ローカルサーバー

WebGL2.0は、リソースの取扱いに対し、厳しいセキュリティを持っている。
このために、ローカルデバッグ時でも、ローカルサーバーを立てる必要がある。

Pythonを用いて簡単に実現できる。frontendserver.pyは、このためのスクリプトで、これを実行すれば良い。

```
$ python frontendserver.py
```

[http://localhost:8000/](http://localhost:8000/)にアクセスすると、index.htmlが表示される。

## 画像

画像は取り敢えず、サイズが2のべき乗であるようなpngファイルでなければならない。

また、ロードを確実に行うために、index.html内に不可視のimgタグを配置し、これからテクスチャを作成する。
