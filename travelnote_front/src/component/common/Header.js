import { Link } from "react-router-dom";
import "./default.css";
const Header = () => {
  return (
    <header className="header">
      <div header-container>
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
  return (
    <nav className="nav">
      <ul>
        <li>메뉴1</li>
        <li>메뉴2</li>
        <li>메뉴3</li>
        <li>메뉴4</li>
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
