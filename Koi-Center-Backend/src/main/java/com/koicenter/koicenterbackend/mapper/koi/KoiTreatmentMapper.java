package com.koicenter.koicenterbackend.mapper.koi;

import com.koicenter.koicenterbackend.model.entity.KoiTreatment;
import com.koicenter.koicenterbackend.model.entity.PondTreatment;
import com.koicenter.koicenterbackend.model.response.koi.KoiTreatmentResponse;
import com.koicenter.koicenterbackend.model.response.pond.PondTreatmentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface KoiTreatmentMapper {
    @Mapping(target="koi",ignore = true)
    @Mapping(target="appointmentId",ignore = true)
    @Mapping(source = "koiTreatment.koi.koiId", target = "koiId")
    KoiTreatmentResponse toKoiTreatmentResponse(KoiTreatment koiTreatment);

}