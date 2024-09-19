package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreginItinerary")
public class ForeignItineraryDTO {
	private int itineraryNo;
	private int userNo;
	private int regionNo;
	private String itineraryStartDate;
	private String itineraryEndDate;
	private String itineraryTitle;	
}
