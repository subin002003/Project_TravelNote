package kr.co.iei.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.dto.BoardCommentDTO;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private PageUtil pageUtil;
	
	// 전체 게시물 조회
	public Map selectBoardList(int reqPage) {
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 10; // 한 페이지당 게시물 수
		int pageNaviSize = 5; // 페이지네비 길이
		int totalCount = boardDao.totalCount(); // 전체 게시물 수
		
		// 페이지 정보 생성
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		//게시물 목록 조회
		List list = boardDao.selectBoardList(pi); // 게시물 목록 조회
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi",pi);
		return map;
	}
	
	// 검색된 게시물 조회
	public Map<String, Object> selectBoardSearchList(int reqPage, String searchTerm, String searchFilter) {
		int numPerPage = 10; // 한 페이지당 게시물 수
		int pageNaviSize = 5; // 페이지 네비 길이
		int totalCount = boardDao.searchTotalCount(searchTerm, searchFilter); // 검색된 게시물 수

	    // 페이지 정보 생성
	    PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
	    //게시물 목록 조회
	    List list = boardDao.selectBoardSearchList(pi, searchTerm, searchFilter); // 검색된 게시물 목록 조회
	    
	    Map<String, Object> map = new HashMap<>();
	    map.put("list", list);
	    map.put("pi", pi);
	    return map;
	}
	
	// 게시물 등록
	@Transactional
	public int insertBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		int result = boardDao.insertBoard(board);
		
		for(BoardFileDTO boardFile : boardFileList) {
			boardFile.setBoardNo(board.getBoardNo());
			result += boardDao.insertBoardFile(boardFile);
		}
		return result;
	}

	// 한 게시물 조회
	public BoardDTO selectOneBoard(int boardNo) {
		BoardDTO board = boardDao.selectOneBoard(boardNo);
		List<BoardFileDTO> fileList = boardDao.selectOneBoardFileList(boardNo);
		board.setFileList(fileList);
		return board;
	}

	// 파일 조회
	public BoardFileDTO getBoardFile(int boardFileNo) {
		BoardFileDTO board = boardDao.getBoardFile(boardFileNo);
		return board;
	}
	// 게시물 삭제
	@Transactional
	public List<BoardFileDTO> deleteBoard(int boardNo) {
		List<BoardFileDTO> fileList = boardDao.selectOneBoardFileList(boardNo);
		int result = boardDao.deleteBoard(boardNo);
		if(result >0) {
			return fileList;
		}else {
			return null;
		}
	}
	
	// 게시물 수정
	@Transactional
	public List<BoardFileDTO> updateBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		int result = boardDao.updateBoard(board);
		if(result > 0) {
			//삭제한 파일이 있으면  조회 후 삭제 
			List<BoardFileDTO> delFileList = new ArrayList<BoardFileDTO>();
			if(board.getDelBoardFileNo() != null) {
				delFileList = boardDao.selectBoardFile(board.getDelBoardFileNo());
				result += boardDao.deleteBoardFile(board.getDelBoardFileNo());
			}
			//새첨부파일이 있으면 새 첨부파일을 insert
			for(BoardFileDTO boardFile : boardFileList) {
				result += boardDao.insertBoardFile(boardFile);
			}
			int updateTotal = board.getDelBoardFileNo() == null
							? 1 + boardFileList.size() 
		
							: 1 + boardFileList.size() + board.getDelBoardFileNo().length;
			if(result == updateTotal) {
				return delFileList;
						
			}
		}
		return null;
	}
	
	// 좋아요 추가
	@Transactional
	public boolean addLike(String userNick, int boardNo) {
        // 좋아요 추가 로직
        int result = boardDao.insertLike(userNick, boardNo);
        // 좋아요 수 증가
        if (result > 0) {
            boardDao.incrementLikeCount(boardNo);
            return true;
        }
        return false;
    }
	
	// 좋아요 취소
	@Transactional
	public boolean removeLike(String userNick, int boardNo) {
        // 좋아요 제거 로직
        int result = boardDao.deleteLike(userNick, boardNo);
        // 좋아요 수 감소
        if (result > 0) {
            boardDao.decrementLikeCount(boardNo);
            return true;
        }
        return false;
	}
	
	// 조회수 
	@Transactional
	public void incrementViewCount(int boardNo) {
        boardDao.updateViewCount(boardNo);
    }
	// 아이디로 게시물 조회
	public BoardDTO getBoardById(int boardNo) {
		return boardDao.selectBoardById(boardNo);
	}
	
	// 댓글 추가
	@Transactional
	public void addComment(BoardCommentDTO comment) {
		boardDao.addComment(comment);
		
	}
	// 댓글 조회
	public List<BoardCommentDTO> getComments(int boardRef) {
        return boardDao.getComments(boardRef);
    }
	// 댓글 삭제
	@Transactional
	public void deleteComment(int commentNo) {
	   boardDao.deleteComment(commentNo);
	}
	// 댓글 수정
	@Transactional
	public void updateComment(int boardNo, int commentNo, BoardCommentDTO boardCommentDTO) {
		boardDao.updateComment(boardNo, commentNo, boardCommentDTO.getBoardCommentContent());
	}
	// 신고
	public void boardViewReport(String userNick, int boardNo) {
		boardDao.boardViewReport(userNick, boardNo);
		
	}

	
	
	
	   
	
	
	
}



































































