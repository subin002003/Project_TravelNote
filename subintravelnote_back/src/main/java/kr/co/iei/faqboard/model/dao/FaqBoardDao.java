package kr.co.iei.faqboard.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.faqboard.model.dto.FaqBoardDTO;
import kr.co.iei.util.PageInfo;

@Mapper
public interface FaqBoardDao {

	int writeFaqBoard(FaqBoardDTO faqBoard);

	int totalCount();

	List selectBoardList(PageInfo pi);

	FaqBoardDTO view(int faqBoardNo);

	int deleteFaqBoard(int faqBoardNo);

	int updateFaqBoard(FaqBoardDTO faqBoard);

}
