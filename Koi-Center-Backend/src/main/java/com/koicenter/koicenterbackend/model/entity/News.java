package com.koicenter.koicenterbackend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "new_id")
    String newId;
    @Lob
    @Column(name = "title", columnDefinition = "TEXT")
    String title;
    @Lob
    @Column(name = "preview", columnDefinition = "TEXT")
    String preview;
    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    String content;
    String img;
    boolean status;
}
