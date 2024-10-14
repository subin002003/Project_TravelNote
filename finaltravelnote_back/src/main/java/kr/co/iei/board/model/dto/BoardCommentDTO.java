package kr.co.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "boardComment")
public class BoardCommentDTO {
	private int boardCommentNo;
	private int boardRef; // 게시물 번호
	private String boardCommentWriter; // 작성자
	private String boardCommentContent; // 댓글 내용
	private String boardCommentDate; // 댓글 작성일
}
