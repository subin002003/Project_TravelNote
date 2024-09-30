import { useState } from "react";

const BoardFrm = (props) => {
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const boardCategory = props.boardCategory;
  const setBoardCategory = props.setBoardCategory;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;
  //수정인 경우에 추가로 전송되는 데이터
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delBoardFileNo = props.delBoardFileNo;
  const setDelBoardFileNo = props.setDelBoardFileNo;
  //첨부파일 화면에 띄울 state
  const [showBoardFile, setShowBoardFile] = useState([]);
  //첨부파일 추가시 동작할 함수
  const addBoardFile = (e) => {
    const files = e.currentTarget.files;
    const fileArr = new Array(); //글 작성 시 전송할 파일 배열
    const filenameArr = new Array(); //화면에 노출시킬 파일이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setBoardFile([...boardFile, ...fileArr]);
    setShowBoardFile([...showBoardFile, ...filenameArr]);
  };
  return (
    <div>
      <div>
        <table className="boardList-table-no-border">
          <tbody>
            <tr>
              <th>
                <label htmlFor="boardTitle">제목</label>
              </th>
              <td>
                <input
                  type="text"
                  id="boardTitle"
                  name="boardTitle"
                  value={boardTitle}
                  onChange={setBoardTitle}
                  style={{
                    height: "30px",
                    width: "1400px",
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid black",
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="boardCategory">카테고리</label>
              </th>
              <td>
                <input
                  type="text"
                  id="boardCategory"
                  name="boardCategory"
                  value={boardCategory}
                  onChange={setBoardCategory}
                  style={{
                    height: "30px",
                    width: "100px",
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid black",
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="boardFile">첨부파일</label>
              </th>
              <td>
                <input
                  type="file"
                  id="boardFile"
                  onChange={addBoardFile}
                  multiple
                ></input>
              </td>
            </tr>
            <tr>
              <th>첨부파일 목록</th>
              <td>
                <div>
                  {fileList
                    ? fileList.map((boardFile, i) => {
                        const deleteFile = () => {
                          const newFileList = fileList.filter((item) => {
                            return item !== boardFile;
                          });
                          setFileList(newFileList); //화면에 반영
                          //Controller로 전송하기 위해서 배열에 추가
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
                  {showBoardFile.map((filename, i) => {
                    const deleteFile = () => {
                      boardFile.splice(i, 1);
                      setBoardFile([...boardFile]);
                      showBoardFile.splice(i, 1);
                      setShowBoardFile([...showBoardFile]);
                    };
                    return (
                      <p key={"newFile-" + i}>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardFrm;
