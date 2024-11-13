package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.model.entity.Delivery;
import com.koicenter.koicenterbackend.model.request.delivery.DeliveryRequest;
import com.koicenter.koicenterbackend.model.response.delivery.DeliveryResponse;
import com.koicenter.koicenterbackend.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    public DeliveryResponse updateDelivery(String id, DeliveryRequest deliveryRequest) {
        

        Delivery delivery = deliveryRepository.findById(id).orElseThrow(()->
        new AppException(ErrorCode.DELIVERY_ID_NOT_EXITS.getCode(),
                ErrorCode.DELIVERY_ID_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));

        if(deliveryRequest.getPrice() <= 0){
            throw new AppException(404, "Please enter price greater than 0", HttpStatus.BAD_REQUEST);
        }
        if(deliveryRequest.getToPlace() <= 0){
            throw new AppException(404, "Please enter place greater than 0", HttpStatus.BAD_REQUEST);
        }
        if(deliveryRequest.getFromPlace() < 0){
            throw new AppException(404, "Please enter place greater than 0", HttpStatus.BAD_REQUEST);
        }

        delivery.setPrice(deliveryRequest.getPrice());
        delivery.setFromPlace(deliveryRequest.getFromPlace());
        delivery.setToPlace(deliveryRequest.getToPlace());
        deliveryRepository.save(delivery);

        return new DeliveryResponse(delivery.getDeliveryId(), delivery.getFromPlace(), delivery.getToPlace(), delivery.getPrice());

    }

    public List<DeliveryResponse> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        List<DeliveryResponse> deliveryResponses = new ArrayList<>();
        for (Delivery delivery : deliveries) {
            DeliveryResponse deli = new DeliveryResponse();
            deli.setDeliveryId(delivery.getDeliveryId());
            deli.setFromPlace(delivery.getFromPlace());
            deli.setToPlace(delivery.getToPlace());
            deli.setPrice(delivery.getPrice());
            deliveryResponses.add(deli);
        }
        return deliveryResponses;
    }


    public DeliveryResponse getDeliveryById(String id) {

        Delivery delivery = deliveryRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.DELIVERY_ID_NOT_EXITS.getCode(),
                        ErrorCode.DELIVERY_ID_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));

        DeliveryResponse deliveryResponse = new DeliveryResponse();
        deliveryResponse.setDeliveryId(delivery.getDeliveryId());
        deliveryResponse.setFromPlace(delivery.getFromPlace());
        deliveryResponse.setToPlace(delivery.getToPlace());
        deliveryResponse.setPrice(delivery.getPrice());
        return deliveryResponse;
    }

    public DeliveryResponse createDelivery(DeliveryRequest deliveryRequest) {

        if(deliveryRequest.getPrice() <= 0){
            throw new AppException(404, "Please enter price greater than 0", HttpStatus.BAD_REQUEST);
        }
        if(deliveryRequest.getToPlace() <= 0){
            throw new AppException(404, "Please enter place greater than 0", HttpStatus.BAD_REQUEST);
        }
        if(deliveryRequest.getFromPlace() < 0){
            throw new AppException(404, "Please enter place greater than 0", HttpStatus.BAD_REQUEST);
        }

        Delivery deli = new Delivery();
        deli.setFromPlace(deliveryRequest.getFromPlace());
        deli.setToPlace(deliveryRequest.getToPlace());
        deli.setPrice(deliveryRequest.getPrice());
        deliveryRepository.save(deli);
        return new DeliveryResponse(deli.getDeliveryId(), deli.getFromPlace(), deli.getToPlace(), deli.getPrice());
    }

    public void deleteDelivery(String id) {
        Delivery deli = deliveryRepository.findById(id).orElseThrow(()->
                new AppException(ErrorCode.DELIVERY_ID_NOT_EXITS.getCode(),
                        ErrorCode.DELIVERY_ID_NOT_EXITS.getMessage(), HttpStatus.NOT_FOUND));
        deliveryRepository.delete(deli);
    }
}
