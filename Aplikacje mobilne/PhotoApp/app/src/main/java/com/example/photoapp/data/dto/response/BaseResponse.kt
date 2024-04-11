package com.example.photoapp.data.dto.response

import retrofit2.Response

sealed class BaseResponse<out T> {
    data class Success<out T>(val data: T? = null) :
            BaseResponse<T>()
    data class Loading(val nothing: Nothing? = null) :
        BaseResponse<Nothing>()
    data class Error(val msg: String?) :
        BaseResponse<Nothing>()
}

fun <T>handleResponse(response: Response<T>?): BaseResponse<T> {
    if (response != null) {
        if (response.isSuccessful) {
            return BaseResponse.Success(response.body())
        }
        return BaseResponse.Error(getError(response.errorBody()?.string()))
    }
    return BaseResponse.Error("No response from server")
}