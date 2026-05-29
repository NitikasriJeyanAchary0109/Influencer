package com.influenceflow.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String brandName;
    private String brandIndustry;
    private String role; // ADMIN, BRAND_MANAGER

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getBrandIndustry() { return brandIndustry; }
    public void setBrandIndustry(String brandIndustry) { this.brandIndustry = brandIndustry; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
