# Table of contents

- [프로젝트 개요](#프로젝트-개요)
- [데모](#데모)
- [아키텍처](#아키텍처)
- [피쳐](#피쳐)
- [실행/테스트 환경](#실행테스트-환경)
- [레퍼런스](#레퍼런스)

## 프로젝트 개요

- 당신의 최애 사도는 누구인가요? 릭트컬 거버넌스에 참여하여 최애 사도 월드컵을 만들고 친구들에게 공유해보세요!

<div align="center" style="width: 1080px; height: 1920px;">
    
https://github.com/user-attachments/assets/1478a337-a1ff-415d-aefe-94d941fcf9e7

</div>

## 데모

- https://demo.developerasun.dpdns.org

## 아키텍처

_엔지니어링 근거_

1. 장기간 접속 가능해야 합니다. 대부분의 사이드 프로젝트, 또는 면접 과제들은 짧으면 3일, 길면 한 두달 이내 배포된 인스턴스를 삭제합니다. 결국 유지 보수되지 않고 프로젝트는 사라집니다.

이를 방지하기 위해 처음부터 `지속 가능한` 형태로 프로젝트 구성요소 설계합니다.

2. 적절한 보안 요소가 배치되어야 합니다. 배포하는 순간, 즉 인터넷에 노출되는 순간부터 봇들은 덤벼듭니다. 특히 요새는 ai 크롤링 때문에 더 많습니다.

3. 간결해야 합니다. 웹3 프로젝트 특성 상, 서비스 ux는 이미 풍비박산 난 경우가 많습니다. 온체인 이벤트, 니모닉, 트랜잭션 실패, 가스비 ... 블록체인 프로젝트(dapp, hybrid)가 요구하는 기술적 특성과 한계에 관해서 유저는 사실 크게 관심 없는 경우가 많습니다. 블록체인 요소가 적용되어야 하지만, 동시에 이용에 불편함이 없어야 합니다.

_클라이언트&서버_

- 풀스택: nextjs
- ui: shadcn, tailwind
- 배치(크론) 서버: github action

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
- 로그아웃하기
- 월드컵 포인트/투표권 얻기
- 엘리프 발급 트랜잭션 연동하기
- 내 포인트/엘리프 잔고 확인하기
- 신규 월드컵 생성하기
- 지갑으로 월드컵 내용 서명하기
- 월드컵 시작/종료 자동 업데이트하기([크론 배치](https://github.com/developerasun/ricktcal-worldcup/tree/dev/.github/workflows))
- 엘리프 투표권 사용해서 월드컵 투표하기
- 현재 월드컵 진행 상황 확인하기
- 전체 월드컵 참여자 리스트 확인하기
- 개인 월드컵 참여 히스토리 확인하기
- 내 프로필 페이지 확인하기
- 자주 묻는 질문 확인하기
- 온보딩 투어 사용하기

### TODO

- 월드컵 투표 트랜잭션 연동하기
- 월드컵 승리 보상 추가하기(배치 크론)
- 데이터베이스 백업하기

## 실행/테스트 환경

### web2: application

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
# move to /apidoc page, required api key on production
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

### web3: onchain

- [별도 문서화](https://github.com/developerasun/ricktcal-worldcup/blob/dev/blockchain/README.md)

## 레퍼런스

- [cloudflare docs: worker framework guide: nextjs](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [cloudflare docs: d1 getting started](https://developers.cloudflare.com/d1/get-started/)
- [github: TypeORM with Next.JS example project](https://github.com/gladykov/typeorm-next.js)
- [cloudflare docs: Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
- [github: sign in with ethereum](https://github.com/spruceid/siwe)
- [root wallet tx history: ethereum sepolia](https://sepolia.etherscan.io/address/0xb052cabd197fd9ca9a0a1dc388b25e7326f28439)
- [eth faucet for test](https://cloud.google.com/application/web3/faucet)
- [cloudflare d1 docs: Billing metrics](https://developers.cloudflare.com/d1/platform/pricing/#billing-metrics)
