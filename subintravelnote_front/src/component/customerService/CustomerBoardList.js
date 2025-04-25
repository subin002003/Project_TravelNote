import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
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
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${backServer}/faqBoard/list/${reqPage}`)
      .then((res) => {
        setFaqBoardList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  useEffect(() => {
    const fetchUserNick = async () => {
      const token = localStorage.getItem("refreshToken");
      try {
        const response = await axios.get(`${backServer}/user/getNick`, {
          headers: { Authorization: token },
        }); // 백엔드에서 userNick 정보를 가져오는 API
        setUserNick(response.data); // 백엔드에서 받아온 userNick을 설정
      } catch (err) {
        console.log("Error fetching userNick:", err);
      }
    };

    // userNick이 없으면 백엔드에서 가져오고, 있으면 바로 요청
    if (!userNick) {
      fetchUserNick();
    } else {
      axios
        .get(`${backServer}/personalBoard/list/${personalBoardReqPage}`, {
          params: { userNick },
        })
        .then((res) => {
          setPersonaBoardList(res.data.list);
          setPersonalBoardPi(res.data.pi);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [personalBoardReqPage, userNick, setUserNick]);

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
        {isLogin ? (
          <>
            <div className="personalboard-section">
              <div className="personalboard-list">
                <table>
                  <tbody>
                    <tr style={{ height: "50px" }}>
                      <th style={{ width: "50%" }}>제목</th>
                      <th style={{ width: "20%" }}>작성일</th>
                      <th style={{ width: "30%" }}>답변여부</th>
                    </tr>
                    {personalBoardList.length > 0 ? (
                      personalBoardList.map((personalBoard, i) => {
                        return (
                          <PersonalBoardItem
                            key={"personalBoard" + i}
                            personalBoard={personalBoard}
                          />
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3">1대1 문의 기록이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="faqboard-page-navi">
                  <PageNavi
                    pi={personalBoardPi}
                    reqPage={personalBoardReqPage}
                    setReqPage={setPerosnalBoardReqPage}
                  />
                </div>

                <button
                  style={{ marginTop: "10px" }}
                  onClick={navigatePersonalBoardWrite}
                >
                  1대1 문의 작성하기
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", lineHeight: "500px" }}>
              <p>1대1문의는 로그인 후 작성할 수 있습니다.</p>
            </div>
          </>
        )}
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

const PersonalBoardItem = (props) => {
  const personalBoard = props.personalBoard;
  const navigate = useNavigate();

  const navigateView = () => {
    navigate(
      `/customerService/personalBoard/view/${personalBoard.personalBoardNo}`
    );
  };

  return (
    <tr>
      <td>
        <p className="view-title" onClick={navigateView}>
          {personalBoard.personalBoardTitle}
        </p>
      </td>
      <td>{personalBoard.personalBoardWriteDate}</td>
      <td>{personalBoard.personalBoardStatus}</td>
    </tr>
  );
};
