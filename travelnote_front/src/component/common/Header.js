import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <h1>header</h1>

      {/* 임시 링크 */}
      <ul>
        <li>
          <Link to="/foreign/Main">해외 여행 페이지</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
