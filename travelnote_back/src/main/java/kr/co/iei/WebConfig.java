package kr.co.iei;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig {
	@Value("${file.root}")
	public String root;

	@Bean
	public BCryptPasswordEncoder bCrypt() {
		return new BCryptPasswordEncoder();
	}
	
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
			.addResourceHandler("/product/editor/**")
			.addResourceLocations("file:///"+root+"/product/editor/");
		
		registry
			.addResourceHandler("/product/thumb/**")
			.addResourceLocations("file:///"+root+"/product/thumb/");
	}
}
