package com.example.photoapp.data.api

import com.example.photoapp.data.dto.LoginRequest
import com.example.photoapp.data.dto.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface UserApi {
    @POST("/api/auth/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest) : Response<LoginResponse>

    companion object {
        fun getApi(): UserApi? {
            return ApiClient.client?.create(UserApi::class.java)
        }
    }
}