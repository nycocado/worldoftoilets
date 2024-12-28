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
                return Optional.ofNullable(toiletRepository.findToiletsByStateTechnicalNameAndForUserId(stateTechnicalName, userId))
                        .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state and user id"));
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByStateTechnicalName(stateTechnicalName))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state"));
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return Optional.ofNullable(toiletRepository.findToiletsForUserId(userId))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "user id"));
        }
        return Optional.ofNullable(toiletRepository.findToilets())
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "all"));
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
                return Optional.ofNullable(toiletRepository.findToiletsByStateTechnicalNameAndForUserId(stateTechnicalName, userId, pageable))
                        .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state and user id"));
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByStateTechnicalName(stateTechnicalName, pageable))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state"));
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return Optional.ofNullable(toiletRepository.findToiletsForUserId(userId, pageable))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "user id"));
        }
        return Optional.ofNullable(toiletRepository.findToilets(pageable))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "all"));
    }

    public Toilet getToiletById(int id) {
        return Optional.ofNullable(toiletRepository.findToiletById(id))
                .orElseThrow(() -> new NotFoundException(String.valueOf(id), "Toilet", "id"));
    }

    public List<Toilet> getToiletsByIds(Collection<Integer> ids) {
        return Optional.ofNullable(toiletRepository.findToiletsByIds(ids))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "ids"));
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
                return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndStateAndForUserId(stateTechnicalName, lat, lon, userId))
                        .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state and user id"));
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndState(stateTechnicalName, lat, lon))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndForUserId(lat, lon, userId))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby and user id"));
        }
        return Optional.ofNullable(toiletRepository.findToiletsByDistance(lat, lon))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
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
                return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndStateAndForUserId(stateTechnicalName, lat, lon, userId, pageable))
                        .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "state and user id"));
            }

            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndState(stateTechnicalName, lat, lon, pageable))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
        }

        if (userId != null) {
            if (!userService.existsUserById(userId)) {
                throw new NotFoundException(String.valueOf(userId), "User", "id");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByDistanceAndForUserId(lat, lon, userId, pageable))
                    .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby and user id"));
        }
        return Optional.ofNullable(toiletRepository.findToiletsByDistance(lat, lon, pageable))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "nearby"));
    }

    public List<Toilet> getToiletsByUserId(String stateTechnicalName, int userId) {
        if (stateTechnicalName != null) {
            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByUserIdAndState(stateTechnicalName, userId))
                    .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Toilet", "user id"));
        } else {
            return Optional.ofNullable(toiletRepository.findToiletsByUserId(userId))
                    .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Toilet", "user id"));
        }
    }

    public List<Toilet> getToiletsByUserId(String stateTechnicalName, int userId, Pageable pageable) {
        if (stateTechnicalName != null) {
            if (!stateService.existsStateByTechnicalName(stateTechnicalName)) {
                throw new NotFoundException(stateTechnicalName, "State", "technical name");
            }
            return Optional.ofNullable(toiletRepository.findToiletsByUserIdAndState(stateTechnicalName, userId, pageable))
                    .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Toilet", "user id"));
        } else {
            return Optional.ofNullable(toiletRepository.findToiletsByUserId(userId, pageable))
                    .orElseThrow(() -> new NotFoundException(String.valueOf(userId), "Toilet", "user id"));
        }
    }

    public List<SearchToilet> getSearchToilets(String query) {
        return Optional.ofNullable(searchToiletRepository.searchToilets(query))
                .orElseThrow(() -> new NotFoundException(query, "Toilet", "search"));
    }

    public List<SearchToilet> getSearchToilets(String query, Pageable pageable) {
        return Optional.ofNullable(searchToiletRepository.searchToilets(query, pageable))
                .orElseThrow(() -> new NotFoundException(query, "Toilet", "search"));
    }

    public List<Toilet> getToiletsByBoundingBox(double maxLat, double minLat, double maxLon, double minLon) {
        return Optional.ofNullable(toiletRepository.findToiletsByBoundingBox(maxLat, minLat, maxLon, minLon))
                .orElseThrow(() -> new NotFoundException("Toilet", "Toilet", "bounding box"));
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
        getToiletById(id);

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
        String imagePath = IMAGE_DIR + "T" + id + ".jpeg";
        File file = new File(imagePath);

        if (!file.exists()) {
            throw new NotFoundException(String.valueOf(id), "Image", "image");
        }

        return new FileSystemResource(file);
    }
}