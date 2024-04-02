package com.example.photoapp.data.dto

sealed class BaseResponse<out T> {
    data class Success<out T>(val data: T? = null) :
            BaseResponse<T>()
    data class Loading(val nothing: Nothing? = null) :
        BaseResponse<Nothing>()
    data class Error(val data: String?) :
        BaseResponse<Nothing>()
}
