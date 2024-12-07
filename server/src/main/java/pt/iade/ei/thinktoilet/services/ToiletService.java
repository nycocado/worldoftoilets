package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pt.iade.ei.thinktoilet.exceptions.NotFoundException;
import pt.iade.ei.thinktoilet.models.dtos.ToiletDTO;
import pt.iade.ei.thinktoilet.models.entities.Toilet;
import pt.iade.ei.thinktoilet.models.mappers.ToiletMapper;
import pt.iade.ei.thinktoilet.models.response.ApiResponse;
import pt.iade.ei.thinktoilet.repositories.*;

import java.io.File;
import java.util.*;

@Service
public class ToiletService {
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private ToiletPagingRepository toiletPagingRepository;
    @Autowired
    private ToiletMapper toiletMapper;

    private static final String IMAGE_DIR = "/images/";

    public List<Toilet> getToilets() {
        return Optional.ofNullable(toiletRepository.findUsers())
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "all"));
    }

    public List<Toilet> getToiletsByIds(Collection<Integer> ids) {
        return Optional.ofNullable(toiletRepository.findToiletsByIdIn(ids))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "ids"));
    }

    public Toilet getToiletById(int id) {
        return Optional.ofNullable(toiletRepository.findToiletById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "Toilet", "id"));
    }

    public List<Toilet> getToiletsByUserId(int userId) {
        return Optional.ofNullable(toiletRepository.findToiletByUserId(userId))
                .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Toilet", "user id"));
    }

    public List<Toilet> getToiletsNearby(double lat, double lon) {
        return Optional.ofNullable(toiletRepository.findToiletsByDistance(lat, lon))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
    }

    public Page<Toilet> getToiletsPaging(Pageable pageable) {
        return Optional.ofNullable(toiletPagingRepository.findUsers(pageable))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "all"));
    }

    public Page<Toilet> getToiletsNearbyPaging(double lat, double lon, Pageable pageable) {
        return Optional.ofNullable(toiletPagingRepository.findToiletsByDistance(lat, lon, pageable))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
    }

    @Transactional
    public List<ToiletDTO> findAllToilets(){
        List<Toilet> toilets = getToilets();
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByIds(Collection<Integer> ids) {
        List<Toilet> toilets = getToiletsByIds(ids);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public ToiletDTO findToiletById(int id) {
        Toilet toilet = getToiletById(id);
        return toiletMapper.mapToiletDTO(toilet);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByUserId(int userId) {
        List<Toilet> toilets = getToiletsByUserId(userId);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsNearby(double lat, double lon) {
        List<Toilet> toilets = getToiletsNearby(lat, lon);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public Page<ToiletDTO> findAllToiletsPaging(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = getToiletsPaging(pageable);
        return new PageImpl<>(toiletMapper.mapToiletDTOS(toilets.getContent()), pageable, toilets.getTotalElements());
    }

    @Transactional
    public Page<ToiletDTO> findToiletsNearbyPaging(double lat, double lon, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Toilet> toilets = getToiletsNearbyPaging(lat, lon, pageable);
        return new PageImpl<>(toiletMapper.mapToiletDTOS(toilets.getContent()), pageable, toilets.getTotalElements());
    }

    @Transactional
    public ResponseEntity<ApiResponse> uploadImage(int id, MultipartFile image) {
        getToiletById(id);

        if(image.isEmpty()) {
            throw new NotFoundException("Image", "Image", "image");
        }

        if (!Objects.requireNonNull(image.getContentType()).startsWith("image/")) {
            throw new NotFoundException(image.getContentType(), "Image", "image");
        }

        String imagePath = IMAGE_DIR + "T" + id + ".jpeg";

        try {
            File targetFile = new File(imagePath);
            image.transferTo(targetFile);
        } catch (Exception e) {
            throw new NotFoundException(e.getMessage(), "Image", "image");
        }

        ApiResponse response = new ApiResponse(HttpStatus.OK.value(), "Image uploaded successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public Resource getImage(int id) {
        String imagePath = IMAGE_DIR + "T" + id + ".jpeg";
        File file = new File(imagePath);

        if (!file.exists()) {
            throw new NotFoundException(String.valueOf(id), "Image", "image");
        }

        return new FileSystemResource(file);
    }
}