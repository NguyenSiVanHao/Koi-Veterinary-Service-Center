package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.entity.Contact;
import com.koicenter.koicenterbackend.model.request.Contact.ContactRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contacts")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ResponseObject> createContact(@RequestBody ContactRequest contact) {
        try {
            Contact savedContact = contactService.saveContact(contact);
            return ResponseObject.APIRepsonse(200, "Contact create successfully", HttpStatus.OK, savedContact);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @GetMapping
    public ResponseEntity<ResponseObject> getAllContacts() {
        try {
            List<Contact> contacts = contactService.getAllContacts();
            return ResponseObject.APIRepsonse(200, "Retrieved all contacts successfully", HttpStatus.OK, contacts);
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<ResponseObject> getContactById(@PathVariable String contactId) {
        try {
            Optional<Contact> contact = contactService.getContactById(contactId);
            if (contact.isPresent()) {
                return ResponseObject.APIRepsonse(200, "Contact retrieved successfully", HttpStatus.OK, contact.get());
            } else {
                return ResponseObject.APIRepsonse(404, "Contact not found", HttpStatus.NOT_FOUND, null);
            }
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }
}

