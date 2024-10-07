import axios from "axios";
import { Component, useEffect, useState } from "react";

const ForeignRegionInfo = (props) => {
  const { backServer, regionInfo } = props;
  const [regionApiInfo, setRegionApiInfo] = useState({});

  useEffect(() => {
    axios
      .get(`${backServer}/api/regionInfoApi/${regionInfo.countryName}`)
      .then((res) => {
        setRegionApiInfo(res.data);
      })
      .catch(() => {});
  }, [regionInfo]);

  const apitest = () => {
    axios
      .get(`${backServer}/api/regionInfoApi/${regionInfo.countryName}`)
      .then(() => {})
      .catch(() => {});
  };

  return (
    <div className="plan-region-wrap">
      {regionApiInfo ? (
        <div className="plan-region-info-box">
          <div className="contact-title">
            <h2>
              {regionInfo.regionName}의 현지 연락처 정보(
              {regionApiInfo.continentName})
            </h2>
          </div>
          <div
            className="contact-remark"
            dangerouslySetInnerHTML={{ __html: regionApiInfo.contactRemark }}
          ></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ForeignRegionInfo;
