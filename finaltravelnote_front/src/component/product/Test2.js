import { Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./product.css";
import Swal from "sweetalert2";
import axios from "axios";

const ProductFrm = (props) => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const productNo = props.productNo;
    const productStatus = props.productStatus;
    const setProductStatus = props.setProductStatus;

    // 상품명, 한 줄 소개 등 다른 상태
    const productName = props.productName;
    const setProductName = props.setProductName;
    const productSubName = props.productSubName;
    const setProductSubName = props.setProductSubName;

    useEffect(() => {
        console.log("Updated productStatus:", productStatus);
    }, [productStatus]);

    // 스위치 상태 변경 처리
    const handleChange = (event) => {
        const newStatus = event.target.checked ? 1 : 2;
        console.log("스위치 상태:", event.target.checked);

        const obj = { productNo: productNo, productStatus: newStatus };
        axios
            .patch(`${backServer}/product`, obj)
            .then((res) => {
                console.log(res);

                // SweetAlert2 알림
                Swal.fire({
                    title: "판매 상태 변경",
                    text: newStatus === 1 ? "상품이 판매 중으로 변경되었습니다." : "상품이 판매 중지로 변경되었습니다.",
                    icon: "success",
                    confirmButtonText: "확인",
                });

                setProductStatus(newStatus); // 상태 변경
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="mt">
            <div className="input-item">
                <label htmlFor="productSubName">판매 여부</label>
                <p>{productStatus === 1 ? "판매 중" : "판매 중지"}</p>
                <Switch
                    checked={productStatus === 1} // productStatus가 1인 경우 체크됨
                    onChange={handleChange} // 상태 변경 함수 호출
                    inputProps={{ "aria-label": "controlled" }}
                />
            </div>

            <div className="input-item">
                <label htmlFor="productName">상품명</label>
                <input
                    type="text"
                    name="productName"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} // onChange 수정
                />
            </div>

            <div className="input-item">
                <label htmlFor="productSubName">상품 한 줄 소개</label>
                <input
                    type="text"
                    name="productSubName"
                    id="productSubName"
                    value={productSubName}
                    onChange={(e) => setProductSubName(e.target.value)} // onChange 수정
                />
            </div>
        </div>
    );
};

export default ProductFrm;
