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
|HTML5|Node JS|MongoDB|
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
    - nickname
    - pw
- now_board
- now_post

## 백엔드
### USER
- 회원가입
    - id, name, email, nickname, pw, pw확인
    - pw 암호화
- 로그인
    - nickname, pw
    - nickname,pw이 틀렸을 시, 맞았을 시.
    - 세션 처리
- 로그아웃
- 회원 정보 수정
- 회원 탈퇴

### HOME
- 홈 버튼
- 모든 게시판 버튼
- 이름(정보수정) 버튼
- 로그아웃 버튼 (여기까지는 상단 탭)
- 찜 목록 보여주기

### BOARD
- 홈 버튼
- 게시판 검색 바
- 이름(정보수정) 버튼
- 로그아웃 버튼 (여기까지는 상단 탭)
- 게시판 만들기 버튼

### POST
- 홈 버튼
- 게시글 검색 바
- 이름(정보수정) 버튼
- 로그아웃 버튼 (여기까지는 상단 탭)
- 맨 윗 줄 무슨 게시판인지 게시판 제목 일러주기(게시판 찜하기 버튼)
- 게시글 목록 
- 게시글 누르고 들어갈 수 있음.
- > 글 번호 , 작성자, 글 제목, 댓글 수, 조회수
- 본인 글이면 수정, 삭제 가능
- 본인 글이 아니면 조회와 댓글만 가능
- 게시글 쓰기 버튼

## 프론트엔드
### index.html 랜딩페이지
- ~~가입하기 버튼~~
- ~~로그인 버튼~~
- ~~정적인 것으로 꾸밀 수는 있는거야.~~
### signup.html
- 이름, 이메일, 닉네임, 비밀번호, 비밀번호 확인 input 이 있고,
- 가입하기 버튼
### login.html
- 닉네임, 비밀번호
- 로그인하기 버튼
### home.ejs
- 홈 버튼
- 모든 게시판 버튼
- 정보수정 버튼
- 로그아웃 버튼 ; typedef 상단 탭
- 찜목록
### board.ejs
- 홈 버튼
- 게시판 검색 기능
- 정보수정 버튼
- 로그아웃 버튼 ; typedef 상단 탭
- 모든 게시판 목록 나열
- 게시판 만들기 버튼
### post.ejs
- 홈 버튼
- 해당 게시판의 게시글 검색 기능
- 정보수정 버튼
- 로그아웃 버튼 ; typedef 상단 탭
- 해당 게시판이 무슨 게시판인지 이름 반환
- 게시글 쓰기 버튼
- 댓글
### profile.ejs
- 닉네임, 비밀번호
- 탈퇴하기 버튼
- 내가 쓴 글이나 쓴 댓글 보기

---
---

## 해야할 목록 순서
- ~~"/" 에 해당하는 index.html 만들기~~
- "/signup" 에 해당하는 signup.html
