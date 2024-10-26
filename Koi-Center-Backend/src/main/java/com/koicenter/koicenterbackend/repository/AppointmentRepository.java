package com.koicenter.koicenterbackend.repository;

import com.koicenter.koicenterbackend.model.entity.Appointment;
import com.koicenter.koicenterbackend.model.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,String> {

    @Query(value = "SELECT * FROM koi_vet_db.appointment WHERE customer_id = :customerId", nativeQuery = true)
    List<Appointment> findAllByCustomerId(@Param("customerId") String customerId);


    @Query(value = "SELECT * FROM koi_vet_db.appointment WHERE appointment_id = :appointmentId", nativeQuery = true)
    Appointment findAppointmentById(@Param("appointmentId") String appointmentId);


    @Query(value = "SELECT * FROM koi_vet_db.appointment WHERE vet_id = :vetId", nativeQuery = true)
    List<Appointment> findAllByVetId(@Param("vetId") String vetId);

    List<Appointment> findByCustomer_CustomerIdOrderByCreatedAtDesc(String customerId);
    List<Appointment> findByVeterinarian_VetIdOrderByCreatedAtDesc(String vetId);
    Page<Appointment> findByStatusOrderByCreatedAtDesc(AppointmentStatus status, Pageable pageable);

    List<Appointment> findAllByService_ServiceId(String serviceId);
    List<Appointment> findAllByOrderByCreatedAtDesc();
    List<Appointment> findByVeterinarian_VetIdAndAppointmentDate(String vetId, LocalDate date);
    //Date
    @Query(value = "SELECT COUNT(kt.koi_treatment_id) FROM appointment a JOIN koi_treatment kt ON a.appointment_id = kt.appointment_id " +
            "WHERE appointment_date = :appointmentDate", nativeQuery = true)
    int countKoiTreatmentByDate(@Param("appointmentDate") String appointmentDate);

    @Query(value = "SELECT COUNT(pt.pond_treatment_id) FROM appointment a JOIN pond_treatment pt ON a.appointment_id = pt.appointment_id " +
            "WHERE appointment_date = :appointmentDate", nativeQuery = true)
    int countPondTreatmentByDate(@Param("appointmentDate") String appointmentDate);

    @Query(value = "SELECT COUNT(a.appointment_id) FROM appointment a " +
            "WHERE appointment_date = :appointmentDate", nativeQuery = true)
    int countAppointmentsByDate(@Param("appointmentDate") String appointmentDate);

    @Query(value = "SELECT SUM(i.total_price) FROM appointment a JOIN invoice i ON a.appointment_id = i.appointment_id " +
            "WHERE appointment_date = :appointmentDate", nativeQuery = true)
    Double sumTotalPriceByDate(@Param("appointmentDate") String appointmentDate);

    //YEAR
    @Query(value = "SELECT COUNT(kt.koi_treatment_id) FROM appointment a JOIN koi_treatment kt ON a.appointment_id = kt.appointment_id " +
            "WHERE YEAR(appointment_date) = :year", nativeQuery = true)
    int countKoiTreatmentByYear(@Param("year") int year);

    @Query(value = "SELECT COUNT(pt.pond_treatment_id) FROM appointment a JOIN pond_treatment pt ON a.appointment_id = pt.appointment_id " +
            "WHERE  YEAR(appointment_date) = :year", nativeQuery = true)
    int countPondTreatmentByYear(@Param("year") int year);

    @Query(value = "SELECT COUNT(a.appointment_id) FROM appointment a " +
            "WHERE YEAR(appointment_date) = :year", nativeQuery = true)
    int countAppointmentsByYear(@Param("year") int year);

    @Query(value = "SELECT SUM(i.total_price) FROM appointment a JOIN invoice i ON a.appointment_id = i.appointment_id " +
            "WHERE YEAR(appointment_date) = :year", nativeQuery = true)
    Double sumTotalPriceByYear(@Param("year") int year);

    //Month
    @Query(value = "SELECT COUNT(kt.koi_treatment_id) FROM appointment a JOIN koi_treatment kt ON a.appointment_id = kt.appointment_id " +
            "WHERE YEAR(appointment_date) = :year and MONTH(appointment_date) = :month", nativeQuery = true)
    int countKoiTreatmentByMonth(@Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT COUNT(pt.pond_treatment_id) FROM appointment a JOIN pond_treatment pt ON a.appointment_id = pt.appointment_id " +
            "WHERE YEAR(appointment_date) = :year and MONTH(appointment_date) = :month", nativeQuery = true)
    int countPondTreatmentByMonth(@Param("month") int month,@Param("year") int year  );

    @Query(value = "SELECT COUNT(a.appointment_id) FROM appointment a " +
            "WHERE YEAR(appointment_date) = :year and MONTH(appointment_date) = :month", nativeQuery = true)
    int countAppointmentsByMonth(@Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT SUM(i.total_price) FROM appointment a JOIN invoice i ON a.appointment_id = i.appointment_id " +
            "WHERE YEAR(appointment_date) = :year and MONTH(appointment_date) = :month", nativeQuery = true)
    Double sumTotalPriceByMonth(@Param("month") int month, @Param("year") int year);
    Page<Appointment> findByCustomer_CustomerId(String customer_id,Pageable pageable);
//    Page<Appointment> findByService_ServiceName(String serviceName) ;
    Page<Appointment> findByVeterinarian_VetId(String veterinarian_id,Pageable pageable);

}
