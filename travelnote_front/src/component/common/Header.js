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

const Header = () => {
  return (
    <header className="header">
      <div data-header-container>
        {" "}
        <div className="logo">
          <Link to="/">LOGO</Link>
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
          <Link to="/domestic/list">국내 여행 메뉴로 이동</Link>
        </li>
        <li>메뉴3</li>
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Community
          {isCommunityOpen && (
            <ul className="community-menu">
              <li>
                <Link to="/freeBoard/list">자유게시판</Link>
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
            <Link to="/#">{loginEmail}</Link>
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
