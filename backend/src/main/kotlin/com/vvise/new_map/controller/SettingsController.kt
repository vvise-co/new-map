package com.vvise.new_map.controller

import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class SettingsController {

    @GetMapping("/settings")
    fun getSettings(@CurrentUser user: AuthenticatedUser): Map<String, Any?> {
        return emptyMap()
    }
}