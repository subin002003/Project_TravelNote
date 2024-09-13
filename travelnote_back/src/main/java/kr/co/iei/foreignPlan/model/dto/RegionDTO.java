package kr.co.iei.foreignPlan.model.dto;

import org.springframework.stereotype.Repository;

@Repository
public class RegionDTO {
	private int regionNo;
	private String regionName;
	private String countryName;
	private String timeZone;
	private String currencyCode;
}
