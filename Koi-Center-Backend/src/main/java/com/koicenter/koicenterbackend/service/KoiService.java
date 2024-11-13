package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.mapper.koi.KoiMapper;
import com.koicenter.koicenterbackend.model.entity.Customer;
import com.koicenter.koicenterbackend.model.entity.Koi;
import com.koicenter.koicenterbackend.model.request.koi.KoiRequest;
import com.koicenter.koicenterbackend.model.request.koi.KoiUpdateRequest;
import com.koicenter.koicenterbackend.model.response.koi.KoiResponse;
import com.koicenter.koicenterbackend.repository.KoiRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KoiService {

    @Autowired
     KoiRepository koiRepository;
    KoiMapper koiMapper;

    public List<Koi> getAllKoi(){
        return koiRepository.findAll();
    }

    public KoiResponse getKoiById(String koiId){
        Koi koi = koiRepository.findById(koiId).orElseThrow(()
                -> new AppException(ErrorCode.KOI_NOT_EXITS.getCode(),
                ErrorCode.KOI_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));
        KoiResponse koiResponse = new KoiResponse();
        koiResponse.setKoiId(koi.getKoiId());
        koiResponse.setBreed(koi.getBreed());
        koiResponse.setAge(koi.getAge());
        koiResponse.setLength(koi.getLength());
        koiResponse.setWeight(koi.getWeight());
        koiResponse.setStatus(koi.isStatus());
        koiResponse.setNotes(koi.getNotes());
        koiResponse.setImage(koi.getImage());
        return koiResponse;
    }

    public KoiResponse updateKoi(String koiId, KoiUpdateRequest request){
        Koi koi = koiRepository.findById(koiId).orElseThrow(()
                -> new AppException(ErrorCode.KOI_NOT_EXITS.getCode(),
                ErrorCode.KOI_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));

        if (request.getBreed() == null || request.getBreed().isEmpty()) {
            throw new AppException(404,"Please select a breed", HttpStatus.BAD_REQUEST);
        }
        if(request.getAge()<=0){
            throw new AppException(404,"Please enter a valid age", HttpStatus.BAD_REQUEST);
        }
        if(request.getLength()<=0){
            throw new AppException(404,"Please enter a valid length", HttpStatus.BAD_REQUEST);
        }
        if(request.getWeight()<=0){
            throw new AppException(404,"Please enter a valid weight", HttpStatus.BAD_REQUEST);
        }

        koi.setBreed(request.getBreed());
        koi.setAge(request.getAge());
        koi.setLength(request.getLength());
        koi.setWeight(request.getWeight());
        koi.setStatus(request.isStatus());
        koi.setNotes(request.getNotes());
        koi.setImage(request.getImage());
        koiRepository.save(koi);

        KoiResponse koiResponse = new KoiResponse();

        koiResponse.setKoiId(koi.getKoiId());
        koiResponse.setBreed(request.getBreed());
        koiResponse.setAge(request.getAge());
        koiResponse.setLength(request.getLength());
        koiResponse.setWeight(request.getWeight());
        koiResponse.setStatus(request.isStatus());
        koiResponse.setNotes(request.getNotes());
        koiResponse.setImage(request.getImage());

        return koiResponse;

    }
        public KoiResponse createKoi (KoiRequest koiRequest){

            if (koiRequest.getBreed() == null || koiRequest.getBreed().isEmpty()) {
                throw new AppException(404,"Please select a breed", HttpStatus.BAD_REQUEST);
            }
            if(koiRequest.getAge()<=0){
                throw new AppException(404,"Please enter a valid age", HttpStatus.BAD_REQUEST);
            }
            if(koiRequest.getLength()<=0){
                throw new AppException(404,"Please enter a valid length", HttpStatus.BAD_REQUEST);
            }
            if(koiRequest.getWeight()<=0){
                throw new AppException(404,"Please enter a valid weight", HttpStatus.BAD_REQUEST);
            }


            Koi koi = new Koi();
            koi.setBreed(koiRequest.getBreed());
            koi.setAge(koiRequest.getAge());
            koi.setLength(koiRequest.getLength());
            koi.setWeight(koiRequest.getWeight());
            koi.setStatus(true);  //tao koi moi nen de la true
            koi.setNotes(koiRequest.getNotes());
            koi.setImage(koiRequest.getImage());
            Customer customer = new Customer();
            customer.setCustomerId(koiRequest.getCustomerId());
            koi.setCustomer(customer);
            return koiMapper.toKoiResponse( koiRepository.save(koi)) ;
        }

    public void deleteKoi(String koiId) {
        Koi koi = koiRepository.findById(koiId).orElseThrow(()
                -> new AppException(ErrorCode.KOI_NOT_EXITS.getCode(),
                ErrorCode.KOI_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));
        koi.setStatus(false);
        koiRepository.save(koi);
    }


}
