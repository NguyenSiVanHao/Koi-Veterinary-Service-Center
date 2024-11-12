package com.koicenter.koicenterbackend.repository;

import com.koicenter.koicenterbackend.model.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {
    Medicine findByName(String medicineName);
}
