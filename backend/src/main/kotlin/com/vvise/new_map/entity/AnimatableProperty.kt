package com.vvise.new_map.entity

enum class AnimatableProperty {
    // Element transform
    OPACITY,
    SCALE,
    ROTATION,
    OFFSET_X,
    OFFSET_Y,

    // Style properties
    FILL_OPACITY,
    STROKE_OPACITY,
    STROKE_WIDTH,

    // Camera properties (for base segments)
    CAMERA_ZOOM,
    CAMERA_BEARING,
    CAMERA_PITCH
}
