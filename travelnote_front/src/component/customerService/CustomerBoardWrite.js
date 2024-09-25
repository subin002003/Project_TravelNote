const CustomerBoardWrite = () => {
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
            <th>
              <label htmlFor="faqBoardWriter">작성자</label>
            </th>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerBoardWrite;
