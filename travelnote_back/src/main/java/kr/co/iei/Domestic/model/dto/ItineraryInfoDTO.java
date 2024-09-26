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

}
