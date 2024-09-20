import { useEffect } from "react";

const NaverLogin = () => {
  const { naver } = window;

  useEffect(() => {
    const initNaverLogin = () => {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: "45MLUJ3s3MNuO6wE4fKq", // 네이버 개발자 콘솔에서 발급받은 Client ID
        callbackUrl: "http://localhost:3000/login/oauth2/code/naver", // 설정한 Redirect URI
        isPopup: false, // 팝업 여부
        loginButton: { color: "green", type: 2, height: 40, width: 100 }, // 로그인 버튼 스타일
      });

      naverLogin.init(); // 네이버 로그인 초기화
      console.log(naverLogin.user);
    };

    if (window.naver) {
      initNaverLogin(); // 네이버 SDK가 로드되면 초기화 함수 호출
    } else {
      console.error("네이버 로그인 SDK를 로드할 수 없습니다.");
    }
  }, []);

  return <div id="naverIdLogin" />;
};

export default NaverLogin;
