package kr.co.iei.foreignPlan.model.dto;

import org.springframework.stereotype.Repository;

@Repository
public class ItineraryDTO {
	private int itineraryNo;
	private int userNo;
	private int regionNo;
	private String itineraryStartDate;
	private String itineraryEndDate;
	private String itineraryTitle;	
}
