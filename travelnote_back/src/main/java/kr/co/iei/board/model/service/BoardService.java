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
	
	public Map selectBoardList(int reqPage) {
		//게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 10; //한 페이지당 게시물 수
		int pageNaviSize = 5; //페이지네비 길이
		int totalCount = boardDao.totalCount();
		
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.selectBoardList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi",pi);
		return map;
	}
	@Transactional
	public int insertBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		int result = boardDao.insertBoard(board);
		
		for(BoardFileDTO boardFile : boardFileList) {
			boardFile.setBoardNo(board.getBoardNo());
			result += boardDao.insertBoardFile(boardFile);
		}
		return result;
	}

	public BoardDTO selectOneBoard(int boardNo) {
		BoardDTO board = boardDao.selectOneBoard(boardNo);
		List<BoardFileDTO> fileList = boardDao.selectOneBoardFileList(boardNo);
		board.setFileList(fileList);
		return board;
	}

	public BoardFileDTO getBoardFile(int boardFileNo) {
		BoardFileDTO board = boardDao.getBoardFile(boardFileNo);
		return board;
	}
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
	@Transactional
	public List<BoardFileDTO> updateBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		int result = boardDao.updateBoard(board);
		if(result > 0) {
			//삭제한 파일이 있으면  조회 후 삭제 
			List<BoardFileDTO> delFileList = new ArrayList<BoardFileDTO>();
			if(board.getDelBoardFileNo() != null) {
				delFileList = boardDao.selectBoardFile(board.getDelBoardFileNo());
				result += boardDao.deleteBoarFile(board.getDelBoardFileNo());
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
	@Transactional
	public void incrementViewCount(int boardNo) {
        boardDao.updateViewCount(boardNo);
    }
	
	public BoardDTO getBoardById(int boardNo) {
		return boardDao.selectBoardById(boardNo);
	}
	@Transactional
	public void addComment(BoardCommentDTO comment) {
		boardDao.addComment(comment);
		
	}
	public List<BoardCommentDTO> getComments(int boardRef) {
        return boardDao.getComments(boardRef);
    }
	@Transactional
	public void deleteComment(int commentNo) {
	   boardDao.deleteComment(commentNo);
	}
	@Transactional
	public void updateComment(int boardNo, int commentNo, BoardCommentDTO boardCommentDTO) {
		boardDao.updateComment(boardNo, commentNo, boardCommentDTO.getBoardCommentContent());
	}
	public void boardViewReport(String userNick, int boardNo) {
		boardDao.boardViewReport(userNick, boardNo);
		
	}
	//오건하 작성
	public Map selectReportBoardList(int boardReqPage) {
		int numPerPage = 5;
		int pageNaviSize = 5;
		int totalCount = boardDao.reportTotalCount();
		PageInfo pi = pageUtil.getPageInfo(boardReqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.selectReportBoard(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi",pi);
		return map;
	}
	//오건하 작성
	@Transactional
	public int updateBoardStatus(int boardNo) {
		int result = boardDao.updateBoardStatus(boardNo);
		return result;
	}
	
	
	   
	
	
	
}



































































