package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.model.entity.User;
import com.koicenter.koicenterbackend.model.entity.Veterinarian;
import com.koicenter.koicenterbackend.model.enums.Role;
import com.koicenter.koicenterbackend.model.enums.VeterinarianStatus;
import com.koicenter.koicenterbackend.model.request.user.UserRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.UpdateVetDescriptionRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VerinarianUpdateRequest;
import com.koicenter.koicenterbackend.model.request.veterinarian.VeterinarianRequest;
import com.koicenter.koicenterbackend.model.response.veterinarian.VetDescriptionResponse;
import com.koicenter.koicenterbackend.model.response.veterinarian.VeterinarianResponse;
import com.koicenter.koicenterbackend.model.response.user.UserResponse;
import com.koicenter.koicenterbackend.repository.ServicesRepository;
import com.koicenter.koicenterbackend.repository.UserRepository;
import com.koicenter.koicenterbackend.repository.VeterinarianRepository;
//import com.koicenter.koicenterbackend.repository.VeterinarianServiceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VeterinarianService {
    @Autowired
    VeterinarianRepository veterinarianRepository;
    UserRepository userRepository;
    ServicesRepository servicesRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ServiceService serviceService;

    //GET Veteriance ID
    public VeterinarianResponse getVeterinarianById(String veterinarianId) {
        Veterinarian veterinarian = veterinarianRepository.findById(veterinarianId).orElseThrow(() -> new AppException(
                ErrorCode.VETERINARIAN_ID_NOT_EXITS.getCode(),
                ErrorCode.VETERINARIAN_ID_NOT_EXITS.getMessage(),
                HttpStatus.NOT_FOUND));
        if (veterinarian.getUser().isStatus()) {

            VeterinarianResponse veterinarianResponse = new VeterinarianResponse();
            veterinarianResponse.setVetId(veterinarian.getVetId());
            veterinarianResponse.setVetStatus(veterinarian.getStatus());
            veterinarianResponse.setDescription(veterinarian.getDescription());
            veterinarianResponse.setGoogleMeet(veterinarian.getGoogleMeet());
            veterinarianResponse.setPhone(veterinarian.getPhone());
            veterinarianResponse.setImageVeterinarian(veterinarian.getImage());
            List<String> serviceNames = new ArrayList<>();
            for (com.koicenter.koicenterbackend.model.entity.Service service : veterinarian.getServices()) {
                serviceNames.add(service.getServiceName());
            }
            veterinarianResponse.setServiceNames(serviceNames);
            veterinarianResponse.setUserId(veterinarian.getUser().getUserId());

            User user = userRepository.findById(veterinarian.getUser().getUserId()).orElseThrow(() -> new AppException(
                    ErrorCode.USER_ID_NOT_EXITS.getCode(),
                    ErrorCode.USER_ID_NOT_EXITS.getMessage(),
                    HttpStatus.NOT_FOUND));
            UserResponse userResponse = new UserResponse();
            userResponse.setUser_id(user.getUserId());
            userResponse.setFullName(user.getFullName());
            userResponse.setUsername(user.getUsername());
            userResponse.setEmail(user.getEmail());
            userResponse.setStatus(user.isStatus());
            userResponse.setRole(user.getRole());

            veterinarianResponse.setUser(userResponse);
            return veterinarianResponse;
        }else {
            throw new AppException(
                    ErrorCode.USER_FALSE.getCode(),
                    ErrorCode.USER_FALSE.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    public List<VeterinarianResponse> getAllVet() {
        List<User> users = userRepository.findByRole(Role.VETERINARIAN);
        List<VeterinarianResponse> responseList = new ArrayList<>();
        for (User user : users) {
            if (user.isStatus()) {
                try {
                    Veterinarian veterinarian = veterinarianRepository.findByUserId(user.getUserId());
                    if (veterinarian != null) {
                        UserResponse userResponse = UserResponse.builder()
                                .user_id(user.getUserId())
                                .role(user.getRole())
                                .status(user.isStatus())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .build();

                        List<String> serviceNames = veterinarianRepository.findServiceNamesByVetId(veterinarian.getVetId());

                        VeterinarianResponse veterinarianResponse = VeterinarianResponse.builder()
                                .vetId(veterinarian.getVetId())
                                .description(veterinarian.getDescription())
                                .googleMeet(veterinarian.getGoogleMeet())
                                .phone(veterinarian.getPhone())
                                .imageVeterinarian(veterinarian.getImage() != null ? veterinarian.getImage() : null)
                                .vetStatus(veterinarian.getVeterinarianStatus().toString())
                                .serviceNames(serviceNames)
                                .user(userResponse)
                                .build();
                        responseList.add(veterinarianResponse);
                    }
                } catch (Exception e) {
                    log.error("Error while retrieving Veterinarian: {}", e.getMessage());
                }
            }
        }
        return responseList;
    }

    //CREATE VETERINARIAN
    public void createVeterinarian(VeterinarianRequest veterinarianRequest) {
        User newVeterinarian = new User();

        newVeterinarian.setFullName(veterinarianRequest.getUserRequest().getFullname());
        newVeterinarian.setEmail(veterinarianRequest.getUserRequest().getEmail());
        newVeterinarian.setUsername(veterinarianRequest.getUserRequest().getUsername());
        newVeterinarian.setPassword(veterinarianRequest.getUserRequest().getPassword());
        newVeterinarian.setImage(veterinarianRequest.getImage());

        newVeterinarian = userService.createVeterinarian(newVeterinarian);

        List<com.koicenter.koicenterbackend.model.entity.Service> services = new ArrayList<>();
        Veterinarian veterinarian = new Veterinarian();
        if (!veterinarianRequest.getService().isEmpty()) {
            for (String service : veterinarianRequest.getService()) {
                com.koicenter.koicenterbackend.model.entity.Service serviceId = servicesRepository.findByServiceId(service);
                if (serviceId != null) {
                    services.add(serviceId);
                    serviceId.getVeterinarians().add(veterinarian);
                } else {
                    throw new AppException(ErrorCode.SERVICE_NOT_EXITS.getCode(),
                            ErrorCode.SERVICE_NOT_EXITS.getMessage(),
                            HttpStatus.NOT_FOUND);
                }
            }
        }
        veterinarian.setServices(services);
        veterinarian.setDescription(veterinarianRequest.getDescription());
        veterinarian.setGoogleMeet(veterinarianRequest.getGoogle_meet());
        veterinarian.setPhone(veterinarianRequest.getPhone());
        veterinarian.setImage(veterinarianRequest.getImage());
        veterinarian.setStatus(veterinarianRequest.getStatus());
        veterinarian.setVeterinarianStatus(VeterinarianStatus.AVAILABLE);
        veterinarian.setUser(newVeterinarian);


        veterinarianRepository.save(veterinarian);
    }

    public List<VeterinarianResponse> getVeterinariansByServiceId(String serviceId) {
        List<Veterinarian> veterinarians = veterinarianRepository.findByServices_ServiceId(serviceId);

        if (veterinarians.isEmpty()) {
            throw new AppException(404, "Not found", HttpStatus.NOT_FOUND);
        }
        List<VeterinarianResponse> responseList = new ArrayList<>();
        for (Veterinarian veterinarian : veterinarians) {
            if (veterinarian.getUser().isStatus()) {
                List<String> serviceNames = veterinarianRepository.findServiceNamesByVetId(veterinarian.getVetId());

                VeterinarianResponse veterinarianResponse = new VeterinarianResponse();
                veterinarianResponse.setServiceNames(serviceNames);
                veterinarianResponse.setGoogleMeet(veterinarian.getGoogleMeet());
                veterinarianResponse.setPhone(veterinarian.getPhone());
                veterinarianResponse.setVetId(veterinarian.getVetId());
                veterinarianResponse.setDescription(veterinarian.getDescription());
                veterinarianResponse.setUserId(veterinarian.getUser().getUserId());
                veterinarianResponse.setVetStatus(veterinarian.getVeterinarianStatus() == null ? "" : veterinarian.getVeterinarianStatus().toString());
                veterinarianResponse.setImageVeterinarian((veterinarian.getImage() != null ? veterinarian.getImage() : null));
                veterinarianResponse.setUserId(veterinarian.getUser().getUserId());
                UserResponse userResponse = new UserResponse();
                userResponse.setFullName(veterinarian.getUser().getFullName());
                userResponse.setEmail(veterinarian.getUser().getEmail());
                userResponse.setUsername(veterinarian.getUser().getUsername());
                veterinarianResponse.setUser(userResponse);
                responseList.add(veterinarianResponse);
            }
        }
        return responseList;
    }

    public VeterinarianResponse updateVeterinarian(String vetId, VerinarianUpdateRequest request) {

        Veterinarian veterinarian = veterinarianRepository.findById(vetId).orElseThrow(() -> new AppException(
                ErrorCode.VETERINARIAN_ID_NOT_EXITS.getCode(),
                ErrorCode.VETERINARIAN_ID_NOT_EXITS.getMessage(),
                HttpStatus.NOT_FOUND));
        User userName = userRepository.findByUsername(request.getUser().getUsername());
        if (userName != null ){
            throw new AppException(
                    ErrorCode.USER_NAME_EXISTED.getCode(),
                    ErrorCode.USER_NAME_EXISTED.getMessage(),
                    HttpStatus.CREATED
                    );
        }
        veterinarian.setStatus(request.getStatus());
        veterinarian.setDescription(request.getDescription());
        veterinarian.setGoogleMeet(request.getGoogle_meet());
        veterinarian.setPhone(request.getPhone());
        veterinarian.setImage(request.getImage());

        List<String> newServiceIds = request.getService();
        List<com.koicenter.koicenterbackend.model.entity.Service> currentServices = veterinarian.getServices();
        List<com.koicenter.koicenterbackend.model.entity.Service> servicesToRemove = new ArrayList<>();
        for (com.koicenter.koicenterbackend.model.entity.Service currentService : currentServices) {
            if (!newServiceIds.contains(currentService.getServiceId())) {
                servicesToRemove.add(currentService);
            }
        }
        for (com.koicenter.koicenterbackend.model.entity.Service serviceToRemove : servicesToRemove) {
            serviceToRemove.getVeterinarians().remove(veterinarian);
        }
        currentServices.removeAll(servicesToRemove);
        for (String serviceId : newServiceIds) {
            com.koicenter.koicenterbackend.model.entity.Service serviceEntity = servicesRepository.findByServiceId(serviceId);
            if (serviceEntity != null) {
                boolean exists = servicesRepository.existsByServiceIdAndVeterinarianId(serviceId, vetId);
                if (!exists) {
                    currentServices.add(serviceEntity);
                    serviceEntity.getVeterinarians().add(veterinarian);
                }
            } else {
                throw new AppException(ErrorCode.SERVICE_NOT_EXITS.getCode(),
                        ErrorCode.SERVICE_NOT_EXITS.getMessage(),
                        HttpStatus.NOT_FOUND);
            }
        }

        User user = veterinarian.getUser();
        user.setUsername(request.getUser().getUsername());
        user.setEmail(request.getUser().getEmail());
        user.setFullName(request.getUser().getFullname());
        user.setImage(request.getUser().getImage());
        user.setStatus(request.getUser().isStatus());

        veterinarianRepository.save(veterinarian);

        VeterinarianResponse response = new VeterinarianResponse();
        response.setVetId(veterinarian.getVetId());
        response.setVetStatus(veterinarian.getStatus());
        response.setDescription(veterinarian.getDescription());
        response.setGoogleMeet(veterinarian.getGoogleMeet());
        response.setPhone(veterinarian.getPhone());
        response.setImageVeterinarian(veterinarian.getImage());
        List<String> serviceNames = new ArrayList<>();
        for (com.koicenter.koicenterbackend.model.entity.Service service : veterinarian.getServices()) {
            serviceNames.add(service.getServiceName());
        }
        response.setServiceNames(serviceNames);

        UserResponse userResponse = new UserResponse();
        userResponse.setUser_id(veterinarian.getUser().getUserId());
        userResponse.setUsername(veterinarian.getUser().getUsername());
        userResponse.setEmail(veterinarian.getUser().getEmail());
        userResponse.setFullName(veterinarian.getUser().getFullName());
        userResponse.setImage(veterinarian.getUser().getImage());
        userResponse.setStatus(veterinarian.getUser().isStatus());
        response.setUser(userResponse);

        return response;
    }

    public VetDescriptionResponse updateVetDescription(String vetId, UpdateVetDescriptionRequest request) {

        Veterinarian veterinarian = veterinarianRepository.findById(vetId)
                .orElseThrow(() -> new AppException(
                        ErrorCode.VETERINARIAN_ID_NOT_EXITS.getCode(),
                        ErrorCode.VETERINARIAN_ID_NOT_EXITS.getMessage(),
                        HttpStatus.NOT_FOUND));

        veterinarian.setDescription(request.getDescription());
        veterinarianRepository.save(veterinarian);
        VetDescriptionResponse response = new VetDescriptionResponse();
        response.setVetId(veterinarian.getVetId());
        response.setDescription(veterinarian.getDescription());
        return response;
    }
}


