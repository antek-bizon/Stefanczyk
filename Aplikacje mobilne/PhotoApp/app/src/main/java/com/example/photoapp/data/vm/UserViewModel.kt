package com.example.photoapp.data.vm

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.photoapp.data.dto.request.ConfirmRequest
import com.example.photoapp.data.dto.response.BaseResponse
import com.example.photoapp.data.dto.request.LoginRequest
import com.example.photoapp.data.dto.request.RegisterRequest
import com.example.photoapp.data.dto.response.ConfirmResponse
import com.example.photoapp.data.dto.response.LoginResponse
import com.example.photoapp.data.dto.response.RegisterResponse
import com.example.photoapp.data.dto.response.handleResponse
import com.example.photoapp.data.repositories.UserRepository
import kotlinx.coroutines.launch

class UserViewModel(application: Application): AndroidViewModel(application) {
    private val userRepo = UserRepository()
    var loginResult: MutableLiveData<BaseResponse<LoginResponse>> = MutableLiveData()
    var registerResult: MutableLiveData<BaseResponse<RegisterResponse>> = MutableLiveData()
    var confirmResult: MutableLiveData<BaseResponse<ConfirmResponse>> = MutableLiveData()

    fun loginUser(username: String, password: String) {
        loginResult.value = BaseResponse.Loading()
        viewModelScope.launch {
            try {
                val loginRequest = LoginRequest(username, password)
                val response = userRepo.loginUser(loginRequest)
                loginResult.value = handleResponse(response)
            } catch (ex: Exception) {
                loginResult.value = BaseResponse.Error("Application error: ${ex.message}")
            }
        }
    }

    fun registerUser(username: String, email: String, password: String) {
        registerResult.value = BaseResponse.Loading()
        viewModelScope.launch {
            try {
                val registerRequest = RegisterRequest(username, email, password)
                val response = userRepo.registerUser(registerRequest)
                registerResult.value = handleResponse(response)
            } catch (ex: Exception) {
                registerResult.value = BaseResponse.Error("Application error: ${ex.message}")
            }
        }
    }

    fun confirmUser(token: String) {
        confirmResult.value = BaseResponse.Loading()
        viewModelScope.launch {
            try {
                val confirmRequest = ConfirmRequest(token)
                val response = userRepo.confirmUser(confirmRequest)
                confirmResult.value = handleResponse(response)
            } catch (ex: Exception) {
                confirmResult.value = BaseResponse.Error("Application error: ${ex.message}")
            }
        }
    }
}