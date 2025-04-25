package kr.co.iei;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
	
	@Value("${file.root}")
	public String root;

	@Bean
	public BCryptPasswordEncoder bCrypt() {
		return new BCryptPasswordEncoder();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
		.addResourceHandler("/product/**")
		.addResourceLocations("file:///"+root+"/product/");
		
		registry
			.addResourceHandler("/product/editor/**")
			.addResourceLocations("file:///"+root+"/product/editor/");
		
		registry
			.addResourceHandler("/product/thumb/**")
			.addResourceLocations("file:///"+root+"/product/thumb/");
		
		// board 설정
		registry
		.addResourceHandler("/board/thumb/**")
		.addResourceLocations("file:///"+root+"/board/thumb/");
		
		// reviewBoard 설정
		registry
		.addResourceHandler("/reviewBoard/thumb/**")
		.addResourceLocations("file:///"+root+"/reviewBoard/thumb/");
		
		// board, reviewBoard editor 설정
		registry
		.addResourceHandler("/editor/**")
		.addResourceLocations("file:///"+root+"/editor/");
		
		registry
		.addResourceHandler("/foreignImg/**")
		.addResourceLocations("file:///"+root+"/foreign/");

		registry
		.addResourceHandler("/personalBoard/**")
		.addResourceLocations("file:///"+root+"/personalBoard/");
	}
	
}
