package kr.co.iei.faqboard.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.faqboard.model.dao.FaqBoardDao;
import kr.co.iei.faqboard.model.dto.FaqBoardDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class FaqBoardService {
	@Autowired
	private FaqBoardDao faqBoardDao;
	@Autowired
	private PageUtil pageUtil;
	
	@Transactional
	public int writeFaqBoard(FaqBoardDTO faqBoard) {
		int result = faqBoardDao.writeFaqBoard(faqBoard);
		return result;
	}

	public Map selectBoardList(int reqPage) {
		//게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 5; //한 페이지당 게시물 수 
		int pageNaviSize = 5;
		int totalCount = faqBoardDao.totalCount();
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = faqBoardDao.selectBoardList(pi);
	
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi",pi);
		return map;
	}

	public FaqBoardDTO view(int faqBoardNo) {
		FaqBoardDTO faqBoard = faqBoardDao.view(faqBoardNo);
		return faqBoard;
	}
	
	@Transactional
	public int deleteFaqBoard(int faqBoardNo) {
		int result = faqBoardDao.deleteFaqBoard(faqBoardNo);
		return result;
	}
	
	@Transactional
	public int updateFaqBoard(FaqBoardDTO faqBoard) {
		int result = faqBoardDao.updateFaqBoard(faqBoard);
		return result;
	}
	
}
