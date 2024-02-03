package org.example.response;

import com.google.gson.Gson;

import java.io.IOException;

import org.example.controller.ThrowingSupplier;
import spark.Response;

public class ResponseEntity<T> {
    final static Gson gson = new Gson();
    final private Response res;
    private ResponseStatus status;
    private String message;
    private T data;

    public ResponseEntity(Response response, ThrowingSupplier<T, NotFoundException> func) {
        res = response;
        try {
            data = func.get();
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

    private void setHeaders(String type) {
        switch (status) {
            case SUCCESS -> res.status(200);
            case NOT_FOUND -> res.status(404);
            case ERROR -> res.status(400);
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.type(type);
    }

    private String sendError(Exception e) {
        status = ResponseStatus.ERROR;
        message = e.getMessage();
        setHeaders("application/json");
        return gson.toJson(new ResponseModel<T>(this));
    }

    public String asJson() {
        setHeaders("application/json");
        return gson.toJson(new ResponseModel<T>(this));
    }

    public String asImg() throws UnsupportedOperationException {
        if (status == ResponseStatus.SUCCESS && data != null) {
            if (data instanceof byte[]) {
                try {
                    byte[] byteArray = (byte[]) data;
                    var outputStream = res.raw().getOutputStream();
                    outputStream.write(byteArray);
                    outputStream.flush();
                    setHeaders("image/jpeg");
                    return "";
                } catch (IOException e) {
                    return sendError(e);
                }
            } else {
                throw new UnsupportedOperationException(
                        "This operation is supported only for byte[] data. Type of data: " + data.getClass());
            }
        } else {
            setHeaders("application/json");
            return gson.toJson(new ResponseModel<T>(this));
        }
    }

    class ResponseModel<TT> {
        final ResponseStatus status;
        final String message;
        final TT data;

        ResponseModel(ResponseEntity<TT> entity) {
            status = entity.status;
            message = entity.message;
            data = entity.data;
        }
    }
}
