import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userNickState,
  userTypeState,
} from "../utils/RecoilData";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "./images/mainImage/logo2.jpg";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className="header">
      <div>
        {" "}
        <div className="logo">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
            />
          </Link>
        </div>
        <MainMenu />
        <UserMenu />
        <MobileMenu />
      </div>
    </header>
  );
};

const MainMenu = () => {
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsCommunityOpen(true);
  };
  const handleMouseLeave = () => {
    setIsCommunityOpen(false);
  };
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/accordion/">아코디언</Link>
        </li>
        <li>
          <Link to="/domestic/list">국내 여행</Link>
        </li>
        <li>
          <Link to="/foreign/list">해외 여행</Link>
        </li>
        <li>
          <Link to="/product/list">패키지 상품</Link>
        </li>
        <li>
          <Link to="/customerService">고객센터</Link>
        </li>
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Community
          {isCommunityOpen && (
            <ul className="community-menu">
              <li>
                <Link to="/board/list">자유게시판</Link>
              </li>
              <li>
                <Link to="/reviewBoard/list">후기게시판</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

const UserMenu = () => {
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate(); // navigate 훅을 사용하여 페이지 이동

  // const [isRendered, setIsRendered] = useState(false); // 렌더링 여부

  // useEffect(() => {
  //   if (isLogin) {
  //     setIsRendered(true);
  //   }
  // }, [isLogin]);

  const logout = () => {
    setLoginEmail("");
    setUserType(0);
    setUserNick("");

    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/"); // 홈 화면으로 이동
  };

  return (
    <ul className="user-menu">
      {isLogin ? (
        <>
          <li>
            <Link to="/mypage">{userNick}</Link>
          </li>
          <li>
            <button onClick={logout} className="logout-button">
              로그아웃
            </button>
          </li>
          {/* <li>
            <Link to="/#" onClick={logout}>
              로그아웃
            </Link>
          </li> */}
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/joinUser">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Header;
