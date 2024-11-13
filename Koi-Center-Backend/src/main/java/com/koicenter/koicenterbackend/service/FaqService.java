package com.koicenter.koicenterbackend.service;

import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.exception.ErrorCode;
import com.koicenter.koicenterbackend.model.entity.Faq;
import com.koicenter.koicenterbackend.model.request.Faq.FaqRequest;
import com.koicenter.koicenterbackend.repository.FaqRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FaqService {
    @Autowired
    private FaqRepository faqRepository;

    public Faq createFaq(FaqRequest faqRequest) {
        if(faqRequest.getAnswer().isEmpty() || faqRequest.getAnswer() == null) {
            throw new AppException(404,"Please enter answer",HttpStatus.BAD_REQUEST);
        }
        if(faqRequest.getQuestion().isEmpty() || faqRequest.getQuestion() == null) {
            throw new AppException(400,"Please enter question",HttpStatus.BAD_REQUEST);
        }
        Faq faq = new Faq();
        faq.setQuestion(faqRequest.getQuestion());
        faq.setAnswer(faqRequest.getAnswer());
        faq.setCreatedAt(faqRequest.getCreatedAt());

        return faqRepository.save(faq);
    }

    public List<Faq> getAllFaqs() {
        return faqRepository.findAll();
    }

    public Optional<Faq> getFaqById(String faqId) {
        return faqRepository.findById(faqId);
    }

    public Faq updateFaq(String faqId, FaqRequest faqRequest) {
        if(faqRequest.getAnswer().isEmpty() || faqRequest.getAnswer() == null) {
            throw new AppException(404,"Please enter answer",HttpStatus.BAD_REQUEST);
        }
        if(faqRequest.getQuestion().isEmpty() || faqRequest.getQuestion() == null) {
            throw new AppException(400,"Please enter question",HttpStatus.BAD_REQUEST);
        }
        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(() -> new AppException(ErrorCode.FAQ_ID_NOT_FOUND.getCode(),
                        ErrorCode.FAQ_ID_NOT_FOUND.getMessage(), HttpStatus.NOT_FOUND));

        faq.setQuestion(faqRequest.getQuestion());
        faq.setAnswer(faqRequest.getAnswer());
        faq.setCreatedAt(faqRequest.getCreatedAt());

        return faqRepository.save(faq);
    }

    public void deleteFaq (String faqId) {
        Faq faq = faqRepository.findById(faqId).orElseThrow(() ->
                new AppException(ErrorCode.FAQ_ID_NOT_FOUND.getCode(),
                        ErrorCode.FAQ_ID_NOT_FOUND.getMessage(), HttpStatus.NOT_FOUND));
        faqRepository.delete(faq);
    }

}
