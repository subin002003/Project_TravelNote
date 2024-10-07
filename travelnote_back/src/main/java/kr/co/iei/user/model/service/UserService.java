package kr.co.iei.user.model.service;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import kr.co.iei.Domestic.model.dao.DomesticDao;
import kr.co.iei.foreignPlan.model.dao.ForeignPlanDao;
import kr.co.iei.user.model.dao.UserDao;
import kr.co.iei.user.model.dto.LoginUserDTO;
import kr.co.iei.user.model.dto.UserDTO;
import kr.co.iei.user.model.dto.VerifyInfoDTO;
import kr.co.iei.util.EmailSender;
import kr.co.iei.util.JwtUtils;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

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
	@Autowired
	private ForeignPlanDao foreignPlanDao;
	@Autowired
	private DomesticDao domesticDao;
	@Autowired
	private PageUtil pageUtil;
	
	private final String NAVER_USER_INFO_URL = "https://openapi.naver.com/v1/nid/me";
	

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
		String emailTitle = "TravelNote 인증 메일";
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
	
	public int checkPhone(String userPhone) {
		int result = userDao.checkPhone(userPhone);
		return result;
	}

	@Transactional
	public int joinUser(UserDTO user) {
		String encPw = encoder.encode(user.getUserPw());
		user.setUserPw(encPw);
		int result = userDao.joinUser(user);
		return result;
	}

	public LoginUserDTO login(UserDTO user) {
		UserDTO u = userDao.selectOneUser(user.getUserEmail());
		if(u != null && encoder.matches(user.getUserPw(), u.getUserPw())) {
			String accessToken = jwtUtil.createAccessToken(u.getUserEmail(), u.getUserType(), u.getUserNick());
			String refreshToken = jwtUtil.createRefreshToken(u.getUserEmail(), u.getUserType(), u.getUserNick());
			LoginUserDTO loginUser = new LoginUserDTO(accessToken, refreshToken, u.getUserEmail(), u.getUserNick(), u.getUserType());
			return loginUser;
		}else {
			return null;
		}
	}

	public LoginUserDTO refresh(String token) {
		try {
			LoginUserDTO loginUser = jwtUtil.checkToken(token);
			String accessToken = jwtUtil.createAccessToken(loginUser.getUserEmail(), loginUser.getUserType(), loginUser.getUserNick());
			String refreshToken = jwtUtil.createAccessToken(loginUser.getUserEmail(), loginUser.getUserType(), loginUser.getUserNick());
			loginUser.setAccessToken(accessToken);
			loginUser.setRefreshToken(refreshToken);
			return loginUser;
		} catch (Exception e) {
			
		}
		return null;
	}
	
	//AuthorizationCode 를 통해 네이버에 accessToken 받아오기
	public String getNaverAccessToken(Map<String, String> authInfo) {
		RestTemplate restTemplate = new RestTemplate();
		String authorizationCode = authInfo.get("authorizationCode");
		String state = authInfo.get("state");
		String tokenUrl = "https://nid.naver.com/oauth2.0/token" +
                "?grant_type=authorization_code" +
                "&client_id=NumWEDcbCHhbmWrzbpCl" +  // 실제 client_id로 교체
                "&client_secret=WPwRWwcCzO" +  // 실제 client_secret로 교체
                "&code=" + authorizationCode +
                "&state=" + state;
			    
		HttpHeaders headers = new HttpHeaders();
	    HttpEntity<String> entity = new HttpEntity<>(headers);

	    // GET 방식으로 요청하여 액세스 토큰을 받아옴
	    ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.GET, entity, Map.class);

	    // 응답에서 액세스 토큰 추출
	    Map<String, Object> responseBody = response.getBody();
	    String accessToken = (String) responseBody.get("access_token");
	    return accessToken;
	}

	public UserDTO naverUserInfo(String accessToken) {
		// RestTemplate 객체 생성
        // RestTemplate은 Spring에서 제공하는 HTTP 통신을 간단하게 처리할 수 있는 클래스이다.
        // 이 객체를 사용하여 네이버 API로 GET 요청을 보낸다.
        RestTemplate restTemplate = new RestTemplate();

        // 요청 헤더 설정
        // HttpHeaders는 HTTP 요청에 필요한 헤더 정보를 담기 위한 클래스이다.
        // 여기서는 Authorization 헤더에 "Bearer {accessToken}" 형식으로 액세스 토큰을 추가한다.
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);  // "Bearer {accessToken}" 형식으로 헤더에 추가

        // 사용자 정보를 요청하기 위한 RequestEntity 생성
        // RequestEntity는 요청의 메타데이터(헤더, HTTP 메서드, URL 등)와 함께 HTTP 요청을 구성한다.
        // HttpMethod.GET: GET 메서드를 사용하여 요청을 보낸다.
        // URI.create(NAVER_USER_INFO_URL): 네이버 사용자 정보 API 엔드포인트로 요청을 보낸다.
        RequestEntity<Void> request = new RequestEntity<>(headers, HttpMethod.GET, URI.create(NAVER_USER_INFO_URL));

        // 네이버 API 호출
        // RestTemplate의 exchange() 메서드를 사용해 요청을 보낸다.
        // 이 메서드는 지정된 URL로 요청을 보내고, 응답을 지정된 타입(Map)으로 변환해준다.
        // 응답은 ResponseEntity로 반환된다. ResponseEntity는 HTTP 응답의 상태 코드, 헤더, 바디 등을 담고 있다.
        ResponseEntity<Map> response = restTemplate.exchange(request, Map.class);

        // API 응답에서 사용자 정보를 추출하여 반환
        // response.getBody()를 호출하여 실제 응답 데이터를 Map 형식으로 가져온다.
        // 이 데이터에는 사용자의 이메일, 이름, 프로필 이미지 등이 포함되어 있다.
        Map<String, Object> responseBody = response.getBody();
        Map<String, Object> userInfo = (Map<String, Object>) responseBody.get("response");
        
        UserDTO naverUser = new UserDTO();
        naverUser.setUserEmail((String)userInfo.get("email"));
        naverUser.setUserNick((String)userInfo.get("nickname"));
        naverUser.setUserPhone((String)userInfo.get("mobile"));
        naverUser.setUserName((String)userInfo.get("name"));
        naverUser.setSocialType("naver");
        return naverUser;

	}

	@Transactional
	public int joinSocialUser(UserDTO naverUser) {
		int result = userDao.joinSocialUser(naverUser);
		return result;
	}


	public LoginUserDTO socialLogin(UserDTO naverUser) {
		UserDTO u = userDao.selectOneUser(naverUser.getUserEmail());
		if(u != null) {
			String accessToken = jwtUtil.createAccessToken(u.getUserEmail(), u.getUserType(), u.getUserNick());
			String refreshToken = jwtUtil.createRefreshToken(u.getUserEmail(), u.getUserType(), u.getUserNick());
			LoginUserDTO loginUser = new LoginUserDTO(accessToken, refreshToken, u.getUserEmail(), u.getUserNick() ,u.getUserType() );
			return loginUser;
		}else {
			return null;
		}
	}


	public String findUser(UserDTO user) {
		String findEmail = userDao.findEmail(user);
		return findEmail;
	}

	@Transactional
	public int changePw(UserDTO user) {
		String encPw = encoder.encode(user.getUserPw());
		user.setUserPw(encPw);
		int result = userDao.changePw(user);
		return result;
	}


	public UserDTO userInfo(String token) {
		LoginUserDTO loginUser = jwtUtil.checkToken(token);
		UserDTO userInfo = userDao.selectUserInfo(loginUser.getUserEmail());
		return userInfo;
	}

	@Transactional
	public int updateUser(UserDTO user) {
		int result = userDao.updateUser(user);
		return result;
	}

	@Transactional
	public int deleteUser(String token) {
		LoginUserDTO loginUser = jwtUtil.checkToken(token);
		int result = userDao.deleteUser(loginUser.getUserEmail());
		return result;
	}


	public String getNick(String token) {
		LoginUserDTO loginUser = jwtUtil.checkToken(token);
		
		return loginUser.getUserNick();
	}



	public int checkBusinessRegNo(String businessRegNo) {
		int result = userDao.checkBusinessRegNo(businessRegNo);
		return result;
	}


	// 해외 여행 동행자 추가
	public int findUserByEmail(String memberEmail) {
		int result = userDao.selectUserByEmail(memberEmail);
		return result;
	}

	// 해외 여행 동행자 초대 이메일 발송
	public int sendInvitation(String memberEmail, String userEmail) {
		String emailTitle = "TravelNote 초대 메일";
		String emailContent = "<h2>당신의 여행 기록지 TravelNote 입니다.</h2>"
				+"<h3>" + userEmail + "님이 초대를 보냈습니다. 지금 로그인하여 일정을 확인해 주세요.";
		int result = emailSender.sendInvitation(emailTitle, memberEmail, emailContent);
		return result;
	}


	
	public Map myTravel(String userNick, int reqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		int totalCount = domesticDao.myTravelTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = domesticDao.myTravelList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi", pi);
		return map;
	}


	public Map shareTravelList(String userNick, int reqPage) {
		int numPerPage = 3;
		int pageNaviSize = 5;
		int totalCount = domesticDao.shareTravelTotalCount(userNick);
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		pi.setUserNick(userNick);
		List list = domesticDao.shareTravelList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list",list);
		map.put("pi",pi);
		return map;
	}


	

	 public UserDTO UserByEmail(String email) {
	        return userDao.selectUserEmail(email);
	    }



	


	
	
}
