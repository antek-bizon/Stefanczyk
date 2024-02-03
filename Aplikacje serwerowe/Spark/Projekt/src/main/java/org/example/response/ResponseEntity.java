package org.example.response;

import com.google.gson.Gson;
import org.example.controller.ThrowingSupplier;
import spark.Request;
import spark.Response;

public class ResponseEntity {
    final private Response res;
    private ResponseStatus status;
    private String message;
    private Object data;

    public ResponseEntity(Response response, ThrowingSupplier<Object, NotFoundException> func) {
        res = response;
        try {
            data = func.get();
//            data = new ArrayList<Integer>();
            status = ResponseStatus.SUCCESS;
            message = "operation completed successfully";
        } catch (NotFoundException e) {
            status = ResponseStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = ResponseStatus.ERROR;
            message = e.getMessage();
        }
    }

    private void setHeaders() {
        switch (status) {
            case SUCCESS -> res.status(200);
            case NOT_FOUND -> res.status(404);
            case ERROR -> res.status(400);
        }
        res.header("Access-Control-Allow-Origin", "*");
    }

    public String asJson() {
        setHeaders();
        res.type("application/json");
        var gson = new Gson();
        return gson.toJson(new ResponseModel(this));
    }

    static class ResponseModel {
        final ResponseStatus status;
        final String message;
        final Object data;

        ResponseModel(ResponseEntity entity) {
            status = entity.status;
            message = entity.message;
            data = entity.data;
        }
    }
}


