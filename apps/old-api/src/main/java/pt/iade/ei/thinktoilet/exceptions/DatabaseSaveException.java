package pt.iade.ei.thinktoilet.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class DatabaseSaveException extends RuntimeException {
    public DatabaseSaveException(String entity) {
        super("Could not save " + entity);
    }
}
