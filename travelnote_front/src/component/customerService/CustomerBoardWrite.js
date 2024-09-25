import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";

const CustomerBoardWrite = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  return (
    <div className="write-section">
      <div className="page-small-title">
        <h2>공지사항 작성하기</h2>
      </div>
      <table className="faqboard-tbl">
        <tbody>
          <tr>
            <th style={{ width: "25%" }}>
              <label htmlFor="faqBoardTitle">제목</label>
            </th>
            <td>
              <div className="faqboard-input">
                <input
                  type="text"
                  id="faqBoardTitle"
                  name="faqBoardTitle"
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
              <div className="faqboard-input">
                <input
                  style={{ textAlign: "center" }}
                  type="text"
                  id="faqWriteDate"
                  name="faqWriteDate"
                  disabled
                ></input>
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ width: "25%" }}>
              <label htmlFor="faqBoardContent">내용</label>
            </th>
            <td colSpan={3}>
              <div>
                <textarea className="faqBoard-content"></textarea>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerBoardWrite;
