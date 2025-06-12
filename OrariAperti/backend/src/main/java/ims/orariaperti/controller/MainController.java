package ims.orariaperti.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController implements ErrorController {
    @Value("${frontend.url}")
    private String frontendUrl;

    @RequestMapping("/*")
    public Object redirect() {
        return "redirect:" + frontendUrl;
    }
}
