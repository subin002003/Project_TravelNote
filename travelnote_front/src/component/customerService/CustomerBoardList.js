import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userTypeState } from "../utils/RecoilData";

const CustomerBoardList = () => {
  const [userType, setUserType] = useRecoilState(userTypeState);
  return (
    <div className="main-content">
      <div className="faqboard-wrap content-wrap">
        <div className="mypage-title">
          <h3>자주 묻는 질문</h3>
        </div>
        <div className="write-btn">
          {userType === 3 ? (
            <Link to="/customerService/customerBoardWrite">
              <button>작성하기</button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="personalboard-wrap content-wrap">
        <div className="mypage-title">
          <h3>1대1 문의</h3>
        </div>
      </div>
    </div>
  );
};
export default CustomerBoardList;
