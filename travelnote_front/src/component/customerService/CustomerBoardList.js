import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  loginEmailState,
  userNickState,
  userTypeState,
} from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import PageNavi from "../utils/PagiNavi";

const CustomerBoardList = () => {
  const [userType, setUserType] = useRecoilState(userTypeState);
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [pi, setPi] = useState({});
  const [personalBoardPi, setPersonalBoardPi] = useState({});
  const [faqBoardList, setFaqBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [personalBoardReqPage, setPerosnalBoardReqPage] = useState(1);
  const [personalBoardList, setPersonaBoardList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${backServer}/faqBoard/list/${reqPage}`)
      .then((res) => {
        console.log(res);
        setFaqBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${backServer}/personalBoard/list${personalBoardReqPage}`, userNick)
      .then((res) => {
        console.log(res);
        setPersonaBoardList(res.data.list);
        setPersonalBoardPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, personalBoardReqPage]);

  const navigatePersonalBoardWrite = () => {
    navigate("/customerService/personalBoardWrite");
  };
  return (
    <div className="customer-content">
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
        <div className="faqboard-list">
          <table>
            <tbody>
              <tr>
                <th style={{ width: "60%" }}>제목</th>
                <th style={{ width: "15%" }}>작성자</th>
                <th style={{ width: "25%" }}>작성일</th>
              </tr>
              {faqBoardList.map((faqBoard, i) => {
                return (
                  <FaqBoardItem key={"faqBoard" + i} faqBoard={faqBoard} />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="faqboard-page-navi">
          <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
      <div className="personalboard-wrap content-wrap">
        <div className="mypage-title">
          <h3>1대1 문의</h3>
        </div>
        <div className="personalboard-section">
          <div className="personalboard-write-btn">
            <button onClick={navigatePersonalBoardWrite}>
              1대1 문의 작성하기
            </button>
          </div>
          <div className="personalboard-list">
            <table>
              <tbody>
                <tr style={{ height: "50px" }}>
                  <th style={{ width: "55%" }}>제목</th>
                  <th style={{ width: "20%" }}>작성일</th>
                  <th style={{ width: "25%" }}>답변여부</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqBoardItem = (props) => {
  const faqBoard = props.faqBoard;
  const navigate = useNavigate();
  const navigateView = () => {
    navigate(`/customerService/customerBoard/view/${faqBoard.faqBoardNo}`);
  };
  return (
    <tr>
      <td>
        <p className="view-title" onClick={navigateView}>
          {faqBoard.faqBoardTitle}
        </p>
      </td>
      <td>{faqBoard.faqBoardWriter}</td>
      <td>{faqBoard.faqWriteDate}</td>
    </tr>
  );
};
export default CustomerBoardList;
