import { Link } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import axios from "axios";
import { useState } from "react";
import logo from "./images/mainImage/logo2.jpg";

const Header = () => {
  return (
    <header className="header">
      <div data-header-container>
        {" "}
        <div className="logo">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              style={{
                width: "250px",
                height: "150px",
              }}
            />
          </Link>
        </div>
        <MainNavi />
        <HeaderLink />
      </div>
    </header>
  );
};

const MainNavi = () => {
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
          <Link to="/foreign/list">해외 여행</Link>
        </li>
        <li>
          <Link to="/domestic/list">국내 여행</Link>
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
                <Link to="/QnaBoard/list">QnA게시판</Link>
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

const HeaderLink = () => {
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);

  const isLogin = useRecoilValue(isLoginState);
  const logout = () => {
    setLoginEmail("");
    setUserType(0);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
  };

  return (
    <ul className="user-menu">
      {isLogin ? (
        <>
          <li>
            <Link to="/mypage">{loginEmail}</Link>
          </li>
          <li>
            <Link to="/#" onClick={logout}>
              로그아웃
            </Link>
          </li>
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
