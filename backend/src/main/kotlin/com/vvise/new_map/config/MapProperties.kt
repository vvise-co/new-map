package com.vvise.new_map.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "map")
class MapProperties {
    var maptiler: MapTilerProperties = MapTilerProperties()
    var defaults: MapDefaultsProperties = MapDefaultsProperties()

    /**
     * Build the default map configuration for project settings.
     * Returns a Map that matches frontend MapConfig type.
     */
    fun buildDefaultMapConfig(): Map<String, Any> = mapOf(
        "style" to maptiler.getStyleUrl(),
        "center" to listOf(defaults.center.lng, defaults.center.lat),
        "zoom" to defaults.zoom,
        "minZoom" to defaults.minZoom,
        "pitch" to defaults.pitch,
        "bearing" to defaults.bearing
    )
}

class MapTilerProperties {
    var apiKey: String = "BT1N1fSWfjN5SLzJmC0n"
    var mapId: String = "0198086b-cd8f-7c6b-b1d2-cf4970224855"

    fun getStyleUrl(): String =
        "https://api.maptiler.com/maps/$mapId/style.json?key=$apiKey"
}

class MapDefaultsProperties {
    var center: MapCenterProperties = MapCenterProperties()
    var zoom: Int = 5
    var minZoom: Int = 2
    var pitch: Int = 0
    var bearing: Int = 0
}

class MapCenterProperties {
    var lng: Double = 53.688
    var lat: Double = 32.4279
}
