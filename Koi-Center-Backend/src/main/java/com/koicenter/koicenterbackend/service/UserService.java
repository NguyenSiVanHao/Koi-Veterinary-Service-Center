package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.UserMapper;
import com.koicenter.koicenterbackend.model.entity.Customer;
import com.koicenter.koicenterbackend.model.entity.Staff;
import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.entity.Veterinarian;
import com.koicenter.koicenterbackend.model.enums.Role;
import com.koicenter.koicenterbackend.model.enums.VeterinarianStatus;
import com.koicenter.koicenterbackend.model.request.authentication.RegisterRequest;
import com.koicenter.koicenterbackend.model.request.authentication.UpdateForgotPasswordRequest;
import com.koicenter.koicenterbackend.model.request.authentication.UpdatePasswordRequest;
import com.koicenter.koicenterbackend.model.request.user.UpdateUserRequest;
import com.koicenter.koicenterbackend.model.response.staff.StaffDTO;
import com.koicenter.koicenterbackend.model.response.user.CustomerDTO;
import com.koicenter.koicenterbackend.model.response.user.UserResponse;

import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianDTO;
import com.koicenter.koicenterbackend.repository.CustomerRepository;
import com.koicenter.koicenterbackend.repository.StaffRepository;
import com.koicenter.koicenterbackend.repository.UserRepository;
import com.koicenter.koicenterbackend.repository.VeterinarianRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    VeterinarianRepository veterinarianRepository;

    @Value("${myapp.api-key}")
    private String privateKey;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserMapper userMapper;
    @Autowired
    private StaffRepository staffRepository;

    public boolean getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return false;

        }
        return true;
    }

    public void createUser(RegisterRequest newUser) {
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setPassword(encoder.encode(newUser.getPassword()));
        user.setFullName(newUser.getFullname());
        user.setEmail(newUser.getEmail());
        user.setStatus(true);

        user.setRole(Role.CUSTOMER);
        userRepository.save(user);


        if (user.getRole() == Role.CUSTOMER) {
            Customer customer = new Customer();
            customer.setUser(user);
            customer.setAddress(newUser.getAddress());
            customer.setPhone(newUser.getPhone());
            customerRepository.save(customer);
        }
    }

    public boolean getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        return true;
    }


    public UserResponse getMyInfo(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String username;
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            Jws<Claims> jws = Jwts.parser() // Use parserBuilder() instead of parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            username = jws.getBody().getSubject();
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN.getCode(), ErrorCode.INVALID_TOKEN.getMessage(), HttpStatus.FORBIDDEN);
        }
        return getUserByUsernameV2(username);
    }

    private UserResponse getUserByUsernameV2(String username) {

        User user = userRepository.findByUsername(username);
        UserResponse.UserResponseBuilder userResponseBuilder = UserResponse.builder()

                .user_id(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.isStatus())
                .image(user.getImage())
                .email(user.getEmail());

        if (user.getRole() == Role.CUSTOMER) {
            CustomerDTO customerDTO = new CustomerDTO(
                    user.getCustomer().getCustomerId(),
                    user.getCustomer().getAddress(),
                    user.getCustomer().getPhone(),
                    user.getCustomer().getImage()
            );
            userResponseBuilder.customer(customerDTO);
        }

        if (user.getRole() == Role.VETERINARIAN && user.getVeterinarian() != null) {
            VeterinarianDTO veterinarianDTO = new VeterinarianDTO(
                    user.getVeterinarian().getVetId(),
                    user.getVeterinarian().getDescription(),
                    user.getVeterinarian().getGoogleMeet(),
                    user.getVeterinarian().getImage(),
                    user.getVeterinarian().getPhone(),
                    user.getVeterinarian().getVeterinarianStatus().name(),
                    user.getVeterinarian().getStatus()
            );
            userResponseBuilder.veterinarian(veterinarianDTO);
        }

        return userResponseBuilder.build();
    }

    public User createVeterinarian(User newUser) {
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setPassword(encoder.encode(newUser.getPassword()));
        user.setEmail(newUser.getEmail());
        user.setFullName(newUser.getFullName());
        user.setRole(Role.VETERINARIAN);
        user.setStatus(true);
        return userRepository.save(user);


    }

    public boolean updateCustomer(UpdateUserRequest updateUserRequest) {
        try {
            Customer customer = customerRepository.findByUser_UserId(updateUserRequest.getUserId());
            customer.setAddress(updateUserRequest.getAddress());
            customer.setPhone(updateUserRequest.getPhoneNumber());
            User user = userRepository.findByUserId(updateUserRequest.getUserId());
            user.setFullName(updateUserRequest.getFullName());
            user.setEmail(updateUserRequest.getEmail());
            user.setImage(updateUserRequest.getImage());
            userRepository.save(user);
            customerRepository.save(customer);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public List<UserResponse> getListUserByRole(String role) {
        List<User> userList = userRepository.findByRole(Role.valueOf(role));
        List<UserResponse> userResponseList = new ArrayList<>();

        for (User user : userList) {
            if (user.getRole() == Role.CUSTOMER && user.isStatus()) {
                UserResponse userResponse = UserResponse.builder()
                        .user_id(user.getUserId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .status(user.isStatus())
                        .email(user.getEmail())
                        .veterinarian(null)
                        .staff(null)
                        .build();
                Customer customer = customerRepository.findByUser_UserId(user.getUserId());
                if (customer != null) {
                    CustomerDTO customerDTO = CustomerDTO.builder()
                            .customerId(customer.getCustomerId())
                            .phone(customer.getPhone())
                            .address(customer.getAddress())
                            .image(customer.getImage())
                            .build();
                    userResponse.setCustomer(customerDTO);
                    userResponseList.add(userResponse);
                }
            } else if (user.getRole() == Role.VETERINARIAN && user.isStatus()) {
                UserResponse userResponse = UserResponse.builder()
                        .user_id(user.getUserId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .status(user.isStatus())
                        .email(user.getEmail())
                        .customer(null)
                        .staff(null)
                        .build();
                Veterinarian veterinarian = veterinarianRepository.findByUserId(user.getUserId());
                if (veterinarian != null) {
                    VeterinarianDTO veterinarianDTO = VeterinarianDTO.builder()
                            .phone(veterinarian.getPhone())
                            .vetId(veterinarian.getVetId())
                            .description(veterinarian.getDescription())
                            .image(veterinarian.getImage())
                            .googleMeet(veterinarian.getGoogleMeet())
                            .veterinarianStatus(veterinarian.getStatus())
                            .build();
                    userResponse.setVeterinarian(veterinarianDTO);
                    userResponseList.add(userResponse);
                }
            } else if (user.getRole() == Role.STAFF && user.isStatus()) {
                UserResponse userResponse = UserResponse.builder()
                        .user_id(user.getUserId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .status(user.isStatus())
                        .email(user.getEmail())
                        .customer(null)
                        .veterinarian(null)
                        .build();
                Staff staff = staffRepository.findByUser_UserId(user.getUserId());
                if (staff != null) {
                    StaffDTO staffDTO = StaffDTO.builder()
                            .staffId(staff.getStaffId())
                            .salary(staff.getSalary())
                            .hireDate(staff.getHireDate())
                            .phone(staff.getPhone())
                            .image(staff.getImage())
                            .address(staff.getAddress())
                            .status(staff.getStatus())
                            .build();
                    userResponse.setStaff(staffDTO);
                    userResponseList.add(userResponse);
                }
            }
        }
        return userResponseList;
    }

    public boolean deleteUser(String userId) {
        try {
            User user = userRepository.findByUserId(userId);
            user.setStatus(false);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean updatePassword(UpdatePasswordRequest passwordRequest) {
        User user = userRepository.findByUserId(passwordRequest.getUserId());
        if (encoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
            userRepository.updatePassword(encoder.encode(passwordRequest.getNewPassword()), user.getUserId());
            return true;
        }
        return false;
    }

    public boolean updateUser(UpdateUserRequest updateUserRequest) {
        try {
            User user = userRepository.findByUserId(updateUserRequest.getUserId());
            user.setImage(updateUserRequest.getImage());
            user.setFullName(updateUserRequest.getFullName());
            user.setEmail(updateUserRequest.getEmail());
            if (user.getRole().equals(Role.CUSTOMER)) {
                Customer customer = customerRepository.findByUser_UserId(updateUserRequest.getUserId());
                customer.setPhone(updateUserRequest.getPhoneNumber());
                customer.setAddress(updateUserRequest.getAddress());
                customerRepository.save(customer);
            } else if (user.getRole().equals(Role.VETERINARIAN)) {
                Veterinarian veterinarian = veterinarianRepository.findByUserId(updateUserRequest.getUserId());
                veterinarian.setPhone(updateUserRequest.getPhoneNumber());
                veterinarianRepository.save(veterinarian);
            } else if (user.getRole().equals(Role.STAFF)) {
                Staff staff = staffRepository.findByUser_UserId(updateUserRequest.getUserId());
                staff.setPhone(updateUserRequest.getPhoneNumber());
                staffRepository.save(staff);
            }
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean updateForgotPassword(UpdateForgotPasswordRequest updateForgotPasswordRequest) {
        User user = userRepository.findByEmail(updateForgotPasswordRequest.getEmail());
        if (user != null) {
            String encodedPassword = encoder.encode(updateForgotPasswordRequest.getNewPassword());
            userRepository.updatePassword(encodedPassword, user.getUserId());
            return true;
        }
        return false;
    }
}


