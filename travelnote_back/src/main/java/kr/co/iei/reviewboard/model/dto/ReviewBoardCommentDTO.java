package kr.co.iei.reviewboard.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "reviewBoardComment")
public class ReviewBoardCommentDTO {
	private int reviewBoardCommentNo;
	private int reviewBoardRef; // 게시물 번호
	private String reivewBoardCommentWriter; // 작성자
	private String reviewBoardCommentContent; // 댓글 내용
	private String boardCommentDate; // 댓글 작성일
}
