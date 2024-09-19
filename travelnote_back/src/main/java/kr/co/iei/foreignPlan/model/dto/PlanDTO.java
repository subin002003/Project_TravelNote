package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="plan")
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
