package pt.iade.ei.thinktoilet.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {
    public NotFoundException(String id, String elemType, String idName) {
        super(elemType + " with " + idName + " " + id + " not found.");
    }
}