package com.koicenter.koicenterbackend.controller;

import com.koicenter.koicenterbackend.model.entity.News;
import com.koicenter.koicenterbackend.model.request.news.NewsRequest;
import com.koicenter.koicenterbackend.model.response.ResponseObject;
import com.koicenter.koicenterbackend.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
public class NewsController {
    @Autowired
    NewsService newsService;



    @GetMapping
    public ResponseEntity<ResponseObject> getAllNews() {
        List<News> newsList = newsService.getAllNews();
        if(newsList.isEmpty()){
            return ResponseObject.APIRepsonse(404, "No content", HttpStatus.NOT_FOUND,null);
        }
        return ResponseObject.APIRepsonse(200, "Fetched all news successfully", HttpStatus.OK, newsList);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getNewsById(@PathVariable String id) {
        News news = newsService.getNewsById(id);
        if (news != null) {
            return ResponseObject.APIRepsonse(200, "Fetched news successfully", HttpStatus.OK, news);
        } else {
            return ResponseObject.APIRepsonse(404, "News not found", HttpStatus.NOT_FOUND, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @PostMapping("")
    public ResponseEntity<ResponseObject> createNews(@RequestBody NewsRequest news) {
        boolean isCreated = newsService.createNews(news);
        if (isCreated) {
            return ResponseObject.APIRepsonse(200, "Create new news successfully", HttpStatus.OK, null);
        } else {
            return ResponseObject.APIRepsonse(409, "News title already exists", HttpStatus.CONFLICT, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @PutMapping("")
    public ResponseEntity<ResponseObject> updateNews(@RequestParam String newId,@RequestBody NewsRequest newsDetails) {
        boolean isUpdated = newsService.updateNews(newId, newsDetails);
        if (isUpdated) {
            return ResponseObject.APIRepsonse(200, "Update news successfully", HttpStatus.OK, newsDetails);
        } else {
            return ResponseObject.APIRepsonse(400, "Failed to update news", HttpStatus.BAD_REQUEST, null);
        }
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    @DeleteMapping("/{newsId}")
    public ResponseEntity<ResponseObject> deleteNews(@PathVariable String newsId) {
        try {
            boolean isDeleted = newsService.deleteNews(newsId);
            if (isDeleted) {
                return ResponseObject.APIRepsonse(200, "Delete news successfully", HttpStatus.OK, null);
            } else {
                return ResponseObject.APIRepsonse(404, "Not found to delete news", HttpStatus.NOT_FOUND, null);
            }
        } catch (Exception e) {
            return ResponseObject.APIRepsonse(500, "An error occurred while deleting news", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}
