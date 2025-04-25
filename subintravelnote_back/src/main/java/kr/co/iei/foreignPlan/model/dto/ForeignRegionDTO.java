package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreignRegion")
public class ForeignRegionDTO {
	private int regionNo;
	private String regionName;
	private String countryName;
	private String regionImg;
	private String timeZone;
	private String currencyCode;
	private String regionLatitude;
	private String regionLongitude;
}
