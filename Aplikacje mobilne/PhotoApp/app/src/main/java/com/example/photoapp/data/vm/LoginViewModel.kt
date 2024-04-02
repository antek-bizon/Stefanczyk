package com.example.photoapp.data.vm

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.photoapp.data.dto.BaseResponse
import com.example.photoapp.data.dto.LoginRequest
import com.example.photoapp.data.dto.LoginResponse
import com.example.photoapp.data.repositories.UserRepository
import kotlinx.coroutines.launch

class LoginViewModel(application: Application): AndroidViewModel(application) {
    val userRepo = UserRepository()
    var loginResult: MutableLiveData<BaseResponse<LoginResponse>> = MutableLiveData()

    fun loginUser(email: String, password: String) {
        loginResult.value = BaseResponse.Loading()
        viewModelScope.launch {
            try {
                val loginRequest = LoginRequest(email, password)
                val response = userRepo.loginUser(loginRequest)

                if (response?.code() == 200) {
                    loginResult.value = BaseResponse.Success(response.body())
                } else {
                    loginResult.value = BaseResponse.Error(response?.message())
                }
            } catch (ex: Exception) {
                loginResult.value = BaseResponse.Error(ex.message)
            }
        }
    }
}