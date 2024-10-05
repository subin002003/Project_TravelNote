import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useRef } from "react";

const ReviewBoardToastEditor = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const reviewBoardContent = props.reviewBoardContent;
  const setReviewBoardContent = props.setReviewBoardContent;
  const type = props.type;
  const editorRef = useRef(null);
  const changeValue = () => {
    const editorData = editorRef.current.getInstance().getHTML();
    setReviewBoardContent(editorData);
  };
  const uploadImage = (file, callbackFunc) => {
    //비동기요청으로 이미지파일을 업로드하고, 업로드된 파일의 경로를 결과로 받아옴
    const form = new FormData();
    form.append("image", file);
    axios
      .post(`${backServer}/reviewBoard/editorImage`, form, {
        headers: {
          contentType: ".multipart/form-data",
          prcessData: false,
        },
      })
      .then((res) => {
        console.log(res);
        callbackFunc(`${backServer}${res.data}`, "이미지");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(reviewBoardContent);
  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {type === 0 || (type === 1 && reviewBoardContent !== "") ? (
        <Editor
          ref={editorRef}
          initialValue={reviewBoardContent}
          initialEditType="wysiwyg"
          language="ko-KR"
          height="600px"
          onChange={changeValue}
          hooks={{
            addImageBlobHook: uploadImage,
          }}
        ></Editor>
      ) : (
        ""
      )}
    </div>
  );
};
export default ReviewBoardToastEditor;
