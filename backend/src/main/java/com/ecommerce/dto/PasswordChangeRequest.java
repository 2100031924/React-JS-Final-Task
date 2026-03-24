package com.ecommerce.dto;

import lombok.Data;

@Data
class PasswordChangeRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
