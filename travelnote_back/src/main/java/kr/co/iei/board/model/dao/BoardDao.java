package kr.co.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.util.PageInfo;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BoardDao {

	int totalCount();

	List selectBoardList(PageInfo pi);

	int insertBoard(BoardDTO board);

	int insertBoardFile(BoardFileDTO boardFile);

	BoardDTO selectOneBoard(int boardNo);

	List<BoardFileDTO> selectOneBoardFileList(int boardNo);

	BoardFileDTO getBoardFile(int boardFileNo);

	int deleteBoard(int boardNo);

	int updateBoard(BoardDTO board);

	List<BoardFileDTO> selectBoardFile(int[] delBoardFileNo);

	int deleteBoarFile(int[] delBoardFileNo);

	int insertLike(@Param("userNick") String userNick, @Param("boardNo") int boardNo);

	int deleteLike(@Param("userNick") String userNick, @Param("boardNo") int boardNo);

	void incrementLikeCount(int boardNo);

	void decrementLikeCount(int boardNo);

	void updateViewCount(@Param("boardNo") int boardNo);

	BoardDTO selectBoardById(@Param("boardNo") int boardNo);

	

	
	

}
