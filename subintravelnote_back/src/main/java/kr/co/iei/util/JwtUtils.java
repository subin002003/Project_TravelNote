package kr.co.iei.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import kr.co.iei.user.model.dto.LoginUserDTO;

@Component
public class JwtUtils {
	
    @Value("${jwt.secret-key}")
    public String secretKey;

    @Value("${jwt.expire-hour}")
    public int expireHour;

    @Value("${jwt.expire-hour-refresh}")
    public int expireHourRefresh;

    // 1시간 토큰 생성 (로그인 유지)
    public String createAccessToken(String userEmail, int userType, String userNick) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Calendar c = Calendar.getInstance();
        Date startTime = c.getTime();
        c.add(Calendar.HOUR, expireHour);
        Date expireTime = c.getTime();

        return Jwts.builder()
                .setIssuedAt(startTime)   // 토큰 발행 시작 시간
                .setExpiration(expireTime) // 토큰 만료 시간
                .signWith(key)             // 암호화 서명
                .claim("userEmail", userEmail) // 사용자 이메일 정보
                .claim("userType", userType) // 사용자 타입 정보
                .claim("userNick", userNick) //사용자 닉네임 정보
                .compact();
    }

    // 8760시간(1년) 토큰 생성 (RefreshToken)
    public String createRefreshToken(String userEmail, int userType, String userNick) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Calendar c = Calendar.getInstance();
        Date startTime = c.getTime();
        c.add(Calendar.HOUR, expireHourRefresh);
        Date expireTime = c.getTime();

        return Jwts.builder()
                .setIssuedAt(startTime)   // 토큰 발행 시작 시간
                .setExpiration(expireTime) // 토큰 만료 시간
                .signWith(key)             // 암호화 서명
                .claim("userEmail", userEmail) // 사용자 이메일 정보
                .claim("userType", userType) // 사용자 타입 정보
                .claim("userNick", userNick) // 사용자 닉네임 정보
                .compact();
    }

    // 이메일 인증을 위한 5분짜리 토큰 생성
    public String verifyToken(String userEmail, String verificationCode) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Calendar c = Calendar.getInstance();
        Date startTime = c.getTime();
        c.add(Calendar.MINUTE, 5);
        Date expireTime = c.getTime();

        return Jwts.builder()
                .setIssuedAt(startTime)   // 토큰 발행 시작 시간
                .setExpiration(expireTime) // 토큰 만료 시간
                .signWith(key)             // 암호화 서명
                .claim("userEmail", userEmail) // 사용자 이메일 정보
                .claim("verificationCode", verificationCode) // 인증 코드
                .compact();
    }

    // JWT에서 인증 코드 추출
    public String separateVerificationCode(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.parserBuilder()        // parserBuilder() 사용
                .setSigningKey(key)        // SecretKey 설정
                .build()                   // JwtParser 빌드
                .parseClaimsJws(token)     // JWT 토큰 파싱
                .getBody()
                .get("verificationCode", String.class); // "verificationCode" 클레임 추출
    }

    // JWT 유효성 검사
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Jwts.parserBuilder()             // parserBuilder() 사용
                .setSigningKey(key)          // SecretKey 설정
                .build()                     // JwtParser 빌드
                .parseClaimsJws(token);      // 토큰 파싱
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public LoginUserDTO checkToken(String token) {
		//1. 토큰 해석을위한 암호화 키 셋팅
    	SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());  // SecretKey 생성

        Claims claims = Jwts.parserBuilder()   // parserBuilder() 사용
                .setSigningKey(key)            // 서명 키 설정
                .build()                       // JwtParser 빌드
                .parseClaimsJws(token)         // 토큰 파싱
                .getBody(); 
		
		String userEmail = (String)claims.get("userEmail");
		String userNick = (String)claims.get("userNick");
		int userType = (int)claims.get("userType");
		LoginUserDTO loginUser = new LoginUserDTO();
		loginUser.setUserEmail(userEmail);
		loginUser.setUserType(userType);
		loginUser.setUserNick(userNick);
		return loginUser;
	}
    
}
