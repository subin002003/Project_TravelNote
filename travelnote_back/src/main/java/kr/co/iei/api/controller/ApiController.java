package kr.co.iei.api.controller;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import kr.co.iei.api.model.dto.RegionInfoDTO;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/api")
public class ApiController {
	
	@GetMapping(value="/regionInfoApi/{countryName}")
	public ResponseEntity<RegionInfoDTO> regionInfoApi(@PathVariable String countryName) {
		if (countryName.equals("미국")) {
			countryName = "미합중국";
		}
		String url = "http://apis.data.go.kr/1262000/LocalContactService2/getLocalContactList2";
		String serviceKey = "w+YHFXUfIm1ox4RJBBw4OsWb3it3ymoD3Dx+zKFemzluHHcgLlVlbgYDiSp5m57samsQD9tXyUXzUjSdkTh5lA==";
		String returnType = "json";
		String numOfRows = "10";
		String pageNo = "1";
		RegionInfoDTO region = new RegionInfoDTO();
		try {
			String result = Jsoup.connect(url)
					.data("serviceKey", serviceKey)
					.data("returnType", returnType)
					.data("numOfRows", numOfRows)
					.data("cond[country_nm::EQ]", countryName)
					.data("pageNo", pageNo)
					.ignoreContentType(true)
					.get()
					.text();
			JsonObject object = (JsonObject)JsonParser.parseString(result);
			JsonArray data = object.get("data").getAsJsonArray();
			JsonObject item = data.get(0).getAsJsonObject();
			String contactRemark = item.get("contact_remark").getAsString();
			String continentName = item.get("continent_nm").getAsString();
			String wrtDate = item.get("wrt_dt").getAsString();
			region.setContactRemark(contactRemark);
			region.setContinentName(continentName);
			region.setCountryName(countryName);
			region.setWrtDate(wrtDate);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(region);
	}
}
