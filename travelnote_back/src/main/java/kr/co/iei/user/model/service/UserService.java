package kr.co.iei.user.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.Module.SetupContext;

import kr.co.iei.user.model.dao.UserDao;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.user.model.dto.VerifyInfoDTO;
import kr.co.iei.util.EmailSender;
import kr.co.iei.util.JwtUtils;

@Service
public class UserService {
	@Autowired
	private UserDao userDao;
	@Autowired
	private JwtUtils jwtUtil;
	@Autowired
	private EmailSender emailSender;
	@Autowired
	private BCryptPasswordEncoder encoder;

	public int checkEmail(String userEmail) {
		int result = userDao.checkEmail(userEmail);
		return result;
	}
	
	public String createVerificationCode() {
		String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder verificationCode = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int randomIndex = (int) (Math.random() * characters.length());
            verificationCode.append(characters.charAt(randomIndex));
        }
        return verificationCode.toString();
	}
	
	public String sendVerificationCode(String userEmail) {
		String verificationCode = createVerificationCode();
		//이메일 보내는 로직
		String emailTitle = "TravelNote 회원가입 인증 메일";
		String emailContent = "<h2>당신의 여행 기록지 TravelNote 입니다.</h2>"
				+"<h3>귀하의 인증번호는 [ <span style='color:red;'>"
				+verificationCode
				+"</span> ] 입니다.</h3>"
				+"<h3>대소문자를 꼭 구별하여 인증해주세요!</h3>";
		emailSender.sendMail(emailTitle, userEmail, emailContent);
		String verifyToken = jwtUtil.verifyToken(userEmail, verificationCode);
		return verifyToken;
	}

	public int verifyCode(VerifyInfoDTO verifyInfo) {
		//Token 에서 인증코드 추출하기
		String tokenVerificationCode = jwtUtil.separateVerificationCode(verifyInfo.getVerifyToken());
		String userVerificationCode = verifyInfo.getVerificationCode();
		if(tokenVerificationCode.equals(userVerificationCode)) {
			return 1;
		}else {
			return 0;
		}
	}

	public int checkNick(String userNick) {
		int result = userDao.checkNick(userNick);
		return result;
	}

	@Transactional
	public int joinUser(UserDTO user) {
		String encPw = encoder.encode(user.getUserPw());
		user.setUserPw(encPw);
		int result = userDao.joinUser(user);
		return result;
	}
}
