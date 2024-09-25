import { useRecoilState } from "recoil";
import {
  loginEmailState,
  loginIdState,
  userNickState,
  userTypeState,
} from "../utils/RecoilData";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NaverLogin from "./NaverLogin";

const Login = () => {
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userEmail: "",
    userPw: "",
  });
  const changeUser = (e) => {
    const name = e.target.name;
    setUser({ ...user, [name]: e.target.value });
  };
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const login = () => {
    if (!isSocialLogin) {
      if (user.userEmail === "" || user.userPw === "") {
        Swal.fire({
          title: "이메일 혹은 비밀번호를 입력해주세요.",
          icon: "warning",
        });
        return;
      }
    }

    axios
      .post(`${backServer}/user/login`, user)
      .then((res) => {
        console.log(res);
        setLoginEmail(res.data.userEmail);
        setUserType(res.data.userType);
        setUserNick(res.data.userNick);
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;

        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="section">
      <div className="login-box">
        <div className="img-box">
          <img className="logo" src="/image/logo1.png"></img>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userEmail">이메일</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="text"
                name="userEmail"
                id="userEmail"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="login-input-group">
            <div className="label-box">
              <label htmlFor="userPw">비밀번호</label>
            </div>
            <div className="input-box">
              <input
                className="user-input"
                type="password"
                name="userPw"
                id="userPw"
                onChange={changeUser}
              ></input>
            </div>
          </div>
          <div className="menu-box">
            <div className="id-box">
              <Link to="/findEmail">이메일 찾기</Link>
            </div>
            <div className="pw-box">
              <Link to="/findPw">비밀번호 찾기</Link>
            </div>
          </div>
          <div className="login-btn-box">
            <button className="login-btn" type="submit">
              로그인
            </button>
          </div>
          <div className="naver-login-box">
            <NaverLogin setIsSocialLogin={setIsSocialLogin} />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
