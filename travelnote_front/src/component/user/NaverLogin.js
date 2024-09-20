import { useEffect } from "react";

const NaverLogin = () => {
  const { naver } = window;

  useEffect(() => {
    const { naver } = window;

    if (!naver) {
      console.error("네이버 SDK 로드 실패");
      return;
    }

    const naverLogin = new naver.LoginWithNaverId({
      clientId: "45MLUJ3s3MNuO6wE4fKq",
      callbackUrl: "http://localhost:3000/login/oauth2/code/naver",
      isPopup: false,
      loginButton: { color: "green", type: 2, height: 40, width: 100 },
    });

    naverLogin.init();
  }, []);

  return <div id="naverIdLogin" />;
};

export default NaverLogin;
