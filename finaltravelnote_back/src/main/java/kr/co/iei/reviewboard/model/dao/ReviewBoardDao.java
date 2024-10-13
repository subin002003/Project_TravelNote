package kr.co.iei.reviewboard.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.board.model.dto.BoardCommentDTO;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardCommentDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardDTO;
import kr.co.iei.reviewboard.model.dto.ReviewBoardFileDTO;
import kr.co.iei.util.PageInfo;

@Mapper
public interface ReviewBoardDao {

	int totalCount();

	List selectReviewBoardList(PageInfo pi);

	int searchReviewTotalCount(@Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);

	List selectReviewBoardSearchList(@Param("pi") PageInfo pi, @Param("searchTerm") String searchTerm, @Param("searchFilter") String searchFilter);

	ReviewBoardDTO selectOneReviewBoard(int reviewBoardNo);

	List<ReviewBoardFileDTO> selectOneReviewBoardFileList(int reviewBoardNo);

	void updateViewCount(@Param("reviewBoardNo") int reviewBoardNo);

	ReviewBoardDTO selectReviewBoardById(@Param("reviewBoardNo") int reviewBoardNo);

	int insertReviewBoard(ReviewBoardDTO reviewBoard);

	int insertReviewBoardFile(ReviewBoardFileDTO reviewBoardFile);

	ReviewBoardFileDTO getReviewBoardFile(int reviewBoardFileNo);

	int deleteReviewBoard(int reviewBoardNo);

	int updateReviewBoard(ReviewBoardDTO reviewBoard);

	List<ReviewBoardFileDTO> selectReviewBoardFile(int[] delReviewBoardFileNo);

	int deleteReviewBoardFile(int[] delReviewBoardFileNo);

	int insertLike(@Param("userNick") String userNick, @Param("reviewBoardNo") int reviewBoardNo);

	void incrementLikeCount(int boardNo);

	int deleteLike(@Param("userNick") String userNick, @Param("reviewBoardNo") int reviewBoardNo);

	String selectLike(@Param("userNick") String userNick, @Param("reviewBoardNo") int reviewBoardNo);	

	void decrementLikeCount(int boardNo);

	void addComment(ReviewBoardCommentDTO comment);

	List<ReviewBoardCommentDTO> getComments(int reviewBoardRef);

	void deleteComment(int commentNo);

	void updateComment(int reviewBoardNo, int commentNo, String reviewBoardCommentContent);

	void reviewBoardViewReport(String userNick, int reviewBoardNo);

	//오건하 2024-10-07 작성
	int myReviewBoardTotalCount(String userNick);

	//오건하 2024-10-07 작성
	List myReviewBoardList(PageInfo pi);

	//오건하 2024-10-07 작성
	int reportReviewBoardTotalCount();
	
	//오건하 2024-10-10 작성
	List reportReviewBoardList(PageInfo pi);

	//오건하 2024-10-10 작성
	int updateReviewBoardStatus(int reviewBoardNo);	

	
	
}
