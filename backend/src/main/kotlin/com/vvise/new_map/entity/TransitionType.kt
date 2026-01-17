package com.vvise.new_map.entity

enum class TransitionType {
    NONE,       // No transition
    FLYTO,      // Smooth camera flight
    FADE,       // Opacity transition
    INSTANT,    // Jump cut
    EASE_TO,    // Smooth ease
    JUMP_TO     // Instant camera move
}
