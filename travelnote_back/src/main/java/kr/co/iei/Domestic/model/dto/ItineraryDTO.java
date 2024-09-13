package kr.co.iei.Domestic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ItineraryDTO {

	private int itineraryNo;
	private int userNo;
	private int regionNo;
	private String itineraryStartDate;
	private String itineraryEndDate;
	private String itineraryTitle;
}
