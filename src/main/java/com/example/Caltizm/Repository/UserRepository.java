package com.example.Caltizm.Repository;

import com.example.Caltizm.DTO.*;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    SqlSession session;

    String userNamespace = "user.";
    String addressNamespace = "address.";

    public LoginRequestDTO selectUserLogin(String email){

        return session.selectOne(userNamespace + "selectUserLogin", email);

    }

    public MyPageResponseDTO selectUserInfo(String email){

        return session.selectOne(userNamespace + "selectUserInfo", email);

    }

    public int updateUserInfo(UserUpdateRequestDTO userUpdateRequestDTO){

        return session.update(userNamespace + "updateUserInfo", userUpdateRequestDTO);

    }

    public List<AddressResponseDTO> selectAddressAll(String email){

        return session.selectList(addressNamespace + "selectAddressAll", email);

    }

    public int insertAddress(AddressRequestDTO addressRequestDTO){

        return session.insert(addressNamespace + "insertAddress", addressRequestDTO);

    }

}
