package com.koicenter.koicenterbackend.model.entity;


import com.koicenter.koicenterbackend.model.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    String userId;
    String username;
   @NotNull
    String password;
    String email;
    @Column(name = "full_name")
    String fullName;
    @Enumerated(EnumType.STRING)
    Role role;
    boolean status;
    String image;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    Customer customer;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    Veterinarian veterinarian;

}
