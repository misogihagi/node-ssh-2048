# node-ssh-2048
teratermなどのターミナルソフトを使うときは限られています。ネットワークなりサーバーなりいじる人ぐらいしか使いません。
暇なときはあります。ビルド、デプロイ、コンフィグリストア、例を挙げればでるわでるわ。

そういう時はターミナルソフトで遊びたくなります。そんなわけで2048をsshで飛ばせるようにしました。

![play.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/230043/930390a2-9883-3e55-ab79-60c16a567762.gif)

[thanks!]( https://github.com/bestvist/2048.node)

# 使い方

herokuで試す場合はこちらにssh
ssh://node-ssh-2048.herokuapp.com

ローカルで動かす場合はこちら

```bash
git clone https://github.com/misogihagi/node-ssh-2048.git
npm i
node 2048
```

そして
localhostにでてきたポートにsshしてください

# デモ

![de.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/230043/c7714616-bd75-30e8-c028-2ff7a046e6b6.gif)


# おまけ
実は類似のサービスがあります。
play@ascii.town

他にもターミナルで遊べそうなものがあれば教えてください
## おまけのおまけ
2048RTA
[https://github.com/misogihagi/node-ssh-2048/blob/master/rta.gif?raw=true](https://github.com/misogihagi/node-ssh-2048/blob/master/rta.gif?raw=true)

