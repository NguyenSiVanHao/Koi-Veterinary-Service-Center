package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.Contact;
import com.koicenter.koicenterbackend.model.request.Contact.ContactRequest;
import com.koicenter.koicenterbackend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;

    public Contact saveContact(ContactRequest contactRequest) {

        if(contactRequest.getEmail().isEmpty() || contactRequest.getEmail() == null) {
            throw new AppException(404,"Please enter email", HttpStatus.BAD_REQUEST);
        }
        if(contactRequest.getName().isEmpty() || contactRequest.getName() == null) {
            throw new AppException(404,"Please enter name", HttpStatus.BAD_REQUEST);
        }
        if(contactRequest.getSubject().isEmpty() || contactRequest.getSubject() == null) {
            throw new AppException(404,"Please enter subject", HttpStatus.BAD_REQUEST);
        }
        if(contactRequest.getMessage().isEmpty() || contactRequest.getMessage() == null) {
            throw new AppException(404,"Please enter message", HttpStatus.BAD_REQUEST);
        }

        Contact contact = new Contact();
        contact.setName(contactRequest.getName());
        contact.setEmail(contactRequest.getEmail());
        contact.setSubject(contactRequest.getSubject());
        contact.setMessage(contactRequest.getMessage());
        return contactRepository.save(contact);
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(String id) {
        return contactRepository.findById(id);
    }
}
