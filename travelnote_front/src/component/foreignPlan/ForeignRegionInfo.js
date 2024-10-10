const ForeignRegionInfo = (props) => {
  const { regionInfo, regionApiInfo, exchangeRate } = props;

  return (
    <div className="plan-region-wrap">
      {exchangeRate > 0 ? (
        <div className="plan-region-info-box">
          <h2 className="currency-title">환율 정보</h2>
          {exchangeRate ? (
            <h3>
              1 {regionInfo.currencyCode} ={" "}
              {Math.round(exchangeRate * 100) / 100} KRW
            </h3>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <div className="plan-region-info-box">
        <div className="contact-title">
          <h2>
            {regionApiInfo.continentName
              ? regionInfo.countryName +
                "의 현지 연락처 정보 (" +
                regionApiInfo.continentName +
                ")"
              : "현지 연락처 정보를 불러올 수 없습니다."}
          </h2>
        </div>
        <div
          className="contact-remark"
          dangerouslySetInnerHTML={{ __html: regionApiInfo.contactRemark }}
        ></div>
      </div>
    </div>
  );
};

export default ForeignRegionInfo;
