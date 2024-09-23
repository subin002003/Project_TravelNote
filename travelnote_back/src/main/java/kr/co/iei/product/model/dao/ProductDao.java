package kr.co.iei.product.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
import kr.co.iei.util.PageInfo;

@Mapper
public interface ProductDao {

	int totalCount();

	List selectProductList(PageInfo pi);

	int insertProduct(ProductDTO product);

	int insertProductFile(ProductFileDTO productFile);

	ProductDTO selectOneProduct(int productNo);

	List<ProductFileDTO> selectOneProductFileList(int productNo);

	ProductFileDTO getProductFile(int productFileNo);

	int deleteProduct(int productNo);

	int updateProduct(ProductDTO product);

	List<ProductFileDTO> selectProductFile(int[] delProductFileNo);

	int deleteProductFile(int[] delProductFileNo);

}
