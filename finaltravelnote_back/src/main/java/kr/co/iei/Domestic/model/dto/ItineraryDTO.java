package kr.co.iei.Domestic.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "itinerary")
public class ItineraryDTO {

	private int itineraryNo;
	private String userEmail;// userNo대신 이메일로 받아옴
	private int regionNo;
	private String itineraryStartDate;
	private String itineraryEndDate;
	private String itineraryTitle;
}
