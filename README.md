# Table of contents

- [프로젝트 개요](#프로젝트-개요)
  - [접속 url](#접속-url)
  - [아키텍처](#아키텍처)
  - [피쳐](#피쳐)
  - [테스트](#테스트)
  - [레퍼런스](#레퍼런스)

## 프로젝트 개요

lorem

## 접속 url

- https://demo.developerasun.dpdns.org

## 아키텍처

_기술스택_
풀스택: nextjs
스마트 컨트랙트: hardhat

_인프라_
도메인: digitalplat
네임서버: 클라우드플레어
방화벽: 클라우드 플레어 waf, botfight mode

_서버_
서버리스: 클라우드플레어 worker
api 키 관리
https://developers.cloudflare.com/workers/configuration/secrets/#via-wrangler

_데이터베이스_
클라우드플레어 d1 (sqlite3)
drizzle orm

## 피쳐

지갑 생성
닉네임 맵핑

## 테스트

크론

```sh
"cron:dev": "curl --request POST  --url 'http://localhost:3000/api/webhook'  --header 'Authorization: Bearer test-key'"
```

## 레퍼런스

https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
https://developers.cloudflare.com/d1/get-started/
https://github.com/gladykov/typeorm-next.js
https://developers.cloudflare.com/hyperdrive/

- [root wallet tx history: ethereum sepolia](https://sepolia.etherscan.io/address/0xb052cabd197fd9ca9a0a1dc388b25e7326f28439)
- [eth faucet for test](https://cloud.google.com/application/web3/faucet)
