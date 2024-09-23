import React from "react";

const NaverLogin = ({ setIsSocialLogin }) => {
  // 네이버 로그인 버튼 클릭 시 네이버 로그인 페이지로 이동
  const handleNaverLogin = () => {
    setIsSocialLogin(true);
    const clientId = "NumWEDcbCHhbmWrzbpCl"; // 발급받은 Client ID
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/login/oauth2/code/naver"
    ); // 등록한 콜백 URL
    const state = Math.random().toString(36).substr(2, 12); // 랜덤한 상태 토큰 생성

    // 네이버 로그인 페이지 URL 생성
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    // 네이버 로그인 페이지로 리디렉션
    window.location.href = naverLoginUrl;
  };

  return (
    <div className="naver-login-box">
      <button className="naver-login-btn" onClick={handleNaverLogin}>
        <img
          className="naver-login-img"
          src="https://static.nid.naver.com/oauth/small_g_in.PNG"
          alt="네이버 로그인"
        />
      </button>
    </div>
  );
};

export default NaverLogin;
