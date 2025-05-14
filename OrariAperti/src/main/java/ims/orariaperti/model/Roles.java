package ims.orariaperti.model;

public enum Roles {
    
    ADMIN("Administrator"),
    USER("User");

    private final String role;

    Roles(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
    
}
