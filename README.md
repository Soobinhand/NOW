# NOW (Nickname On Web)
## NOW 란?
- 닉네임으로 활동하는 게시판입니다. 
- 닉네임은 익명이지만 중복 닉네임은 사용할 수 없으니 익명이 아닐지도...?
- 본인이 직접 게시판을 만들 수 있습니다.
- 게시글은 얼마든 작성해도 좋습니다.
- 홈 화면에는 본인이 찜을 한 게시판들이 있습니다.
- 궁금한 점 또는 그냥 하고 싶은 이야기들을 마음껏 써보세요!

<br>

## 기술 스택
|프론트엔드|백엔드|데이터베이스|
|---|---|---|
|HTML5|Node JS|MySQL|
|CSS3|EJS||
|JS|||

<br>




## DB
### Database
- now
### table
- now_user
    - id
    - name
    - email
    - nickname(PK)
    - pw
    - intro
    - intro_name
- now_board
    - id(PK)
    - title
    - sub
- now_post
    - id(PK)
    - title
    - content
    - nickname(FK : now_user(nickname))
    - board_title
    - post_time
- now_bookmark
    - bookmark_nickname(FK : now_user(nickname))
    - bookmark_board_id(FK : now_board(id))
    - {bookmark_nickname, bookmark_board_id}(PK)
- now_comment
    - comment_id(PK)
    - id(FK : now_post(id))
    - nickname(FK : now_user(nickname))
    - comment
    - board_id(FK : now_board(id))
- now_like
    - like_nickname(FK : now_user(nickname))
    - like_post_id(FK : now_post(id))
    - {like_nickname, like_post_id}(PK)

- ERD  
![img.png](img.png)


## 백엔드
### USER
- 회원가입
    - ~~id, name, email, nickname, pw, pwcheck~~
    - ~~pw 암호화~~
- 로그인
    - ~~nickname, pw~~
    - ~~nickname,pw이 틀렸을 시, 맞았을 시.~~
    - 세션 처리
- 로그아웃
- ~~회원 정보 수정~~
- ~~비밀번호 변경~~
- 회원 탈퇴

### HOME
- ~~홈 버튼~~
- ~~게시판 버튼~~
- ~~이름(정보수정) 버튼~~
- ~~찜 목록 보여주기~~

### BOARD
- ~~홈 버튼~~
- ~~게시판 검색 바~~
- ~~이름(정보수정) 버튼~~
- ~~게시판 만들기 버튼~~

### POST
- ~~홈 버튼~~
- ~~게시글 검색 바~~
- ~~이름(정보수정) 버튼~~
- ~~맨 윗 줄 무슨 게시판인지 게시판 제목 일러주기~~(게시판 찜하기 버튼)
- ~~게시글 목록~~ 
- ~~게시글 누르고 들어갈 수 있음.~~
- > ~~글 번호~~, ~~작성자~~, ~~글 제목~~,~~글 내용~~, ~~댓글 수~~, 조회수
- ~~본인 글이면 수정, 삭제 가능~~
- ~~본인 글이 아니면 조회~~와 댓글만 가능
- ~~게시글 쓰기 버튼~~
- ~~댓글 기능~~

## 프론트엔드
### index.html 랜딩페이지
- ~~가입하기 버튼~~
- ~~로그인 버튼~~
- ~~정적인 것으로 꾸밀 수는 있는거야.~~
### signup.html
- ~~이름, 이메일, 닉네임, 비밀번호, 비밀번호 확인 input 이 있고,~~
- ~~가입하기 버튼~~
### login.html
- ~~닉네임, 비밀번호~~
- ~~로그인하기 버튼~~
### home.ejs
- ~~홈 버튼~~
- ~~게시판 버튼~~
- ~~정보수정 버튼 ; typedef 상단 탭~~
- ~~찜목록~~
- ~~실시간 게시글~~
- ~~실검~~
### board.ejs
- ~~홈 버튼~~
- ~~게시판 검색 기능~~
- ~~정보수정 버튼~~
- ; typedef 상단 탭
- ~~모든 게시판 목록 나열~~
- ~~게시판 만들기 버튼~~
- ~~만들면 모든 게시판 페이지에 목록화~~
### post.ejs
- ~~홈 버튼~~
- ~~해당 게시판의 게시글 검색 기능~~
- ~~정보수정 버튼~~
- ; typedef 상단 탭
- ~~해당 게시판이 무슨 게시판인지 이름 반환~~
- ~~게시글 쓰기 버튼~~
- ~~댓글, 댓글 갯수~~
### profile.ejs
- ~~닉네임, 이름, 이메일~~
- 탈퇴하기 버튼
- ~~내가 쓴 글보기~~쓴 댓글 보기
- 로그아웃 버튼

## 어려운 기능
- 회원가입 시 비밀번호 암호화
- 로그인 시 암호화된 비밀번호 사용
- 로그인 시 아이디 비번 유효성 체크
- 게시글 조회 시, 제목이 같으면 어떤 것을 반환하는지?
- 버튼 클릭 시, 해당 DB를 가져오기

---
---

## 해야할 목록 순서
- ~~"/" 에 해당하는 index.html 만들기~~
- ~~"/signup" 에 해당하는 signup.html~~
- ~~회원가입 암호화, "/login" 에 해당하는 login.html~~
- ~~home.ejs 꾸미기~~
- ~~board.ejs 생성, greenday_board 테이블 생성~~
- ~~board.ejs 게시판 검색 기능~~
- ~~post.ejs 만들기~~
- ~~게시글 내용 구분하기 (글의 제목은 같을 수 있으나, 내용은 다른 것들 구분)~~
- ~~게시글 들어갔을 때, 수정,삭제가능 기능, 그리고 게시글 내림차순으로 정리~~
- ~~profile.ejs 만들기~~
- ~~댓글 기능~~
- ~~프로필에서 내가 쓴 글 보기.~~
- ~~검색 시 검색 결과 없음 출력~~
- ~~댓글 갯수 보이기~~
- ~~찜목록~~
- ~~좋아요 기능~~
- ~~실시간 좋아요 랭킹 기능~~
- ~~DB 정리~~
- ~~구글 로그인 구현~~
- ~~mypage.ejs 만들기(user db에 넣기)~~
- ~~내 프로필 수정 기능~~
- ~~남이 내 프로필 볼 수 있게~~
- ~~nickname 검색 기능 구현~~
- ~~대댓글.~~
- 배포
- 프로필 사진
- 로그아웃, 탈퇴(cascade), 비밀번호 찾기