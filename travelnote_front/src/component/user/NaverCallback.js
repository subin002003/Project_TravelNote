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
        const user = naverLogin.user;
        console.log("User Info:", user);
        navigate("/");
      } else {
        console.error("네이버 로그인 실패");
        navigate("/");
      }
    });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default NaverCallback;
