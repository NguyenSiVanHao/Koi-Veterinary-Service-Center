package com.koicenter.koicenterbackend.repository;

import com.koicenter.koicenterbackend.model.entity.Service;
import com.koicenter.koicenterbackend.model.enums.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicesRepository extends JpaRepository<Service, String> {
    List<Service> findByServiceForNot(ServiceType serviceType);
    List<Service> findByServiceFor(ServiceType serviceType);
    Service findByServiceId(String serviceId);

    Optional<Service> findByserviceName(String serviceName);

    @Query("SELECT COUNT(v) > 0 FROM Veterinarian v JOIN v.services s WHERE s.serviceId = :serviceId AND v.vetId = :veterinarianId")
    boolean existsByServiceIdAndVeterinarianId(@Param("serviceId") String serviceId, @Param("veterinarianId") String veterinarianId);
}
