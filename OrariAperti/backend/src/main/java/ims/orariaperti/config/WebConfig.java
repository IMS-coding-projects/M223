package ims.orariaperti.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from the react-app directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/react-app/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward requests to the index.html for client-side routing
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{x:[\\w\\-]+}").setViewName("forward:/index.html");
        registry.addViewController("/{x:^(?!api$).*$}/**").setViewName("forward:/index.html");
    }
}