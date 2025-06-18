package ims.orariaperti.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(frontendUrl, "http://localhost:8080")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("redirect:" + frontendUrl);
        registry.addViewController("/{x:[\\w\\-]+}").setViewName("redirect:" + frontendUrl);
        registry.addViewController("/{x:^(?!api$).*$}/**").setViewName("redirect:" + frontendUrl);
    }
}
