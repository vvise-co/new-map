package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.locationtech.jts.geom.*

@JsonIgnoreProperties(ignoreUnknown = true)
data class GeoJsonGeometry(
    val type: String,
    val coordinates: Any
) {
    companion object {
        private val geometryFactory = GeometryFactory(PrecisionModel(), 4326)

        fun from(geometry: Geometry): GeoJsonGeometry {
            return when (geometry) {
                is Point -> GeoJsonGeometry(
                    type = "Point",
                    coordinates = listOf(geometry.x, geometry.y)
                )
                is LineString -> GeoJsonGeometry(
                    type = "LineString",
                    coordinates = geometry.coordinates.map { listOf(it.x, it.y) }
                )
                is Polygon -> GeoJsonGeometry(
                    type = "Polygon",
                    coordinates = listOf(
                        geometry.exteriorRing.coordinates.map { listOf(it.x, it.y) }
                    ) + (0 until geometry.numInteriorRing).map { i ->
                        geometry.getInteriorRingN(i).coordinates.map { listOf(it.x, it.y) }
                    }
                )
                else -> throw IllegalArgumentException("Unsupported geometry type: ${geometry.geometryType}")
            }
        }

        fun toGeometry(geoJson: GeoJsonGeometry): Geometry {
            return when (geoJson.type.lowercase()) {
                "point" -> {
                    @Suppress("UNCHECKED_CAST")
                    val coords = geoJson.coordinates as List<Number>
                    geometryFactory.createPoint(Coordinate(coords[0].toDouble(), coords[1].toDouble()))
                }
                "linestring" -> {
                    @Suppress("UNCHECKED_CAST")
                    val coords = geoJson.coordinates as List<List<Number>>
                    val coordinates = coords.map { Coordinate(it[0].toDouble(), it[1].toDouble()) }.toTypedArray()
                    geometryFactory.createLineString(coordinates)
                }
                "polygon" -> {
                    @Suppress("UNCHECKED_CAST")
                    val rings = geoJson.coordinates as List<List<List<Number>>>
                    val shell = geometryFactory.createLinearRing(
                        rings[0].map { Coordinate(it[0].toDouble(), it[1].toDouble()) }.toTypedArray()
                    )
                    val holes = if (rings.size > 1) {
                        rings.drop(1).map { ring ->
                            geometryFactory.createLinearRing(
                                ring.map { Coordinate(it[0].toDouble(), it[1].toDouble()) }.toTypedArray()
                            )
                        }.toTypedArray()
                    } else {
                        emptyArray()
                    }
                    geometryFactory.createPolygon(shell, holes)
                }
                else -> throw IllegalArgumentException("Unsupported GeoJSON type: ${geoJson.type}")
            }
        }
    }
}
