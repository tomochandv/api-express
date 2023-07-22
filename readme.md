# 개요

express와 javascript로 구현한 CRUD 프로그램.

- typescript는 사용하지 않았습니다.

# 구조

.env: 환경변수 - 데이터베이스 연결 정보및 토큰 키값.

/src : 기능 파일들

- common : 공통적으로 쓰이는 파일들
- controller: 라우팅을 해서 서비스 파일을 로드 하는 파일들
- dac: database에 쿼리를 하는 파일들
- middleware: 미들웨어 파일들
- model: 모델 class 파일들
- service: 비지니스 로직이 있는 파일들
- test: service의 TDD를 하는 테스트 파일들

index.js : 시작 파일

# 실행

### 실행전 .env 파일에 자신에 해당하는 디비 정보로 변경한다.

test

```sh
npm run test
```

실행

```sh
npm run start:dev
```

# api

로그인을 제외한 모든 api는 헤더에 auth 라는 키로 로그인시 받은 token을 입력하여야 한다.
인증 실페시 401을 돌려준다.

모든 응답은 상태가 200 이며, body에 아래처럼 돌려준다

```json
{
  "result": true, // 실행여부
  "data": null, // 되돌려주는 데이터가 있을시에 채워짐
  "message": null, // 벨리데이션 실패시 메세지 반환
  "statusCode": 200 // 서버에러: 500, 벨리데이션 실패: 501
}
```

### 로그인

url : http://localhost:3000/login
method: post
param : body

```json
{
  "userName": "user1"
}
```

특이 사항 : 실제는 비밀번호 2차인증같은 인증들이 있어야 한다.

### 저장

url : http://localhost:3000/workout/add
method: post
param : formBody

```
type: 운동 타입 (현재는 한글로 받는다. 프로덕션에서는 코드로 관리해야 한다.)
imgs: 이미지 파일들 여러개여도 name은 imgs하나로 한다.
```

### 수정

url : http://localhost:3000/workout/edit
method: post
param : formBody

```
wiIdx: 게시물 번호
type: 운동 타입 (현재는 한글로 받는다. 프로덕션에서는 코드로 관리해야 한다.)
imgs: 이미지 파일들 여러개여도 name은 imgs하나로 한다.
```

특이사항: 수정시 기존이미지는 전부 삭제후 올라온 이미지를 저장한다.

### 삭제

url : http://localhost:3000/workout/remove?wiIdx=1
method: delete
query :

```
wiIdx: 게시물 번호
```

### 리스트

url : http://localhost:3000/workout?page=1&rows=10&type=점핑&sortType=W&sort=D
method: delete
query :

```
page: 페이지 번호
rows: 보여질 게시물 수
type: 운동 타입(현재는 한글로. 전체 볼시 A 로 넘겨줌)
sortType: 정렬필드 (W: 게시물 생성일 순서, C: 댓글 생성일 순서)
sort: A 오름차순, D 내림 차순
```

### 이미지

url : http://localhost:3000/workout/1
method: get
param :

```
url에 게시글 번호를 붙여준다.
```
