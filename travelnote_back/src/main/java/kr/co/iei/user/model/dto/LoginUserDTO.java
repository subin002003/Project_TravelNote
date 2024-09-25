package kr.co.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginUserDTO {
	private String accessToken;
	private String refreshToken;
	private String userEmail;
	private String userNick;
	private int userType;
}
