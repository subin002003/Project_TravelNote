package kr.co.iei.Domestic.model.dto;

import org.apache.ibatis.type.Alias;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="ItineraryInfo")
public class ItineraryInfoDTO {
	private int itineraryNo;
	private int regionNo;
	private String regionName;
	private String countryName;
	private String itineraryStartDate;
	private String itineraryEndDate;
	private String itineraryTitle;
	
	//오건하 작성 2024-10-07
	//마이페이지에서 내 일정을 가져오기 위한 변수 추가
	private String userNick;
	private String regionImg;
	//공유 일정을 위한 변수 추가
	private String receiveUser;
	private String sendUser;
}
