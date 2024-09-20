import { useRef, useState } from "react";

const ProductFrm = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 상품명
  const productName = props.productName;
  const setProductName = props.setProductName;
  // 상품 한 줄 소개
  const productSubName = props.productSubName;
  const setProductSubName = props.setProductSubName;
  // 썸네일
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  // 상품 가격
  const productPrice = props.productPrice;
  const setProductPrice = props.setProductPrice;
  // 위도
  const productLatitude = props.productLatitude;
  const setProductLatitude = props.setProductLatitude;
  // 경도
  const productLongitude = props.productLongitude;
  const setProductLongitude = props.setProductLongitude;
  // 첨부파일
  const productFile = props.productFile;
  const setProductFile = props.setProductFile;
  // 이미 등록된 상품 수정 시 필요한 데이터
  const productThumb = props.productThumb;
  const setProductThumb = props.setProductThumb;
  const productStatus = props.productStatus;
  const setProductStatus = props.setProductStatus;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delProductFileNo = props.delProductFileNo;
  const setDelBoardFileNo = props.setDelBoardFileNo;

  // ref로 썸네일 이미지 클릭 시 숨겨놓은 파일첨부 input과 연결
  const thumbnailRef = useRef(null);
  // 썸네일 미리보기용 state(데이터 전송x)
  const [productImg, setProductImg] = useState(null);

  // 썸네일 이미지 첨부파일이 변경되면 동작할 함수
  const changeThumbnail = (e) => {
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] !== 0) {
      setThumbnail(files[0]);
      // 화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setProductImg(reader.result);
      };
    } else {
      setThumbnail(null);
      setProductImg(null);
    }
  };

  // 첨부파일 화면에 띄울 state
  const [showProductFile, setShowProductFile] = useState([]);
  // 첨부파일 추가시 동작할 함수
  const addProductFile = (e) => {
    const files = e.currentTarget.files;
    const fileArr = new Array(); // 상품 등록시 전송할 파일 배열
    const filenameArr = new Array(); // 화면에 노출시킬 파일이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setProductFile([...productFile, ...fileArr]);
    setShowProductFile([...showProductFile, ...filenameArr]);
  };
  console.log(productFile);
  console.log(showProductFile);

  return (
    <div>
      <div className="product-thumb-wrap">
        {productImg ? (
          <img
            src={productImg}
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        ) : productThumb ? (
          <img
            src={`${backServer}/product/thumb/${productThumb}`}
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        ) : (
          <img
            src="/image/default_img.png"
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        )}
        <input
          style={{ display: "none" }}
          ref={thumbnailRef}
          type="file"
          accept="image/*"
          onChange={changeThumbnail}
        />
      </div>

      <div className="input-wrap">
        <div className="input-item">
          <label htmlFor="productName">상품명</label>
          <input
            type="text"
            name="productName"
            id="productName"
            value={productName}
            onChange={setProductName}
          />
        </div>

        <div className="input-item">
          <label htmlFor="productSubName">상품 한 줄 소개</label>
          <input
            type="text"
            name="productSubName"
            id="productSubName"
            value={productSubName}
            onChange={setProductSubName}
          />
        </div>

        <div className="input-item">
          <label htmlFor="productSubName">판매 여부</label>
          <input
            type="text"
            name="productSubName"
            id="productSubName"
            value={productSubName}
            onChange={setProductSubName}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFrm;
