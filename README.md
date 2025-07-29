# Table of contents

- [프로젝트 개요](#프로젝트-개요)
  - [접속 url](#접속-url)
  - [아키텍처](#아키텍처)
  - [피쳐](#피쳐)
  - [테스트](#테스트)
  - [레퍼런스](#레퍼런스)

## 프로젝트 개요

- 당신의 최애 사도는 누구인가요? 릭트컬 거버넌스에 참여하여 최애 사도 월드컵을 만들고 친구들에게 공유해보세요!

<div align="center" style="width: 1080px; height: 1920px;">
    
https://github.com/user-attachments/assets/8efe99cf-0f1b-46e8-99d1-e0796c9f6178

</div>

## 접속 url

- https://demo.developerasun.dpdns.org

## 아키텍처

_클라이언트&서버_

- 풀스택: nextjs
- ui: shadcn, tailwind

_블록체인_

- 스마트 컨트랙트: hardhat

_인프라_

- 도메인: digitalplat
- 네임서버: 클라우드플레어
- 방화벽: 클라우드 플레어 waf, botfight mode

_배포_

- 서버리스: 클라우드플레어 worker
- 시크릿 관리: https://developers.cloudflare.com/workers/configuration/secrets/#via-wrangler

_데이터베이스_

- 클라우드플레어 d1 (sqlite3)
- drizzle orm: https://orm.drizzle.team/docs/connect-cloudflare-d1#step-2---initialize-the-driver-and-make-a-query

## 피쳐

- 라이트/다크 모드 설정하기
- 내 블록체인 지갑 생성하기
- 지갑으로 로그인하기(experimental)
- 거버넌스 포인트 클레임하기
- 내 지갑 잔고 확인하기
- 신규 거버넌스 안건 생성하기
- 지갑으로 투표하기

### TODO: web2

- 거버넌스 안건 투표하기
- 거버넌스 투표 현황 확인하기
- 거버넌스 포인트<=>토큰 교환하기
- 최애사도 8강 월드컵 생성하기

### TODO: web3

- 거버넌스 토큰 컨트랙트
- 거버넌스 투표 컨트랙트

## 실행/테스트 환경

_dev_

nextjs 로컬 https, 프로덕션 쿠키 옵션 모킹

```sh
# package.json
"dev": "next dev --turbopack --experimental-https",

# run
pnpm dev
```

[next-swagger-doc](https://github.com/jellydn/next-swagger-doc), 스웨거 api 테스트

```sh
# move to /apidoc page, unavailable on production
```

_stage_

워커 배포 환경 모킹, 스테이징

```sh
pnpm preview
```

데이터베이스 마이그레이션(로컬 sqlite3 파일 생성 및 싱크)

```sh
# package.json
"db:schema": "pnpm exec drizzle-kit generate",
"db:local": "wrangler d1 execute ricktcal-db --remote --file=./src/server/database/migrations/0003_wet_energizer.sql",

# run schema gen
pnpm db:schema

# run schema migration
pnpm db:local
```

_prod_

서버 배포 처리

```sh
# package.json
"dep": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",

# run
pnpm dep
```

데이터베이스 마이그레이션(클라우드 d1(sqlite3) 인스턴스 생성 및 싱크)

```sh
# package.json
"db:schema": "pnpm exec drizzle-kit generate",
"db:remote": "wrangler d1 execute ricktcal-db --remote --file=./src/server/database/migrations/0003_wet_energizer.sql",

# run schema gen
pnpm db:schema

# run schema migration
pnpm db:remote
```

## 레퍼런스

- [cloudflare docs: worker framework guide: nextjs](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [cloudflare docs: d1 getting started](https://developers.cloudflare.com/d1/get-started/)
- [github: TypeORM with Next.JS example project](https://github.com/gladykov/typeorm-next.js)
- [cloudflare docs: Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
- [github: sign in with ethereum](https://github.com/spruceid/siwe)
- [root wallet tx history: ethereum sepolia](https://sepolia.etherscan.io/address/0xb052cabd197fd9ca9a0a1dc388b25e7326f28439)
- [eth faucet for test](https://cloud.google.com/application/web3/faucet)
