import { Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./product.css";
import Swal from "sweetalert2";
import axios from "axios";

const ProductFrm = (props) => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const loginEmail = props.loginEmail;
    // 상품고유번호
    const productNo = props.productNo;
    const setProductNo = props.setProductNo;
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
    // 상품 판매 여부
    const productStatus = props.productStatus;
    const setProductStatus = props.setProductStatus;

    // 이미 등록된 상품 수정 시 필요한 데이터
    const productThumb = props.productThumb;
    const setProductThumb = props.setProductThumb;
    const productFileList = props.productFileList;
    const setProductFileList = props.setProductFileList;
    const delProductFileNo = props.delProductFileNo;
    const setDelProductFileNo = props.setDelProductFileNo;

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

    useEffect(() => {
        console.log("Updated productStatus:", productStatus);
    }, [productStatus]);

    // 상품 판매여부 입력
    // const handleChange = () => {
    //   console.log("스위치를 클릭하면 동작");
    //   const productStatus = productStatus === 1 ? 2 : 1;
    //   // DB작업 -> 그 이후에 화면에 반영
    //   const obj = { productNo: productNo, productStatus: productStatus }; // 데이터 변경에 필요한 글번호, 변경할 값
    //   axios
    //     .patch(`${backServer}/product`, obj)
    //     .then((res) => {
    //       console.log(res);
    //       // index번째것을 boardStatus로 바꿔줘
    //       setProductStatus(productStatus); // Switch 값에 따라 상품 상태를 1 또는 2으로 설정
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // };

    console.log("초기 productStatus:", productStatus);

    const handleChange = (event) => {
        console.log("스위치 상태:", event.target.checked); // 여기에서 로그가 찍히는지 확인
        const newStatus = event.target.checked ? 1 : 2;

        Swal.fire({
            title: "판매 상태 변경",
            text: newStatus === 1 ? "상품이 판매 중으로 변경되었습니다." : "상품이 판매 중지로 변경되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
        });

        setProductStatus(newStatus); // 상태 변경
    };

    // const handleChange = (event) => {
    //   const newStatus = event.target.checked ? 1 : 2;

    //   // 확인용 로그 추가
    //   console.log("Switch 상태:", event.target.checked);
    //   console.log("변경된 productStatus:", newStatus);

    //   // SweetAlert로 상태 변경 시 알림 표시
    //   Swal.fire({
    //     title: "판매 상태 변경",
    //     text: newStatus === 1 ? "상품이 판매 중으로 변경되었습니다." : "상품이 판매 중지로 변경되었습니다.",
    //     icon: "success",
    //     confirmButtonText: "확인",
    //   });

    //   setProductStatus(newStatus); // 상태 변경
    // };

    // const handleChange = (event) => {
    //   const newStatus = event.target.checked ? 1 : 2;
    //   setProductStatus(newStatus);
    // };

    // const handleChange = (e) => {
    //   console.log("Switch clicked:", e.target.checked); // 추가된 로그
    //   setProductStatus(e.target.checked ? 1 : 2); // Switch 값에 따라 상품 상태를 1 또는 2으로 설정
    // };
    // console.log("productStatus : ", productStatus);
    // console.log("delProductFileNo : ", delProductFileNo);

    return (
        <div className="mt">
            <div className="product-info-wrap1">
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

                <div className="product-input-wrap">
                    {/* <div>
            <label>여행사</label>
            <span className="productWriter">{loginEmail}</span>
          </div> */}

                    <div className="input-item">
                        <label htmlFor="productSubName">판매 여부</label>
                        <p>{productStatus === 1 ? "판매 중" : "판매 중지"}</p>
                        <Switch
                            checked={productStatus === 1} // productStatus가 1인 경우 체크됨
                            onChange={handleChange} // 상태 변경 함수 호출
                            inputProps={{ "aria-label": "controlled" }}
                        />
                    </div>

                    <div style={{ margin: "31.5px 0" }} className="input-item">
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
                </div>
            </div>

            <div
                className="product-file"
                style={{ width: "90%", margin: "150px auto" }}
            >
                <div className="input-item">
                    <label htmlFor="productFile">
                        첨부파일(상품 대표 이미지 - 여러장 가능)
                    </label>
                    <input
                        type="file"
                        id="productFile"
                        style={{ padding: "5px 10px", height: "40px" }}
                        onChange={addProductFile}
                        multiple
                    />
                </div>

                <div className="product-file-wrap">
                    <label>첨부파일 목록</label>
                    <div className="product-file-list">
                        {productFileList
                            ? productFileList.map((productFile, i) => {
                                const deleteFile = () => {
                                    const newFileList = productFileList.filter((item) => {
                                        return item !== productFile;
                                    });
                                    setProductFileList(newFileList);
                                    setDelProductFileNo([
                                        ...delProductFileNo,
                                        productFile.productFileNo,
                                    ]);
                                };
                                return (
                                    <p key={"oldFile-" + i}>
                                        <span className="filename">{productFile.filename}</span>
                                        <span className="det-file-icon" onClick={deleteFile}>
                                            <i className="fa-solid fa-circle-xmark"></i>
                                        </span>
                                    </p>
                                );
                            })
                            : ""}
                        {showProductFile.map((filename, i) => {
                            const deleteFile = () => {
                                productFile.splice(i, 1);
                                setProductFile([...productFile]);
                                showProductFile.splice(i, 1);
                                setShowProductFile([...showProductFile]);
                            };
                            return (
                                <p key={"newFile-" + i}>
                                    <span className="filename">{filename}</span>
                                    <span className="del-file-icon" onClick={deleteFile}>
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </span>
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mb product-info">
                <div className="input-item">
                    <label htmlFor="productLatitude">위도</label>
                    <input
                        type="text"
                        name="productLatitude"
                        id="productLatitude"
                        value={productLatitude}
                        onChange={setProductLatitude}
                    />
                </div>
                <div className="input-item">
                    <label htmlFor="productLongitude">경도</label>
                    <input
                        type="text"
                        name="productLongitude"
                        id="productLongitude"
                        value={productLongitude}
                        onChange={setProductLongitude}
                    />
                </div>
                <div className="input-item">
                    <label htmlFor="productPrice">상품 가격</label>
                    <input
                        type="number"
                        name="productPrice"
                        id="productPrice"
                        value={productPrice}
                        onChange={setProductPrice}
                    />
                </div>
            </div>

            <div className="clear"></div>
        </div>
    );
};

export default ProductFrm;
