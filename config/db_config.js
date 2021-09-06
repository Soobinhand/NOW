const mysql = require('mysql');  // mysql 모듈 로드
var connection = mysql.createConnection(
    {  // mysql 접속 설정
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1234',
        database: 'greenday'
    }
); // DB 커넥션 생성
connection.connect();   // DB 접속

module.exports = connection