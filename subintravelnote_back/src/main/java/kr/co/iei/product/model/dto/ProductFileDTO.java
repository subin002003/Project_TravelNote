package kr.co.iei.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="productFile")
public class ProductFileDTO {
	private int productFileNo;
	private int productNo;
	private String filename;
	private String filepath;
}
