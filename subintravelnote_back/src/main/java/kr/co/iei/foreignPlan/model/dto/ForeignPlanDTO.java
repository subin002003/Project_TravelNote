package kr.co.iei.foreignPlan.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreignPlan")
public class ForeignPlanDTO {
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
	private String planName;
	private String planId;
	private List<ForeignPlanChangeSeqDTO> changeSeqList;
	
}
