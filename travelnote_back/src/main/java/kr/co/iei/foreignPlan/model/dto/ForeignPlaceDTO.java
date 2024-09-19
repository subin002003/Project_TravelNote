package kr.co.iei.foreignPlan.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="foreignPlace")
public class ForeignPlaceDTO {
	private int placeNo;
	private String placeName;
	private String placeAddress;
	private String placeLatitude;
	private String placeLongitude;
	private int regionNo;
}
