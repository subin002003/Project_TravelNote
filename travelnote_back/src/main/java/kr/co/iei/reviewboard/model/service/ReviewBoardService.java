package kr.co.iei.reviewboard.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.board.model.dto.BoardCommentDTO;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.reviewboard.model.dao.ReviewBoardDao;
import kr.co.iei.reviewboard.model.dto.ReviewBoardCommentDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardFileDTO;
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
	
	// 한 게시물 조회
	public ReviewBoardDTO selectOneReviewBoard(int reviewBoardNo) {
		ReviewBoardDTO reviewBoard = reviewBoardDao.selectOneReviewBoard(reviewBoardNo);
		List<ReviewBoardFileDTO> fileList = reviewBoardDao.selectOneReviewBoardFileList(reviewBoardNo);
		reviewBoard.setFileList(fileList);
		return reviewBoard;
	}

	// 조회수 
	@Transactional
	public void incrementViewCount(int reviewBoardNo) {
		reviewBoardDao.updateViewCount(reviewBoardNo);
    }

	// 아이디로 게시물 조회
	public ReviewBoardDTO getReviewBoardById(int reviewBoardNo) {
		return reviewBoardDao.selectReviewBoardById(reviewBoardNo);
	}
	
	// 게시물 등록
	@Transactional
	public int insertReviewBoard(ReviewBoardDTO reviewBoard, List<ReviewBoardFileDTO> reviewBoardFileList) {
		int result = reviewBoardDao.insertReviewBoard(reviewBoard);
		
		for(ReviewBoardFileDTO reviewBoardFile : reviewBoardFileList) {
			reviewBoardFile.setReviewBoardNo(reviewBoard.getReviewBoardNo());
			result += reviewBoardDao.insertReviewBoardFile(reviewBoardFile);
		}
		return result;
	}
	
	// 파일 조회
	public ReviewBoardFileDTO getReviewBoardFile(int reviewBoardFileNo) {
		ReviewBoardFileDTO reviewBoard = reviewBoardDao.getReviewBoardFile(reviewBoardFileNo);
		return reviewBoard;
	}

	// 게시물 삭제
	@Transactional
	public List<ReviewBoardFileDTO> deleteReviewBoard(int reviewBoardNo) {
		List<ReviewBoardFileDTO> fileList = reviewBoardDao.selectOneReviewBoardFileList(reviewBoardNo);
		int result = reviewBoardDao.deleteReviewBoard(reviewBoardNo);
		if(result >0) {
			return fileList;
		}else {
			return null;
		}
	}
	
	// 게시물 수정
	@Transactional
	public List<ReviewBoardFileDTO> updateReviewBoard(ReviewBoardDTO reviewBoard, List<ReviewBoardFileDTO> reviewBoardFileList) {
		int result = reviewBoardDao.updateReviewBoard(reviewBoard);
		if(result > 0) {
			//삭제한 파일이 있으면  조회 후 삭제 
			List<ReviewBoardFileDTO> delFileList = new ArrayList<ReviewBoardFileDTO>();
			if(reviewBoard.getDelReviewBoardFileNo() != null) {
				delFileList = reviewBoardDao.selectReviewBoardFile(reviewBoard.getDelReviewBoardFileNo());
				result += reviewBoardDao.deleteReviewBoardFile(reviewBoard.getDelReviewBoardFileNo());
			}
			//새첨부파일이 있으면 새 첨부파일을 insert
			for(ReviewBoardFileDTO reviewBoardFile : reviewBoardFileList) {
				result += reviewBoardDao.insertReviewBoardFile(reviewBoardFile);
			}
			int updateTotal = reviewBoard.getDelReviewBoardFileNo() == null
							? 1 + reviewBoardFileList.size() 
		
							: 1 + reviewBoardFileList.size() + reviewBoard.getDelReviewBoardFileNo().length;
			if(result == updateTotal) {
				return delFileList;
						
			}
		}
		return null;
	}

	// 좋아요 추가
	@Transactional
	public boolean addLike(String userNick, int reviewBoardNo) {
        // 좋아요 추가 로직
        int result = reviewBoardDao.insertLike(userNick, reviewBoardNo);
        // 좋아요 수 증가
        if (result > 0) {
        	reviewBoardDao.incrementLikeCount(reviewBoardNo);
            return true;
        }
        return false;
    }

	// 좋아요 취소
	@Transactional
	public boolean removeLike(String userNick, int reviewBoardNo) {
        // 좋아요 제거 로직
        int result = reviewBoardDao.deleteLike(userNick, reviewBoardNo);
        // 좋아요 수 감소
        if (result > 0) {
        	reviewBoardDao.decrementLikeCount(reviewBoardNo);
            return true;
        }
        return false;
	}
	
	// 댓글 등록
	@Transactional
	public void addComment(ReviewBoardCommentDTO comment) {
		reviewBoardDao.addComment(comment);
		
	}

	
	
	// 댓글 조회
	public List<ReviewBoardCommentDTO> getComments(int reviewBoardRef) {
        return reviewBoardDao.getComments(reviewBoardRef);
    }
	
	// 댓글 삭제
	@Transactional
	public void deleteComment(int commentNo) {
	   reviewBoardDao.deleteComment(commentNo);
	}

	
	// 댓글 수정
	@Transactional
	public void updateComment(int reviewBoardNo, int commentNo, ReviewBoardCommentDTO reviewBoardCommentDTO) {
		reviewBoardDao.updateComment(reviewBoardNo, commentNo, reviewBoardCommentDTO.getReviewBoardCommentContent());
	}

	public void reviewBoardViewReport(String userNick, int reviewBoardNo) {
		reviewBoardDao.reviewBoardViewReport(userNick, reviewBoardNo);
		
	}
	
	//오건하 작성 2024-10-07
	public Map myReviewBoardList(String userNick, int reviewBoardReqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		int totalCount = reviewBoardDao.myReviewBoardTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reviewBoardReqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = reviewBoardDao.myReviewBoardList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi",pi);
		return map;
	}
	
	
	
	
	
}










