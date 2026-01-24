import { GeoCodeFeature, FlyToOptions } from '@/types/map';
import { MapConfig, MapManager, MapZoomLevels } from '@/types/utiles';
import { Map as GlMap } from 'maplibre-gl';

export class MapLibreMapManager extends MapManager<GlMap> {
  protected initializeMap(mapElement?: HTMLDivElement, config?: MapConfig, _?: MapZoomLevels): void {
    if (mapElement) {
      this.map = new GlMap({
        container: mapElement,
        style: config?.style,
        center: config?.center,
        zoom: config?.zoom,
        minZoom: config?.minZoom,
        maplibreLogo: false,
        attributionControl: false,
        canvasContextAttributes: {
          preserveDrawingBuffer: true,
        },
        renderWorldCopies: false,
      });

      // disable map rotation using right click + drag
      this.map.dragRotate.disable();
      // disable map rotation using keyboard
      this.map.keyboard.disable();
      // disable map rotation using touch rotation gesture
      this.map.touchZoomRotate.disableRotation();

      this.map.on('error', (e) => {
        console.error('Map error:', e);
      });
    }
  }
  public flyTo(feature?: GeoCodeFeature, position?: [number, number], options?: FlyToOptions): void {
    if (!this.map || (!feature && !position)) {
      return;
    }
    const placeType = feature?.type || 'place';
    const minZoom = this.map.getMinZoom();
    const targetZoom = Math.max((this.mapZoomLevels?.[placeType] || 12) - 1, minZoom);
    const center = feature?.geometry?.center || position;

    const flyToOptions = {
      center: center,
      zoom: targetZoom,
      essential: options?.animate ?? true,
      animation: options?.animate ?? true,
    };

    if (options?.easing) {
      (flyToOptions as any).easing = options.easing;
    }
    if (options?.pitch) {
      (flyToOptions as any).pitch = options.pitch;
    }
    if (options?.roll) {
      (flyToOptions as any).roll = options.roll;
    }
    if (options?.elevation) {
      (flyToOptions as any).elevation = options.elevation;
    }
    if (options?.offset) {
      (flyToOptions as any).offset = options.offset;
    }
    if (options?.curve) {
      (flyToOptions as any).curve = options.curve;
    }
    if (options?.speed) {
      (flyToOptions as any).speed = options.speed;
    }
    if (options?.duration) {
      (flyToOptions as any).duration = options.duration * 1000;
    }

    this.map.flyTo({
      ...flyToOptions,
    });
  }
  public highlight(feature: GeoCodeFeature): void {
    if (!this.map) {
      return;
    }
    // Implement highlight logic here
    if (this.map.getLayer('region-boundary')) {
      this.map.removeLayer('region-boundary');
    }
    if (this.map.getLayer('region-points')) {
      this.map.removeLayer('region-points');
    }
    if (this.map.getLayer('region-boundary-border')) {
      this.map.removeLayer('region-boundary-border');
    }
    if (this.map.getSource('search-result')) {
      this.map.removeSource('search-result');
    }

    if (feature.geometry) {
      this.map.addSource('search-result', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties || {},
        },
      });
    }

    this.map.addLayer({
      id: 'region-boundary',
      type: 'fill',
      source: 'search-result',
      paint: {
        'fill-color': '#f44b4bff',
        'fill-opacity': 0.3,
      },
      filter: ['==', '$type', 'Polygon'],
    });

    this.map.addLayer({
      id: 'region-boundary-border',
      type: 'line',
      source: 'search-result',
      paint: {
        'line-color': '#f50000ff',
        'line-width': 2,
      },
      filter: ['==', '$type', 'Polygon'],
    });

    this.map.addLayer({
      id: 'region-points',
      type: 'circle',
      source: 'search-result',
      paint: {
        'circle-radius': 6,
        'circle-color': '#B42222',
      },
      filter: ['==', '$type', 'Point'],
    });
  }
  public resetMap(duration?: number): void {
    if (!this.map) {
      return;
    }

    const layers = this.map.getStyle().layers;
    for (const layerId in layers) {
      this.map.removeLayer(layerId);
    }

    const sources = this.map.getStyle().sources;
    for (const sourceId in sources) {
      this.map.removeSource(sourceId);
    }

    this.map.easeTo({
      center: this.mapConfig?.center,
      zoom: this.mapConfig?.zoom,
      duration: duration ?? 500,
    });
  }
  public async getMapCanvas(): Promise<HTMLCanvasElement | null> {
    if (!this.map) {
      return null;
    }

    // Wait for map to finish loading and all tiles to load
    await new Promise<void>((resolve) => {
      const checkMapReady = () => {
        if (this.map?.loaded() && !this.map.isMoving() && !this.map.isZooming() && !this.map.isRotating()) {
          // Additional check for tile loading
          const style = this.map.getStyle();
          const sources = style.sources || {};

          let allTilesLoaded = true;

          // Check if all raster sources have finished loading
          Object.keys(sources).forEach((sourceId) => {
            const src = this.map?.getSource(sourceId);
            if (src && 'loaded' in src && typeof src.loaded === 'function') {
              if (!src.loaded()) {
                allTilesLoaded = false;
              }
            }
          });

          if (allTilesLoaded) {
            // Add a small delay to ensure rendering is complete
            setTimeout(() => resolve(), 300);
          } else {
            setTimeout(checkMapReady, 100);
          }
        } else {
          setTimeout(checkMapReady, 50);
        }
      };
      checkMapReady();
    });

    // Force a repaint to ensure everything is rendered
    this.map.triggerRepaint();

    // Wait a bit more for the repaint
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the map canvas
    return this.map.getCanvas();
  }
  public remove(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
