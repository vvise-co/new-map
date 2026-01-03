package com.vvise.new_map.service

import com.vvise.new_map.config.AuthProperties
import com.vvise.new_map.config.CacheConfig
import com.vvise.new_map.dto.TokenIntrospectionResponse
import com.vvise.new_map.security.AuthenticatedUser
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

/**
 * Service for validating tokens via the auth server's introspection endpoint.
 * Results are cached to minimize network calls.
 *
 * No JWT_SECRET required - tokens are validated by the auth server.
 */
@Service
class TokenIntrospectionService(
    private val authProperties: AuthProperties
) {
    private val logger = LoggerFactory.getLogger(TokenIntrospectionService::class.java)
    private val restTemplate = RestTemplate()

    /**
     * Introspect a token with the auth server.
     * Results are cached for 5 minutes to reduce auth server load.
     *
     * @param token The access token to validate
     * @return TokenIntrospectionResponse with user info if valid, or inactive response if invalid
     */
    @Cacheable(value = [CacheConfig.TOKEN_CACHE], key = "#token", unless = "#result == null || !#result.active")
    fun introspect(token: String): TokenIntrospectionResponse? {
        val introspectUrl = "${authProperties.authServerUrl}/api/auth/introspect"
        logger.debug("Introspecting token with auth server at: $introspectUrl")

        return try {
            val headers = HttpHeaders().apply {
                contentType = MediaType.APPLICATION_JSON
            }
            val body = mapOf("token" to token)
            val entity = HttpEntity(body, headers)

            val response = restTemplate.postForEntity(
                introspectUrl,
                entity,
                TokenIntrospectionResponse::class.java
            )

            val result = response.body
            logger.debug("Introspection result: active=${result?.active}, sub=${result?.sub}")
            result
        } catch (ex: Exception) {
            logger.error("Failed to introspect token with auth server at $introspectUrl: ${ex.message}", ex)
            null
        }
    }

    /**
     * Validate token and return AuthenticatedUser if valid.
     *
     * @param token The access token to validate
     * @return AuthenticatedUser if token is valid, null otherwise
     */
    fun validateAndGetUser(token: String): AuthenticatedUser? {
        val response = introspect(token) ?: return null

        if (!response.active) {
            return null
        }

        val sub = response.sub ?: return null
        val email = response.email ?: return null

        return AuthenticatedUser(
            sub = sub,
            email = email,
            name = response.name ?: email,
            roles = response.getRolesList(),
            picture = response.picture,
            emailVerified = response.emailVerified,
            givenName = response.givenName,
            familyName = response.familyName
        )
    }
}
