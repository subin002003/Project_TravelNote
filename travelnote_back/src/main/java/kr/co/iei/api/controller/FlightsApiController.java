package kr.co.iei.api.controller;

import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import kr.co.iei.api.model.dto.FlightDTO;


@RestController
@CrossOrigin("*")
@RequestMapping(value="/flightsApi")
public class FlightsApiController {
	
	@GetMapping(value="/getFlights")
	public void getFlights() {
		String serviceKey = "w+YHFXUfIm1ox4RJBBw4OsWb3it3ymoD3Dx+zKFemzluHHcgLlVlbgYDiSp5m57samsQD9tXyUXzUjSdkTh5lA==";
		String page = "1";
		String perPage = "20";
		String resultType = "json";
		String url = "http://api.odcloud.kr/api/15003087/v1/uddi:705bfaaa-1fee-4b3c-8e89-cbbf0fd57748";
		List list = new ArrayList<FlightDTO>();
		
	    try {
	    	String result = Jsoup.connect(url)
					.data("serviceKey", serviceKey)
					.data("perPage", perPage)
					.data("page", page)
					.data("resultType", resultType) // 결과 받을 타입 파라미터
					.ignoreContentType(true)
					.get()
					.text();
	    	System.out.println(result);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

}
