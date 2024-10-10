package kr.co.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.dto.BoardCommentDTO;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.util.PageInfo;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BoardDao {

	int totalCount();

	List selectBoardList(PageInfo pi);

	int searchTotalCount(@Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);
	
	List selectBoardSearchList(@Param("pi") PageInfo pi, @Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);
	
	BoardDTO selectOneBoard(int boardNo);
	
	List<BoardFileDTO> selectOneBoardFileList(int boardNo);
	
	int insertBoard(BoardDTO board);

	int insertBoardFile(BoardFileDTO boardFile);

	BoardFileDTO getBoardFile(int boardFileNo);

	int deleteBoard(int boardNo);

	int updateBoard(BoardDTO board);

	List<BoardFileDTO> selectBoardFile(int[] delBoardFileNo);

	int deleteBoardFile(int[] delBoardFileNo);

	int insertLike(@Param("userNick") String userNick, @Param("boardNo") int boardNo);

	int deleteLike(@Param("userNick") String userNick, @Param("boardNo") int boardNo);

	String selectLike(@Param("userNick") String userNick, @Param("boardNo") int boardNo);
	
	void incrementLikeCount(int boardNo);

	void decrementLikeCount(int boardNo);

	void updateViewCount(@Param("boardNo") int boardNo);

	BoardDTO selectBoardById(@Param("boardNo") int boardNo);

	void addComment(BoardCommentDTO comment);

	List<BoardCommentDTO> getComments(int boardRef);

	void deleteComment(int commentNo);

	void updateComment(int boardNo, int commentNo, String boardCommentContent);


	void boardViewReport(String userNick, int boardNo);
	
	//오건하 작성 2024-10-04
	int reportTotalCount();
	
	//오건하 작성 2024-10-04
	List selectReportBoard(PageInfo pi);
	
	//오건하 작성 2024-10-04
	int updateBoardStatus(int boardNo);
	
	//오건하 작성 2024-10-04
	int myBoardTotalCount(String userNick);

	//오건하 작성 2024-10-04
	List selectMyBoardList(PageInfo pi);

	

	

	

	

	
	

}
