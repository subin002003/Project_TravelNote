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
}
