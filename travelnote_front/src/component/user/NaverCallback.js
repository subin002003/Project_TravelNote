import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { naver } = window;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: "45MLUJ3s3MNuO6wE4fKq", // 네이버 개발자 콘솔에서 발급받은 Client ID
      callbackUrl: "http://localhost:3000/login/oauth2/code/naver",
    });
    naverLogin.getLoginStatus((status) => {
      if (status) {
        const token = naverLogin.accessToken.accessToken; // 액세스 토큰 확인
        console.log("네이버 로그인 성공, 액세스 토큰: ", token);
        console.log("액세스 토큰: ", naverLogin.accessToken);
      } else {
        console.error("액세스 토큰을 받지 못했습니다.");
        console.error("로그인 실패: 응답에서 오류 발생");
        // 오류 응답 로그 확인
        console.log(naverLogin);
      }
    });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default NaverCallback;
