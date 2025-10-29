package pt.iade.ei.thinktoilet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
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
import pt.iade.ei.thinktoilet.models.views.SearchToilet;
import pt.iade.ei.thinktoilet.repositories.SearchToiletRepository;
import pt.iade.ei.thinktoilet.repositories.ToiletRepository;

import java.io.File;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ToiletService {
    @Autowired
    private StateService stateService;
    @Autowired
    private UserService userService;
    @Autowired
    private ToiletRepository toiletRepository;
    @Autowired
    private SearchToiletRepository searchToiletRepository;
    @Autowired
    private ToiletMapper toiletMapper;

    private static final String IMAGE_DIR = "/images/";

    public List<Toilet> getToilets(String stateTechnicalName, Integer userId) {
        if (stateTechnicalName != null) {
            if (userId != null) {
                if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                    throw new NotFoundException(stateTechnicalName, "State", "technical name");
                }
                if (!userService.existsUserById(userId)) {
                    throw new NotFoundException(String.valueOf(userId), "User", "id");
                }
                return toiletRepository.findToiletsByStateTechnicalNameAndForUserId(stateTechnicalName, userId);
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByStateTechnicalName(stateTechnicalName);
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return toiletRepository.findToiletsForUserId(userId);
        }
        return toiletRepository.findToilets();
    }

    public List<Toilet> getToilets(String stateTechnicalName, Integer userId, Pageable pageable) {
        if (stateTechnicalName != null) {
            if (userId != null) {
                if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                    throw new NotFoundException(stateTechnicalName, "State", "technical name");
                }
                if (!userService.existsUserById(userId)) {
                    throw new NotFoundException(String.valueOf(userId), "User", "id");
                }
                return toiletRepository.findToiletsByStateTechnicalNameAndForUserId(stateTechnicalName, userId, pageable);
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByStateTechnicalName(stateTechnicalName, pageable);
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return toiletRepository.findToiletsForUserId(userId, pageable);
        }
        return toiletRepository.findToilets(pageable);
    }

    public Toilet getToiletById(int id) {
        return Optional.ofNullable(toiletRepository.findToiletById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "Toilet", "id"));
    }

    public List<Toilet> getToiletsByIds(Collection<Integer> ids) {
        return toiletRepository.findToiletsByIds(ids);
    }

    public List<Toilet> getToiletsNearby(String stateTechnicalName, double lat, double lon, Integer userId) {
        if (stateTechnicalName != null) {
            if (userId != null) {
                if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                    throw new NotFoundException(stateTechnicalName, "State", "technical name");
                }
                if (!userService.existsUserById(userId)) {
                    throw new NotFoundException(String.valueOf(userId), "User", "id");
                }
                return toiletRepository.findToiletsByDistanceAndStateAndForUserId(stateTechnicalName, lat, lon, userId);
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByDistanceAndState(stateTechnicalName, lat, lon);
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return toiletRepository.findToiletsByDistanceAndForUserId(lat, lon, userId);
        }
        return toiletRepository.findToiletsByDistance(lat, lon);
    }

    public List<Toilet> getToiletsNearby(String stateTechnicalName, double lat, double lon, Integer userId, Pageable pageable) {
        if (stateTechnicalName != null) {
            if (userId != null) {
                if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                    throw new NotFoundException(stateTechnicalName, "State", "technical name");
                }
                if (!userService.existsUserById(userId)) {
                    throw new NotFoundException(String.valueOf(userId), "User", "id");
                }
                return toiletRepository.findToiletsByDistanceAndStateAndForUserId(stateTechnicalName, lat, lon, userId, pageable);
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByDistanceAndState(stateTechnicalName, lat, lon, pageable);
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return toiletRepository.findToiletsByDistanceAndForUserId(lat, lon, userId, pageable);
        }
        return toiletRepository.findToiletsByDistance(lat, lon, pageable);
    }

    public List<Toilet> getToiletsByUserId(String stateTechnicalName, int userId) {
        if (stateTechnicalName != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByUserIdAndState(stateTechnicalName, userId);
        }

        if (!userService.existsUserById(userId)) {
            throw new NotFoundException(String.valueOf(userId), "User", "id");
        }
        return toiletRepository.findToiletsByUserId(userId);
    }

    public List<Toilet> getToiletsByUserId(String stateTechnicalName, int userId, Pageable pageable) {
        if (stateTechnicalName != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return toiletRepository.findToiletsByUserIdAndState(stateTechnicalName, userId, pageable);
        }

        if (!userService.existsUserById(userId)) {
            throw new NotFoundException(String.valueOf(userId), "User", "id");
        }
        return toiletRepository.findToiletsByUserId(userId, pageable);
    }

    public List<SearchToilet> getSearchToilets(String query) {
        return searchToiletRepository.searchToilets(query);
    }

    public List<SearchToilet> getSearchToilets(String query, Pageable pageable) {
        return searchToiletRepository.searchToilets(query, pageable);
    }

    public List<Toilet> getToiletsByBoundingBox(double maxLat, double minLat, double maxLon, double minLon) {
        return toiletRepository.findToiletsByBoundingBox(maxLat, minLat, maxLon, minLon);
    }

    public boolean existsToiletById(int id) {
        return toiletRepository.existsToiletById(id);
    }

    @Transactional
    public List<ToiletDTO> findToilets(String stateTechnicalName, Integer userId) {
        List<Toilet> toilets = getToilets(stateTechnicalName, userId);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToilets(String stateTechnicalName, Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Toilet> toilets = getToilets(stateTechnicalName, userId, pageable);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public ToiletDTO findToiletById(int id) {
        Toilet toilet = getToiletById(id);
        return toiletMapper.mapToiletDTO(toilet);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByIds(Collection<Integer> ids) {
        List<Toilet> toilets = getToiletsByIds(ids);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsNearby(String stateTechnicalName, double lat, double lon, Integer userId) {
        List<Toilet> toilets = getToiletsNearby(stateTechnicalName, lat, lon, userId);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsNearby(String stateTechnicalName, double lat, double lon, Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Toilet> toilets = getToiletsNearby(stateTechnicalName, lat, lon, userId, pageable);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByUserId(String stateTechnicalName, int userId) {
        List<Toilet> toilets = getToiletsByUserId(stateTechnicalName, userId);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByUserId(String stateTechnicalName, int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Toilet> toilets = getToiletsByUserId(stateTechnicalName, userId, pageable);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public List<SearchToilet> searchToilets(String query) {
        return getSearchToilets(query);
    }

    @Transactional
    public List<SearchToilet> searchToilets(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return getSearchToilets(query, pageable);
    }

    @Transactional
    public List<ToiletDTO> findToiletsByBoundingBox(double minLat, double maxLat, double minLon, double maxLon) {
        List<Toilet> toilets = getToiletsByBoundingBox(minLat, maxLat, minLon, maxLon);
        return toiletMapper.mapToiletDTOS(toilets);
    }

    @Transactional
    public ResponseEntity<ApiResponse> uploadImage(int id, MultipartFile image) {
        if (!existsToiletById(id)) {
            throw new NotFoundException(String.valueOf(id), "Toilet", "id");
        }

        if (image.isEmpty()) {
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
        if(!existsToiletById(id)){
            throw new NotFoundException(String.valueOf(id), "Toilet", "id");
        }

        String imagePath = IMAGE_DIR + "T" + id + ".jpeg";
        File file = new File(imagePath);

        if (!file.exists()) {
            throw new NotFoundException(String.valueOf(id), "Image", "image");
        }

        return new FileSystemResource(file);
    }
}