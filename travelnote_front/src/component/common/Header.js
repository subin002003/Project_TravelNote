import { Link } from "react-router-dom";
import "./default.css";

const Header = () => {
  return (
    <>
      <h1>header</h1>

      {/* 임시 링크 */}
      <ul>
        <li>
          <Link to="/foreign/list">해외 여행 메뉴로 이동</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
