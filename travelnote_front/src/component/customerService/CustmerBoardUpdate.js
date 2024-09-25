import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const CustomerBoardUpdate = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const faqBoardNo = params.faqBoardNo;
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${backServer}/faqBoard/view/${faqBoardNo}`)
      .then((res) => {
        console.log(res);
        setFaqBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setCurrentDate(formattedDate);
  }, []);
  const [faqBoard, setFaqBoard] = useState({});
  const changeFaqBoard = (e) => {
    const name = e.target.name;
    setFaqBoard({ ...faqBoard, [name]: e.target.value });
  };
  const updateBoard = () => {
    axios
      .patch(`${backServer}/faqBoard/${faqBoardNo}`, faqBoard)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "수정 성공",
            icon: "success",
          });
          navigate(`/customerService/customerBoard/view/${faqBoardNo}`);
        } else {
          Swal.fire({
            title: "수정 실패",
            text: "잠시 후 다시 시도해주세요",
            icon: "warning",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="write-section">
      <div className="page-small-title">
        <h2>자주묻는 질문 수정하기</h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateBoard();
        }}
      >
        <table className="faqboard-tbl">
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="faqBoardTitle">제목</label>
              </th>
              <td colSpan={3}>
                <div className="faqboard-input">
                  <input
                    type="text"
                    id="faqBoardTitle"
                    name="faqBoardTitle"
                    value={faqBoard.faqBoardTitle}
                    onChange={changeFaqBoard}
                  ></input>
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="faqBoardWriter">작성자</label>
              </th>
              <td style={{ width: "25%" }}>
                <div className="faqboard-input">
                  <input
                    style={{ textAlign: "center" }}
                    type="text"
                    id="faqBoardWriter"
                    name="faqBoardWriter"
                    value={userNick}
                    disabled
                  ></input>
                </div>
              </td>
              <th style={{ width: "25%" }}>
                <label htmlFor="faqWriteDate">작성일</label>
              </th>
              <td style={{ width: "25%" }}>
                <div className="faqboard-input">{currentDate}</div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="faqBoardContent">내용</label>
              </th>
              <td colSpan={3}>
                <div>
                  <textarea
                    className="faqBoard-content"
                    id="faqBoardContent"
                    name="faqBoardContent"
                    onChange={changeFaqBoard}
                    value={faqBoard.faqBoardContent}
                  ></textarea>
                </div>
              </td>
            </tr>
            <tr className="btn-box">
              <td colSpan={4}>
                <button type="submit">수정하기</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default CustomerBoardUpdate;
