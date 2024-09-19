import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const ProductView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const productNo = params.productNo;
  const [product, setProduct] = useState({});

  // 날짜 선택
  const [swalShown, setSwalShown] = useState(false);
  const [range, setRange] = useState(null);

  function showSwalWithReactDayPicker() {
    Swal.fire({
      title: "Select a range of dates",
      didOpen: () => setSwalShown(true),
      didClose: () => setSwalShown(false),
    });
  }

  return (
    <section className="section product-view-wrap">
      <div className="product-view-content">
        <div className="product-view-info">
          <div className="product-thumbnail-swiper">
            {/* <Swiper /> */}
            {/* 만들어둔 swiper 컴포넌트 삽입 예정 */}
          </div>
          <div className="product-view-preview">
            {/* 상품 정보 : 상품명, 서브타이틀, 찜갯수, 리뷰 별점 */}
          </div>
        </div>

        <div className="reservation">
          <h3>여행 예약</h3>
          {/* 여행 날짜 선택 */}
          <button onClick={showSwalWithReactDayPicker}>
            여행 날짜를 선택하세요!
          </button>

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
          <div>
            <div className="date-picker">
              {range?.from && format(range.from, "PPP")} 여행 날짜를 선택하세요!{" "}
              {range?.to && format(range.to, "PPP")}
            </div>
          </div>
        </div>
      </div>

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
