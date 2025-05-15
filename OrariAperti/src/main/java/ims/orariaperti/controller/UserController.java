package ims.orariaperti.controller;

import ims.orariaperti.entity.User;
import ims.orariaperti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String listUsers(Model model) {
        List<User> users = userRepository.findAll();
        model.addAttribute("users", users);
        return "userList";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("user", new User());
        return "createUser";
    }

    @PostMapping("/create")
    public String createUser(@ModelAttribute User user, Model model) {
        user.setId(UUID.randomUUID());
        userRepository.save(user);
        model.addAttribute("success", "User created successfully!");
        return "redirect:/users";
    }

    @GetMapping("/{id}")
    public String viewUser(@PathVariable UUID id, Model model) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            model.addAttribute("user", user.get());
            return "viewUser";
        } else {
            model.addAttribute("error", "User not found.");
            return "error";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable UUID id, Model model) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            model.addAttribute("user", user.get());
            return "editUser";
        } else {
            model.addAttribute("error", "User not found.");
            return "error";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateUser(@PathVariable UUID id, @ModelAttribute User updatedUser, Model model) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setRole(updatedUser.getRole());
            userRepository.save(existingUser);
            model.addAttribute("success", "User updated successfully!");
            return "redirect:/users";
        } else {
            model.addAttribute("error", "User not found.");
            return "error";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteUser(@PathVariable UUID id, Model model) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            model.addAttribute("success", "User deleted successfully!");
            return "redirect:/users";
        } else {
            model.addAttribute("error", "User not found.");
            return "error";
        }
    }
}