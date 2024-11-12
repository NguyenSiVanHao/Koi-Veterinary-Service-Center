package com.koicenter.koicenterbackend.service;

import aj.org.objectweb.asm.commons.Remapper;
import com.koicenter.koicenterbackend.exception.AppException;
import com.koicenter.koicenterbackend.model.entity.News;
import com.koicenter.koicenterbackend.model.request.news.NewsRequest;
import com.koicenter.koicenterbackend.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    NewsRepository newsRepository;
    public List<News> getAllNews() {
        List<News> newsList = new ArrayList<>();
        List<News> list = newsRepository.findAll();
       list.stream().forEach(news -> {
           if(news.isStatus()){
               newsList.add(news);
           }
       });
       return newsList;
    }


    public News getNewsById(String id) {
        News news = newsRepository.findBynewId(id);
        if (news != null && news.isStatus()) {
            return news;
        } else {
            throw new AppException(404, "Newspaper not found", HttpStatus.NOT_FOUND);
        }
    }

    public boolean createNews(NewsRequest news) {
        try {
            News news1 = News.builder()
                    .img(news.getImg())
                    .title(news.getTitle())
                    .content(news.getContent())
                    .preview(news.getPreview())
                    .status(true)
                    .build();
            newsRepository.save(news1);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public boolean updateNews(String newId, NewsRequest newsDetails) {
        try {
        News optionalNews = newsRepository.findBynewId(newId);
            if (optionalNews != null) {
               optionalNews.setTitle(newsDetails.getTitle());
               optionalNews.setContent(newsDetails.getContent());
               optionalNews.setPreview(newsDetails.getPreview());
               optionalNews.setImg(newsDetails.getImg());
                newsRepository.save(optionalNews);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteNews(String newId) {
        try {
            News news = newsRepository.findById(newId).orElseThrow(() -> new AppException(404, "Newspaper not found", HttpStatus.NOT_FOUND));
            news.setStatus(false);
            newsRepository.save(news);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
