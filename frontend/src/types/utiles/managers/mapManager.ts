import { FlyToOptions, GeoCodeFeature, MapSource } from '@/types/map';

export abstract class MapManager<T> {
  protected map: T | null = null;
  protected sources: MapSource[] = [];
  protected mapElement: HTMLDivElement | null = null;
  protected mapZoomLevels: MapZoomLevels | undefined;
  protected mapConfig: MapConfig | undefined;

  constructor(mapElement?: HTMLDivElement, config?: MapConfig, mapZoomLevels?: MapZoomLevels) {
    this.mapElement = mapElement || null;
    this.mapZoomLevels = mapZoomLevels || undefined;
    this.mapConfig = config || undefined;
    this.initializeMap(mapElement, config, mapZoomLevels);
  }

  protected abstract initializeMap(mapElement?: HTMLDivElement, config?: MapConfig, mapZoomLevels?: MapZoomLevels): void;

  public get isReady(): boolean {
    return this.map !== null;
  }

  public abstract flyTo(feature?: GeoCodeFeature, position?: [number, number], options?: FlyToOptions): void;

  public abstract highlight(feature: GeoCodeFeature): void;

  public abstract resetMap(duration?: number): void;

  public abstract getMapCanvas(): Promise<HTMLCanvasElement | null>;

  public abstract remove(): void;
}

export type MapConfig = {
  style: string;
  center: [number, number];
  zoom: number;
  minZoom: number;
  pitch: number;
  bearing: number;
};

export type MapZoomLevels = {[key: string]: number} & {
  country: number;
  region: number;
  postcode: number;
  district: number;
  place: number;
  locality: number;
  neighborhood: number;
  address: number;
  poi: number;
  city: number;
};
