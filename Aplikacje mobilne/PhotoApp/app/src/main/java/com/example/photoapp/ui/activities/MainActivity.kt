package com.example.photoapp.ui.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import com.example.photoapp.data.SessionManager
import com.example.photoapp.data.dto.response.BaseResponse
import com.example.photoapp.data.dto.response.LoginResponse
import com.example.photoapp.data.dto.response.RegisterResponse
import com.example.photoapp.data.vm.UserViewModel
import com.example.photoapp.ui.adapters.AuthenticationPagerAdapter
import com.example.photoapp.databinding.ActivityMainBinding
import com.example.photoapp.ui.fragments.LoginFragment
import com.example.photoapp.ui.fragments.RegisterFragment
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val viewModel by viewModels<UserViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view: View = binding.root
        setContentView(view)

        val token = SessionManager.getToken(this)
        if (!token.isNullOrBlank()) {
            navigateToHome()
        }

        val snackbar = Snackbar.make(
            binding.root,
            "Registration successful!",
            Snackbar.LENGTH_INDEFINITE
        )

        viewModel.loginResult.observe(this) {
            when (it) {
                is BaseResponse.Loading -> {
                    showLoading()
                }
                is BaseResponse.Success -> {
                    hideLoading()
                    processLogin(it.data)
                }
                is BaseResponse.Error -> {
                    hideLoading()
                    processError(it.msg)
                }
                else -> {
                    hideLoading()
                }
            }
        }

        viewModel.registerResult.observe(this) {
            when (it) {
                is BaseResponse.Loading -> {
                    showLoading()
                }
                is BaseResponse.Success -> {
                    hideLoading()
                    val data = it.data
                    if (data != null) {
                        snackbar.setAction("Confirm") {
                            doConfirm(data)
                        }
                        snackbar.show()
                    }
                }
                is BaseResponse.Error -> {
                    hideLoading()
                    processError(it.msg)
                }
                else -> {
                    hideLoading()
                }
            }
        }

        viewModel.confirmResult.observe(this) {
            when (it) {
                is BaseResponse.Loading -> {
                    showLoading()
                }
                is BaseResponse.Success -> {
                    hideLoading()
                    if (it.data != null) {
                        snackbar.dismiss()
                        showToast(it.data.msg)
                    } else {
                        showToast("User confirmed successfully")
                    }
                }
                is BaseResponse.Error -> {
                    hideLoading()
                    processError(it.msg)
                }
                else -> {
                    hideLoading()
                }
            }
        }

        val fragments = listOf(LoginFragment(), RegisterFragment())
        val authAdapter = AuthenticationPagerAdapter(fragments, supportFragmentManager, lifecycle)
        binding.viewPager.adapter = authAdapter
    }


    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY)
        startActivity(intent)
    }

    private fun doConfirm(response: RegisterResponse) {
        viewModel.confirmUser(response.token)
    }

    private fun showLoading() {
        binding.progressBarHolder.visibility = View.VISIBLE
    }

    private fun hideLoading() {
        binding.progressBarHolder.visibility = View.INVISIBLE
    }

    private fun processLogin(data: LoginResponse?) {
        showToast("Successful login")
        if (!data?.token.isNullOrEmpty()) {
            data?.token?.let {
                SessionManager.saveAuthToken(this, it)
            }
            navigateToHome()
        }
    }

    private fun processError(msg: String?) {
        Log.d("xxe", msg.toString())
        if (msg != null) {
            showToast("$msg")
        } else {
            showToast("Unknown error")
        }
    }

    private fun showToast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }
}