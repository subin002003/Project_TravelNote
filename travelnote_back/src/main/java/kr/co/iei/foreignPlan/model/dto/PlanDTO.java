package kr.co.iei.foreignPlan.model.dto;

import org.springframework.stereotype.Repository;

@Repository
public class PlanDTO {
	private int planNo;
	private int itineraryNo;
	private int planDay;
	private String planDate;
	private int planSeq;
	private String planAddress;
	private String planLatitude;
	private String planLongitude;
	private String planTime;
	private String planMemo;
	private String planImage;
	private int planType;
}
