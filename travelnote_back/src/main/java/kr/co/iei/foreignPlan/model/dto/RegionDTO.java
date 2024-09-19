package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="region")
public class RegionDTO {
	private int regionNo;
	private String regionName;
	private String countryName;
	private String timeZone;
	private String currencyCode;
}
