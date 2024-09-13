package kr.co.iei.foreignPlan.model.dto;

import org.springframework.stereotype.Repository;

@Repository
public class PlaceDTO {
	private int placeNo;
	private String placeName;
	private String placeAddress;
	private String placeLatitude;
	private String placeLongitude;
	private int regionNo;
}
