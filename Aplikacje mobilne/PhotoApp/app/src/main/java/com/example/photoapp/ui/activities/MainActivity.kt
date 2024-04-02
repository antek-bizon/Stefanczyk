package com.example.photoapp.ui.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.fragment.app.Fragment
import com.example.photoapp.data.SessionManager
import com.example.photoapp.data.vm.LoginViewModel
import com.example.photoapp.ui.adapters.AuthenticationPagerAdapter
import com.example.photoapp.databinding.ActivityMainBinding
import com.example.photoapp.ui.fragments.LoginFragment
import com.example.photoapp.ui.fragments.RegisterFragment

class MainActivity : AppCompatActivity() {
    private lateinit var activityMainBinding: ActivityMainBinding
    private val viewModel by viewModels<LoginViewModel>()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        activityMainBinding = ActivityMainBinding.inflate(layoutInflater)
        val view: View = activityMainBinding.root
        setContentView(view)

        val token = SessionManager.getToken(this)
        if (!token.isNullOrBlank()) {
//            navigateToHome()
        }

        val fragments = listOf<Fragment>(LoginFragment(), RegisterFragment())
        val authAdapter = AuthenticationPagerAdapter(fragments, supportFragmentManager, lifecycle)
        activityMainBinding.viewPager.adapter = authAdapter
    }
}