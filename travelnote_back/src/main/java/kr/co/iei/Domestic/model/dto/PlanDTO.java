package kr.co.iei.Domestic.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlanDTO {
	
	private int planNo;
	private int itineraryNo;
	private String planDay;
	private String planDate;
	private	int planSeq;
	private String planAddress;
	private String planLatitude;
	private String planLongitude;
	private String planTime;
	private String planMemo;
	private String planImage;
	private String planType;
}
