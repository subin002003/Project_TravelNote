import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useRef } from "react";

const ToastEditor = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const productInfo = props.productInfo;
  const setProductInfo = props.setProductInfo;
  const type = props.type;
  const editorRef = useRef(null);
  const changeValue = () => {
    const editorData = editorRef.current.getInstance().getHTML();
    console.log(editorData); // 확인용 로그
    setProductInfo(editorData);
  };

  const uploadImage = (file, callbackFunc) => {
    // 비동기 요청으로 이미지 파일을 업로드하고, 업로드된 파일의 경로를 결과로 받아옴
    const form = new FormData();
    form.append("image", file);
    axios
      .post(`${backServer}/product/editorImage`, form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
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
  console.log(productInfo);

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {type === 0 || (type === 1 && productInfo !== "") ? (
        <Editor
          ref={editorRef}
          initialValue={productInfo}
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

export default ToastEditor;
