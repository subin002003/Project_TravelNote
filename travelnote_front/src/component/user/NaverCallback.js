import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isLoginState,
  loginEmailState,
  userNickState,
  userTypeState,
} from "../utils/RecoilData";
import { useRecoilState, useRecoilValue } from "recoil";

const NaverCallback = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  useEffect(() => {
    // URL에서 authorization code와 state 추출
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    const state = urlParams.get("state");

    if (authorizationCode && state) {
      // 콘솔에 authorization code와 state 값을 출력하여 확인
      console.log("Authorization Code:", authorizationCode);
      console.log("State:", state);
      axios
        .post(`${backServer}/user/api/naver`, {
          authorizationCode: authorizationCode,
          state: state,
        })
        .then((res) => {
          console.log(res);
          setLoginEmail(res.data.userEmail);
          setUserType(res.data.userType);
          setUserNick(res.data.userNick);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          localStorage.setItem("accessToken", res.data.accessToken);
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.error("Authorization code 또는 state를 찾을 수 없습니다.");
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default NaverCallback;
