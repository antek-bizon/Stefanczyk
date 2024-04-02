package com.example.photoserver.repository;

import com.example.photoserver.entity.PhotoFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoFileRepository extends JpaRepository<PhotoFile, Long> {
}
