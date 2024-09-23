import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Swal from "sweetalert2";
import SwiperComponent from "../utils/SwiperComponent";
import axios from "axios";

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({});
  const [productFiles, setProductFiles] = useState([]);

  useEffect(() => {
    axios
      .get(`${backServer}/product/productNo/${productNo}`)
      .then((res) => {
        console.log(res);
        setProduct(res.data);
        // productFileList에서 파일 목록을 설정
        setProductFiles(res.data.productFileList || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [backServer, productNo]);

  // 날짜 선택
  const [range, setRange] = useState({ from: null, to: null });
  const [swalShown, setSwalShown] = useState(false);

  const showSwalWithReactDayPicker = () => {
    setSwalShown(true);
    Swal.fire({
      title: "날짜를 선택하세요!",
      html: "<div id='swal-datepicker'></div>",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      preConfirm: () => {
        if (!range.from || !range.to) {
          Swal.showValidationMessage("날짜를 모두 선택해주세요.");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          `선택된 날짜: 시작 ${range.from?.toLocaleDateString()} - 종료 ${range.to?.toLocaleDateString()}`
        );
      }
      setSwalShown(false); // 모달 종료 시 false로 설정
    });
  };

  return (
    <section className="section product-view-wrap">
      <div className="product-view-content">
        <div className="product-view-info">
          <div className="product-thumbnail-swiper">
            <SwiperComponent
              images={productFiles.map(
                (file) => `${backServer}/${file.filepath}`
              )}
            />{" "}
            {/* Swiper에 이미지 전달 */}
          </div>
          <div className="product-view-preview">
            {/* 상품 정보 : 상품명, 서브타이틀, 찜 갯수, 리뷰 별점 */}
          </div>
        </div>

        <div className="reservation">
          <h3>여행 예약</h3>

          {swalShown &&
            createPortal(
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                style={{ display: "inline-block" }}
              />,
              Swal.getHtmlContainer()
            )}

          <div className="date-picker" onClick={showSwalWithReactDayPicker}>
            {!range?.from && !range?.to ? (
              "여행 날짜를 선택하세요!"
            ) : (
              <>
                {range?.from &&
                  `시작 날짜: ${range.from?.toLocaleDateString()} `}
                {range?.to && `종료 날짜: ${range.to?.toLocaleDateString()}`}
              </>
            )}
          </div>

          <div className="people">인원 3</div>
        </div>
      </div>

      <div className="clear"></div>

      <div className="view-btn-box">
        <Link
          className="btn-primary lg"
          to={`/product/update/${product.productNo}`}
        >
          수정
        </Link>
        <button type="button" className="btn-secondary lg">
          삭제
        </button>
      </div>
    </section>
  );
};

export default ProductView;