package com.example.photoapp.data.api

import com.example.photoapp.data.dto.request.ConfirmRequest
import com.example.photoapp.data.dto.request.LoginRequest
import com.example.photoapp.data.dto.request.RegisterRequest
import com.example.photoapp.data.dto.response.ConfirmResponse
import com.example.photoapp.data.dto.response.LoginResponse
import com.example.photoapp.data.dto.response.RegisterResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface UserApi {
    @POST("/api/auth/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest) : Response<LoginResponse>

    @POST("/api/auth/register")
    suspend fun registerUser(@Body registerRequest: RegisterRequest) : Response<RegisterResponse>

    @POST("/api/auth/confirm")
    suspend fun confirmUser(@Body confirmRequest: ConfirmRequest) : Response<ConfirmResponse>

    companion object {
        fun getApi(): UserApi? {
            return ApiClient.client?.create(UserApi::class.java)
        }
    }
}