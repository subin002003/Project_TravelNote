package kr.co.iei.reviewboard.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.util.PageInfo;

@Mapper
public interface ReviewBoardDao {

	int totalCount();

	List selectReviewBoardList(PageInfo pi);

	int searchReviewTotalCount(@Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);

	List selectReviewBoardSearchList(@Param("pi") PageInfo pi, @Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);	
	

}
