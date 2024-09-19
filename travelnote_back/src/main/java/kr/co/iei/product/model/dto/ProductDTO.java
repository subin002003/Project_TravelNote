package kr.co.iei.product.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="product")
public class ProductDTO {
	private int productNo;
	private int userNo;
	private String productName;
	private String productThumb;
	private String productInfo;
	private int productStatus;
	private String enrollDate;
	private List<ProductFileDTO> fileList;
	private int[] delProductFileNo;
}