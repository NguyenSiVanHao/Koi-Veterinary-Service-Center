package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.model.entity.Medicine;
import com.koicenter.koicenterbackend.model.entity.Prescription;
import com.koicenter.koicenterbackend.model.entity.PrescriptionMedicine;
import com.koicenter.koicenterbackend.model.request.prescription.PrescriptionMedicineRequest;
import com.koicenter.koicenterbackend.model.request.prescription.PrescriptionRequest;
import com.koicenter.koicenterbackend.model.request.prescription.PrescriptionUpdateRequest;
import com.koicenter.koicenterbackend.model.response.medicine.*;
import com.koicenter.koicenterbackend.repository.MedicineRepository;
import com.koicenter.koicenterbackend.repository.PrescriptionMedicineRepository;
import com.koicenter.koicenterbackend.repository.TreatmentMedicineRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final TreatmentMedicineRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final PrescriptionMedicineRepository prescriptionMedicineRepository;

    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest prescriptionRequest) {


        Prescription prescription = Prescription.builder()
                .name(prescriptionRequest.getName())
                .createdDate(prescriptionRequest.getCreatedDate())
                .note(prescriptionRequest.getNote())
                .appointmentId(prescriptionRequest.getAppointmentId())
                .prescriptionMedicines(new HashSet<>())
                .build();

        Set<PrescriptionMedicine> prescriptionMedicines = new HashSet<>();

        prescriptionRequest.getPrescriptionMedicines().forEach(prescriptionMedicineRequest -> {

            Medicine medicine = medicineRepository.findById(prescriptionMedicineRequest.getMedicineId())
                    .orElseThrow(() -> new AppException(ErrorCode.MEDICINE_NOT_EXITS.getCode(),
                            ErrorCode.MEDICINE_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));

            PrescriptionMedicine prescriptionMedicine = PrescriptionMedicine.builder()
                    .prescription(prescription)
                    .medicine(medicine)
                    .quantity(prescriptionMedicineRequest.getQuantity())
                    .dosage(prescriptionMedicineRequest.getDosage())
                    .build();

            prescriptionMedicines.add(prescriptionMedicine);
        });

        prescription.setPrescriptionMedicines(prescriptionMedicines);

        prescriptionRepository.save(prescription);


        PrescriptionResponse prescriptionResponse = new PrescriptionResponse();

        prescriptionResponse.setId(prescription.getId());
        prescriptionResponse.setName(prescriptionRequest.getName());
        prescriptionResponse.setCreatedDate(prescription.getCreatedDate());
        prescriptionResponse.setNote(prescription.getNote());
        prescriptionResponse.setAppointmentId(prescription.getAppointmentId());

        Set<PrescriptionMedicineResponse> prescriptionMedicineResponses = new HashSet<>();

        for(PrescriptionMedicine prescriptionMedicine: prescriptionMedicines) {
            PrescriptionMedicineResponse prescriptionMedicineResponse = new PrescriptionMedicineResponse();

            Medicine medicine = prescriptionMedicine.getMedicine();
            MedicineResponse medicineResponse = new MedicineResponse();
            medicineResponse.setMedicineId(medicine.getMedicineId());
            medicineResponse.setName(medicine.getName());
            medicineResponse.setMedUnit(medicine.getMedUnit());
            medicineResponse.setDescription(medicine.getDescription());

            prescriptionMedicineResponse.setMedicine(medicineResponse);
            prescriptionMedicineResponse.setQuantity(prescriptionMedicine.getQuantity());
            prescriptionMedicineResponse.setDosage(prescriptionMedicine.getDosage());
            prescriptionMedicineResponses.add(prescriptionMedicineResponse);
        }

        prescriptionResponse.setPrescriptionMedicines(prescriptionMedicineResponses);

        return prescriptionResponse;
    }
    @Transactional
    public void deletePrescriptionMedicine(String prescriptionId, String medicineId ){
        PrescriptionMedicine prescriptionMedicine = prescriptionMedicineRepository.findByPrescription_IdAndMedicine_MedicineId(prescriptionId,medicineId);
      if(prescriptionMedicine != null) {
            prescriptionMedicineRepository.deleteByPrescription_IdAndMedicine_MedicineId(prescriptionId,medicineId);
        }else {
            throw new AppException(404, "Can not found prescriptionMedicine By prescriptionId and MedicineId",
                    HttpStatus.NOT_FOUND);
        }
    }
    public List<PrescriptionResponse> getPrescriptionsByAppointmentId(String appointmentId) {

        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);
        if (prescriptions.isEmpty()) {
            throw new AppException(ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getCode(),
                    "No prescriptions found for appointmentId: " + appointmentId,
                    HttpStatus.NOT_FOUND);
        }
        List<PrescriptionResponse> prescriptionResponses = new ArrayList<>();

        for (Prescription prescription : prescriptions) {
            PrescriptionResponse prescriptionResponse = new PrescriptionResponse();
            prescriptionResponse.setId(prescription.getId());
            prescriptionResponse.setName(prescription.getName());
            prescriptionResponse.setCreatedDate(prescription.getCreatedDate());
            prescriptionResponse.setNote(prescription.getNote());
            prescriptionResponse.setAppointmentId(prescription.getAppointmentId());

            Set<PrescriptionMedicineResponse> prescriptionMedicineResponses = new HashSet<>();
            for (PrescriptionMedicine prescriptionMedicine : prescription.getPrescriptionMedicines()) {
                PrescriptionMedicineResponse prescriptionMedicineResponse = new PrescriptionMedicineResponse();

                Medicine medicine = prescriptionMedicine.getMedicine();
                MedicineResponse medicineResponse = new MedicineResponse();
                medicineResponse.setMedicineId(medicine.getMedicineId());
                medicineResponse.setName(medicine.getName());
                medicineResponse.setDescription(medicine.getDescription());
                medicineResponse.setMedUnit(medicine.getMedUnit());

                prescriptionMedicineResponse.setMedicine(medicineResponse);
                prescriptionMedicineResponse.setQuantity(prescriptionMedicine.getQuantity());
                prescriptionMedicineResponse.setDosage(prescriptionMedicine.getDosage());
                prescriptionMedicineResponses.add(prescriptionMedicineResponse);
            }
            prescriptionResponse.setPrescriptionMedicines(prescriptionMedicineResponses);
            prescriptionResponses.add(prescriptionResponse);
        }
        return prescriptionResponses;
    }

    public PrescriptionByIdResponse getPrescriptionById(String id) {

        Prescription prescription = prescriptionRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.PRESCRIPTION_MEDICINE_NOT_EXITS.getCode(),
                        ErrorCode.PRESCRIPTION_MEDICINE_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));

        Set<PreMedResponse> prescriptionMedicineResponses = new HashSet<>();
        for (PrescriptionMedicine prescriptionMedicine : prescription.getPrescriptionMedicines()) {

            Medicine medicine = prescriptionMedicine.getMedicine();

            PreMedResponse preMedResponse = new PreMedResponse();
            preMedResponse.setMedicineId(medicine.getMedicineId());
            preMedResponse.setMedicineName(medicine.getName());
            preMedResponse.setMedUnit(medicine.getMedUnit());
            preMedResponse.setQuantity(prescriptionMedicine.getQuantity());
            preMedResponse.setDosage(prescriptionMedicine.getDosage());

            prescriptionMedicineResponses.add(preMedResponse);
        }

        PrescriptionByIdResponse prescriptionByIdResponse = new PrescriptionByIdResponse();
        prescriptionByIdResponse.setPrescriptionMedicines(prescriptionMedicineResponses);

        return prescriptionByIdResponse;
    }



    @Transactional
    public PrescriptionResponse updatePrescription(String prescriptionId, PrescriptionUpdateRequest prescriptionRequest) {

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getCode(),
                        ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getMessage(), HttpStatus.NOT_FOUND));

        Set<PrescriptionMedicine> currentMedicines = prescription.getPrescriptionMedicines();

        for (PrescriptionMedicineRequest medicineRequest : prescriptionRequest.getPrescriptionMedicines()) {
            for (PrescriptionMedicine pm : currentMedicines) {
                if (pm.getMedicine().getMedicineId().equals(medicineRequest.getMedicineId())) {
                    pm.setQuantity(medicineRequest.getQuantity());
                    pm.setDosage(medicineRequest.getDosage());
                    break;
                }
            }
        }
        prescriptionRepository.save(prescription);
        PrescriptionResponse prescriptionResponse = new PrescriptionResponse();
        prescriptionResponse.setId(prescription.getId());
        prescriptionResponse.setName(prescription.getName());
        prescriptionResponse.setCreatedDate(prescription.getCreatedDate());
        prescriptionResponse.setNote(prescription.getNote());
        prescriptionResponse.setAppointmentId(prescription.getAppointmentId());

        Set<PrescriptionMedicineResponse> prescriptionMedicineResponses = new HashSet<>();
        for (PrescriptionMedicine prescriptionMedicine : currentMedicines) {
            PrescriptionMedicineResponse prescriptionMedicineResponse = new PrescriptionMedicineResponse();

            Medicine med = prescriptionMedicine.getMedicine();
            MedicineResponse medResponse = new MedicineResponse();
            medResponse.setMedicineId(med.getMedicineId());
            medResponse.setName(med.getName());
            medResponse.setDescription(med.getDescription());
            medResponse.setMedUnit(med.getMedUnit());

            prescriptionMedicineResponse.setMedicine(medResponse);
            prescriptionMedicineResponse.setQuantity(prescriptionMedicine.getQuantity());
            prescriptionMedicineResponse.setDosage(prescriptionMedicine.getDosage());
            prescriptionMedicineResponses.add(prescriptionMedicineResponse);
        }

        prescriptionResponse.setPrescriptionMedicines(prescriptionMedicineResponses);
        return prescriptionResponse;
    }


    @Transactional
    public PrescriptionMedicineResponse getPrescriptionMedicineById(String id) {
        PrescriptionMedicine prescriptionMedicine = prescriptionMedicineRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRESCRIPTION_MEDICINE_ID_NOT_FOUND.getCode(),
                        ErrorCode.PRESCRIPTION_MEDICINE_ID_NOT_FOUND.getMessage(), HttpStatus.NOT_FOUND));

        PrescriptionMedicineResponse prescriptionMedicineResponse = new PrescriptionMedicineResponse();

        Medicine medicine = prescriptionMedicine.getMedicine();
        MedicineResponse medicineResponse = new MedicineResponse();
        medicineResponse.setMedicineId(medicine.getMedicineId());
        medicineResponse.setName(medicine.getName());
        medicineResponse.setMedUnit(medicine.getMedUnit());
        medicineResponse.setDescription(medicine.getDescription());
        prescriptionMedicineResponse.setMedicine(medicineResponse);
        prescriptionMedicineResponse.setQuantity(prescriptionMedicine.getQuantity());
        prescriptionMedicineResponse.setDosage(prescriptionMedicine.getDosage());

        return prescriptionMedicineResponse;
    }
    @Transactional
    public void deletePrescriptionByPrescriptionId(String prescriptionId) {
        log.info("prescriptionId"+prescriptionId);

                Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() -> new AppException(
                ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getCode(),
                ErrorCode.PRESCRIPTION_ID_NOT_FOUND.getMessage(),
                HttpStatus.NOT_FOUND
        ));
        log.info("prescriptionId"+prescription.getId()
        );
        prescriptionRepository.delete(prescription);
    }


}

