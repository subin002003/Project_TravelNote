import { Link } from "react-router-dom";
import "./default.css";
import { useState } from "react";
const Header = () => {
  return (
    <header className="header">
      <div>
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
          <Link to="/foreign/list">해외 여행 메뉴로 이동</Link>
        </li>
        <li>메뉴2</li>
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
  return (
    <ul className="user-menu">
      <li>로그인</li>
      <li>회원가입</li>
    </ul>
  );
};
export default Header;
