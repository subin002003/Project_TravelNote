import { useRecoilState } from "recoil";
import { userNickState } from "../utils/RecoilData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PersonalBoardWrite = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [personalBoardFile, setPersonalBoardFile] = useState([]);
  const [showPersonalBoardFile, setShowPersonalBoardFile] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setCurrentDate(formattedDate);
  }, []);

  const changePersonalBoard = (e) => {
    const name = e.target.name;
    setPersonalBoard({ ...personalBoard, [name]: e.target.value });
  };

  const addPersonalBoardFile = (e) => {
    const files = Array.from(e.currentTarget.files); // files를 배열로 변환
    const fileArr = [];
    const filenameArr = [];
    files.forEach((file) => {
      fileArr.push(file);
      filenameArr.push(file.name);
    });
    setPersonalBoardFile((prevFiles) => [...prevFiles, ...fileArr]);
    setShowPersonalBoardFile((prevFilenames) => [
      ...prevFilenames,
      ...filenameArr,
    ]);
  };

  const [personalBoard, setPersonalBoard] = useState({
    personalBoardTitle: "",
    personalBoardContent: "",
    personalBoardWriter: userNick,
  });

  const writePersonalBoard = () => {
    const formData = new FormData();
    formData.append("personalBoardTitle", personalBoard.personalBoardTitle);
    formData.append("personalBoardContent", personalBoard.personalBoardContent);
    formData.append("personalBoardWriter", personalBoard.personalBoardWriter);

    for (let i = 0; i < personalBoardFile.length; i++) {
      formData.append("personalBoardFileList", personalBoardFile[i]);
    }

    console.log(personalBoardFile);
    console.log(personalBoard.personalBoardTitle);
    console.log(personalBoard.personalBoardContent);
    axios
      .post(`${backServer}/personalBoard`, formData, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/personalBoard"); // 게시글 작성 후 게시판으로 이동
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="write-section">
      <div className="page-title">1대1문의 작성하기</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          writePersonalBoard();
        }}
      >
        <table className="personalboard-tbl">
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="personalBoardTitle">제목</label>
              </th>
              <td colSpan={3}>
                <div className="personalBoard-input">
                  <input
                    type="text"
                    id="personalBoardTitle"
                    name="personalBoardTitle"
                    onChange={changePersonalBoard}
                  ></input>
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "25%" }}>
                <label htmlFor="personalBoardWriter">작성자</label>
              </th>
              <td style={{ width: "25%" }}>
                <div className="personalBoard-input">
                  <input
                    style={{ textAlign: "center" }}
                    type="text"
                    id="personalBoardWriter"
                    name="personalBoardWriter"
                    value={userNick}
                    disabled
                  ></input>
                </div>
              </td>
              <th style={{ width: "25%" }}>
                <label htmlFor="personalBoardWriteDate">작성일</label>
              </th>
              <td style={{ width: "25%" }}>
                <div className="personalBoard-input">{currentDate}</div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="personalBoardFile">첨부파일</label>
              </th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <label htmlFor="personalBoardFile" className="file-btn">
                  첨부파일
                </label>
                <input
                  type="file"
                  id="personalBoardFile"
                  multiple
                  onChange={addPersonalBoardFile}
                  style={{ display: "none" }}
                ></input>
              </td>
            </tr>
            <tr>
              <th style={{ height: "48px" }}>첨부파일목록</th>
              <td colSpan={3} style={{ textAlign: "center" }}>
                <div className="board-file-wrap">
                  {showPersonalBoardFile.map((filename, i) => {
                    const deleteFile = () => {
                      const updatedFiles = [...personalBoardFile];
                      updatedFiles.splice(i, 1);
                      setPersonalBoardFile(updatedFiles);

                      const updatedFilenames = [...showPersonalBoardFile];
                      updatedFilenames.splice(i, 1);
                      setShowPersonalBoardFile(updatedFilenames);
                    };
                    return (
                      <p key={"newFile" + i}>
                        <span className="filename">{filename}</span>
                        <span
                          className="material-icons del-file-icon"
                          onClick={deleteFile}
                        >
                          delete
                        </span>
                      </p>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="personalBoardContent">내용</label>
              </th>
              <td colSpan={3}>
                <div>
                  <textarea
                    className="personalBoard-content"
                    id="personalBoardContent"
                    name="personalBoardContent"
                    onChange={changePersonalBoard}
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

export default PersonalBoardWrite;
