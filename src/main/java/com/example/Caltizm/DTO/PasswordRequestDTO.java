package com.example.Caltizm.DTO;

import lombok.Data;

@Data
public class PasswordRequestDTO {

    private String currentPassword;
    private String newPassword1;
    private String newPassword2;

}
