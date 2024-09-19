package kr.co.iei.product.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.util.PageInfo;

@Mapper
public interface ProductDao {

	int totalCount();

	List selectProductList(PageInfo pi);

}
