import axios from "axios";
import { useEffect, useState } from "react";
import PageNavi from "../utils/PagiNavi";
import { useNavigate } from "react-router-dom";

const PersonalBoardList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [personalBoardList, setPersonalBoardList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/personalBoardList/${reqPage}`)
      .then((res) => {
        setPersonalBoardList(res.data.list);
        setPi(res.data.pi);
      });
  }, []);
  return (
    <div className="personalboard-content">
      <div className="personalboard-list-wrap">
        <div className="mypage-title">
          <h3>1대1문의 내역</h3>
        </div>
        <table>
          <tbody>
            <tr>
              <th style={{ width: "45%" }}>제목</th>
              <th style={{ width: "20%" }}>작성자</th>
              <th style={{ width: "20%" }}>작성일</th>
              <th style={{ width: "15%" }}>답변여부</th>
            </tr>
            {personalBoardList.map((personalBoard, i) => {
              return (
                <PersonalBoardItem
                  key={"personalBoard" + i}
                  personalBoard={personalBoard}
                />
              );
            })}
          </tbody>
        </table>
        <div className="faqboard-page-navi">
          <PageNavi pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </div>
  );
};

const PersonalBoardItem = (props) => {
  const board = props.personalBoard;
  const navigate = useNavigate();
  const navigatePersonalBoardAnswerWrite = () => {
    navigate(
      `/mypage/admin/personalBoardList/writeAnswer/${board.personalBoardNo}`
    );
  };
  return (
    <tr>
      <td style={{ width: "45%" }} onClick={navigatePersonalBoardAnswerWrite}>
        <p className="personalboard-title">{board.personalBoardTitle}</p>
      </td>

      <td style={{ width: "20%" }}>{board.personalBoardWriter}</td>
      <td style={{ width: "20%" }}>{board.personalBoardWriteDate}</td>
      <td style={{ width: "15%" }}>{board.personalBoardStatus}</td>
    </tr>
  );
};

export default PersonalBoardList;
