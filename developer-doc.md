# Neos Frames

## フロントエンド
技術構成は Nuxt.js(v2) + pugです。

### 環境構築
```shell
$ git clone https://github.com/rassi0429/photo.neos.love
$ cd front
$ npm install
$ npm run dev
```
で、3081番ポートにローカルサーバがたちます。`api_host`環境変数で、バックエンドへの接続先を変更することができます。



## バックエンド
```shell
$ git clone https://github.com/rassi0429/photo.neos.love
$ cd back
$ npm install
$ docker-compose up db
$ npm run migration:run
$ npm run start:dev
```
で、3080番ポートにローカルサーバがたちます。