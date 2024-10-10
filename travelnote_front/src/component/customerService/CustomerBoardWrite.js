import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CustomerBoardWrite = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [currentDate, setCurrentDate] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setCurrentDate(formattedDate);
  }, []);
  const [faqBoard, setFaqBoard] = useState({
    faqBoardTitle: "",
    faqBoardContent: "",
    faqBoardWriter: userNick,
  });
  const changeFaqBoard = (e) => {
    const name = e.target.name;
    setFaqBoard({ ...faqBoard, [name]: e.target.value });
  };
  const writeFaqBoard = () => {
    axios
      .post(`${backServer}/faqBoard/writeFaqBoard`, faqBoard)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            title: "글 작성 완료",
            icon: "success",
          });
          navigate("/customerService/customerBoard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="write-section">
      <div className="page-small-title">
        <h2>자주묻는 질문 작성하기</h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          writeFaqBoard();
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
                  ></textarea>
                </div>
              </td>
            </tr>
            <tr className="btn-box">
              <td colSpan={4}>
                <button type="submit">작성하기</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default CustomerBoardWrite;
