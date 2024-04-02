package com.example.photoserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "photos_table")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "file_id")
    private Long fileId;

    @Column(name = "location_id")
    private Long locationId;

    public Photo(Long userId, Long fileId, Long locationId) {
        this.userId = userId;
        this.fileId = fileId;
        this.locationId = locationId;
    }
}
