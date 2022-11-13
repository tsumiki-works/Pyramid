# Pyramid frontend

## Commands

基本、コンソールに機能を集中する。利用可能なコマンドは以下。

| Command | Description |
| ----- | ----- |
| `enumerate` | 現在あるすべてのブロックのS式をコンソールに列挙する。 |
| `generate [<x> <y> <type>]` | タイプが`type`であるブロックを、スクリーン座標`(x,y)`に一つ配置する。デフォルトは`x=400,y=200,type=0`。 |
| `eval <stree>` | 計算リクエストをサーバーへ送信する。 |

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
    1. 移動量 (vec3)
    2. 拡縮率 (vec3)
    3. 基本色 (vec4)
    4. テクスチャ (*create_image_texture関数で生成されたオブジェクト*)
    5. UVのオフセット (vec4)
    6. UIであるか (boolean)
* create_image_texture
  * テクスチャをimgエレメントから生成する関数
  * imgエレメントを指定する
* convert_clipping_to_view
  * クリッピング座標系からビュー座標系へ座標を変換する
  * 引数は以下。
    1. 変換したい座標 (vec4)
    2. キャンバス幅
    3. キャンバス高

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
この都合上、複数の画像を、一つの大きな画像に統合して利用する。

また、ロードを確実に行うために、index.html内に不可視のimgタグを配置し、これからテクスチャを作成する。
