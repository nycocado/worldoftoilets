package pt.iade.ei.thinktoilet.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ApiKeyAuthenticationService {
    @Value("${API_KEY_ADMIN}")
    private String apiKeyAdmin;
    @Value("${API_KEY_USER}")
    private String apiKeyUser;

    private final Map<String, String> apiKeys = new HashMap<>();

    @PostConstruct
    public void init() {
        apiKeys.put(apiKeyAdmin, "ROLE_ADMIN");
        apiKeys.put(apiKeyUser, "ROLE_USER");
    }

    public boolean validateApiKey(String apiKey) {
        return apiKeys.containsKey(apiKey);
    }

    public String getRole(String apiKey) {
        return apiKeys.get(apiKey);
    }
}
