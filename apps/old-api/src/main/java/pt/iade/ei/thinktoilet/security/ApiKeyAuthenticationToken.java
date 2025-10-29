package pt.iade.ei.thinktoilet.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {
    private final String apiKey;

    public ApiKeyAuthenticationToken(String apiKey, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKey = apiKey;
        setAuthenticated(true); // Define como autenticado, pois a chave foi validada
    }

    @Override
    public Object getCredentials() {
        return apiKey; // Retorna a chave como credencial
    }

    @Override
    public Object getPrincipal() {
        return apiKey; // O "principal" é a chave API, aqui
    }
}
