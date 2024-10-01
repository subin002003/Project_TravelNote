package kr.co.iei.api.controller;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import kr.co.iei.api.model.dto.FlightDTO;


@RestController
@CrossOrigin("*")
@RequestMapping(value="/flightsApi")
public class FlightsApiController {
	
	@GetMapping(value="/getFlights")
	public void getFlights() {
		System.out.println(1);
		String url = "http://openapi.airport.co.kr/service/rest/AirportCodeList/getAirportCodeList";
		String serviceKey = "w%2BYHFXUfIm1ox4RJBBw4OsWb3it3ymoD3Dx%2BzKFemzluHHcgLlVlbgYDiSp5m57samsQD9tXyUXzUjSdkTh5lA%3D%3D";
		String pageNo = "1";
		String numOfRows = "20";
		String resultType = "json";
		List list = new ArrayList<FlightDTO>();
		
		try {
			String result = Jsoup.connect(url)
					.data("serviceKey", serviceKey)
					.data("pageNo", pageNo)
					.data("numOfRows", numOfRows)
					.data("resultType", resultType) // 결과 받을 타입 파라미터 추가
					.ignoreContentType(true)
					.get()
					.text();
			System.out.println(result);
			// 결과로 받은 문자열을 Json 타입으로 변환 (Json Parser 사용) -> 온라인에서 Json Parser 사용하면 결과 볼 수 있는데, 결과 객체의 getFoodKr 객체 안에 item에 정보가 들어 있으므로 하나씩 접근
			JsonObject object = (JsonObject)JsonParser.parseString(result);
			System.out.println(result);
//			JsonObject getFoodKr = object.get("getFoodKr").getAsJsonObject();
//			JsonArray items = getFoodKr.get("item").getAsJsonArray();
//			for (int i = 0; i < items.size(); i++) {
//				JsonObject item = items.get(i).getAsJsonObject();
//				String mainTitle = item.get("MAIN_TITLE").getAsString();
//				String mainImg = item.get("MAIN_IMG_THUMB").getAsString();
//				String address = item.get("ADDR1").getAsString();
//				String tel = item.get("CNTCT_TEL").getAsString();
//				String intro = item.get("ITEMCNTNTS").getAsString();
//				FlightDTO flight = new FlightDTO(mainTitle, mainImg, address, tel, intro);
//			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		/*
		StringBuilder urlBuilder = new StringBuilder("http://openapi.airport.co.kr/service/rest/AirportCodeList/getAirportCodeList");
		urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=서비스키");
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode());
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        System.out.println(sb.toString()); */
	}

}
