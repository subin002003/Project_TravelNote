package kr.co.iei.reviewboard.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.reviewboard.model.dao.ReviewBoardDao;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class ReviewBoardService {
	@Autowired
	private ReviewBoardDao reviewBoardDao;
	@Autowired
	private PageUtil pageUtil;
	
	// 전체 게시물 조회
	public Map selectReviewBoardList(int reqPage) {
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 12; // 한 페이지당 게시물 수
		int pageNaviSize = 5; // 페이지네비 길이
		int totalCount = reviewBoardDao.totalCount(); // 전체 게시물 수
		
		// 페이지 정보 생성
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		//게시물 목록 조회
		List list = reviewBoardDao.selectReviewBoardList(pi); // 게시물 목록 조회
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi",pi);
		return map;
	}
	
	// 검색된 게시물 조회
	public Map<String, Object> selectReviewBoardSearchList(int reqPage, String searchTerm, String searchFilter) {
		int numPerPage = 10; // 한 페이지당 게시물 수
		int pageNaviSize = 5; // 페이지 네비 길이
		int totalCount = reviewBoardDao.searchReviewTotalCount(searchTerm, searchFilter); // 검색된 게시물 수

	    // 페이지 정보 생성
	    PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
	    //게시물 목록 조회
	    List list = reviewBoardDao.selectReviewBoardSearchList(pi, searchTerm, searchFilter); // 검색된 게시물 목록 조회
	    
	    Map<String, Object> map = new HashMap<>();
	    map.put("list", list);
	    map.put("pi", pi);
	    return map;
	}
	
}
