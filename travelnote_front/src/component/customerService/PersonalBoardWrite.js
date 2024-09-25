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
  const [fileList, setFileList] = useState([]);
  const [delBoardFileNo, setDelBoardFileNo] = useState([]);
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
    const files = e.currentTarget.files;
    const fileArr = new Array(); // 글작성 시 전송할 파일 배열
    const filenameArr = new Array(); //화면에 노출시킬 파일이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setPersonalBoardFile([...personalBoardFile, ...fileArr]);
    setShowPersonalBoardFile([...showPersonalBoardFile, ...filenameArr]);
  };
  const [personalBoard, setPersonalBoard] = useState({
    personalBoardTitle: "",
    personalBoardContent: "",
    personalBoardWriter: userNick,
    personalBoardFile: personalBoardFile,
  });
  const writePersonalBoard = () => {
    const formData = new FormData();

    formData.append("personalBoardTitle", personalBoard.personalBoardTitle);
    formData.append("personalBoardContent", personalBoard.personalBoardContent);
    formData.append("personalBoardWriter", personalBoard.personalBoardWriter);

    personalBoardFile.forEach((file) => {
      formData.append("personalBoardFileList", file);
    });

    axios
      .post(`${backServer}/personalBoard/write`, formData, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="write-section">
      <div className="page-title">1대1문의 작성하기</div>
      <form
        encType="multipart/form-data"
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
                    id="personaBoardTitle"
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
                  {fileList
                    ? fileList.map((boardFile, i) => {
                        const deleteFile = () => {
                          const newFileList = fileList.filter((item) => {
                            return item !== boardFile;
                          });
                          setFileList(newFileList);
                          setDelBoardFileNo([
                            ...delBoardFileNo,
                            boardFile.boardFileNo,
                          ]);
                        };
                        return (
                          <p key={"oldFile-" + i}>
                            <span className="filename">
                              {boardFile.filename}
                            </span>
                            <span
                              className="material-icons del-file-icon"
                              onClick={deleteFile}
                            >
                              delete
                            </span>
                          </p>
                        );
                      })
                    : ""}
                  {showPersonalBoardFile.map((filename, i) => {
                    const deleteFile = () => {
                      personalBoardFile.splice(i, 1);
                      setPersonalBoardFile([...personalBoardFile]);
                      showPersonalBoardFile.splice(i, 1);
                      setShowPersonalBoardFile([...showPersonalBoardFile]);
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
