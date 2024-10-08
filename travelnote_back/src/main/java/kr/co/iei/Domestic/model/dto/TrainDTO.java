package kr.co.iei.Domestic.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="Train")
public class TrainDTO {
	  private int trainNo;
	    private String trainName;
	    private String departure;
	    private String arrival;
}
