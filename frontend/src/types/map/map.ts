import { GeoJsonObject } from "./geoJSON";

export interface MapSource {
    id: string;
    type: string;
    data: GeoJsonObject;
}

export interface FlyToOptions {
    pitch?: number;
    roll?: number;
    elevation?: number;
    offset?: [number, number];
    animate?: boolean;
    curve?: number;
    speed?: number;
    duration?: number;
    easing?: (t: number) => number;
}