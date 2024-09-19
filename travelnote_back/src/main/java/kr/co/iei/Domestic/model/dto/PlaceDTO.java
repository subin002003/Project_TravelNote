package kr.co.iei.Domestic.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "place")
public class PlaceDTO {

	private int placeNo;
	private String placeName;
	private String placeAddress;
	private String placeLatitude;
	private String placeLongitude;
	private int regionNo;
	private String placeImg;
}
