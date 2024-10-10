package kr.co.iei.user.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="user")
public class UserDTO {
	private int userNo;
	private String userEmail;
	private String userPw;
	private String userName;
	private String userPhone;
	private String userNick;
	private int userType;
	private String socialType;
	private String businessRegNo;

	//정지회원기능 구현시 블라인드된 게시글의 갯수를 알기 위한 칼럼
	private int inactiveBoards;
}
