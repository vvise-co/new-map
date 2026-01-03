package com.vvise.new_map.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class CorsConfig {

    @Value("\${cors.allowed-origins}")
    private lateinit var allowedOrigins: String

    @Value("\${cors.allowed-methods}")
    private lateinit var allowedMethods: String

    @Value("\${cors.allowed-headers}")
    private lateinit var allowedHeaders: String

    @Value("\${cors.allow-credentials}")
    private var allowCredentials: Boolean = true

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOrigins = this@CorsConfig.allowedOrigins.split(",").map { it.trim() }
            allowedMethods = this@CorsConfig.allowedMethods.split(",").map { it.trim() }
            // Handle "*" for all headers or parse comma-separated list
            allowedHeaders = if (this@CorsConfig.allowedHeaders == "*") {
                listOf("*")
            } else {
                this@CorsConfig.allowedHeaders.split(",").map { it.trim() }
            }
            allowCredentials = this@CorsConfig.allowCredentials
            // Expose Authorization header to frontend
            exposedHeaders = listOf("Authorization")
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }
}
