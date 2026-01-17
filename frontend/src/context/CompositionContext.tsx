import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  Composition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
  BaseSegment,
  CreateBaseSegmentRequest,
  UpdateBaseSegmentRequest,
  OverlayLayer,
  OverlayLayerSummary,
  CreateOverlayLayerRequest,
  UpdateOverlayLayerRequest,
  LayerKeyframe,
  AddKeyframeRequest,
  UpdateKeyframeRequest,
  LayerTransition,
  SetTransitionRequest,
} from '@/lib/types';
import { useCompositionApi, useOverlayLayerApi } from './ApiContext';
import { useTeam } from './TeamContext';
import { useProject } from './ProjectContext';

interface CompositionContextType {
  // State
  composition: Composition | null;
  selectedLayer: OverlayLayer | null;
  loading: boolean;
  error: string | null;

  // Composition Actions
  loadComposition: () => Promise<void>;
  createComposition: (data?: CreateCompositionRequest) => Promise<Composition>;
  updateComposition: (data: UpdateCompositionRequest) => Promise<Composition>;
  deleteComposition: () => Promise<void>;

  // Base Segment (Camera) Actions
  addBaseSegment: (data: CreateBaseSegmentRequest) => Promise<BaseSegment>;
  updateBaseSegment: (segmentId: string, data: UpdateBaseSegmentRequest) => Promise<BaseSegment>;
  deleteBaseSegment: (segmentId: string) => Promise<void>;
  reorderBaseSegments: (segmentIds: string[]) => Promise<void>;

  // Overlay Layer Actions
  addLayer: (data: CreateOverlayLayerRequest) => Promise<OverlayLayer>;
  selectLayer: (layerId: string) => Promise<void>;
  updateLayer: (layerId: string, data: UpdateOverlayLayerRequest) => Promise<OverlayLayer>;
  deleteLayer: (layerId: string) => Promise<void>;
  reorderLayers: (layerIds: string[]) => Promise<void>;
  clearSelectedLayer: () => void;

  // Keyframe Actions
  addKeyframe: (layerId: string, data: AddKeyframeRequest) => Promise<LayerKeyframe>;
  updateKeyframe: (layerId: string, keyframeId: string, data: UpdateKeyframeRequest) => Promise<LayerKeyframe>;
  deleteKeyframe: (layerId: string, keyframeId: string) => Promise<void>;

  // Transition Actions
  setTransition: (fromLayerId: string, toLayerId: string, data: SetTransitionRequest) => Promise<LayerTransition>;
  removeTransition: (layerId: string) => Promise<void>;
}

const CompositionContext = createContext<CompositionContextType | undefined>(undefined);

export function CompositionProvider({ children }: { children: ReactNode }) {
  const compositionApi = useCompositionApi();
  const layerApi = useOverlayLayerApi();
  const { currentTeam } = useTeam();
  const { currentProject } = useProject();

  const [composition, setComposition] = useState<Composition | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<OverlayLayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getIds = useCallback(() => {
    if (!currentTeam || !currentProject) {
      throw new Error('No team or project selected');
    }
    return { teamId: currentTeam.team.id, projectId: currentProject.id };
  }, [currentTeam, currentProject]);

  // Composition Actions
  const loadComposition = useCallback(async () => {
    const { teamId, projectId } = getIds();

    setLoading(true);
    setError(null);
    try {
      const data = await compositionApi.getComposition(teamId, projectId);
      setComposition(data);
    } catch (err) {
      // Composition might not exist yet
      setComposition(null);
      if (err instanceof Error && !err.message.includes('not found')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [compositionApi, getIds]);

  const createComposition = useCallback(
    async (data?: CreateCompositionRequest): Promise<Composition> => {
      const { teamId, projectId } = getIds();

      setLoading(true);
      setError(null);
      try {
        const comp = await compositionApi.createComposition(teamId, projectId, data);
        setComposition(comp);
        return comp;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create composition';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [compositionApi, getIds]
  );

  const updateComposition = useCallback(
    async (data: UpdateCompositionRequest): Promise<Composition> => {
      const { teamId, projectId } = getIds();

      setLoading(true);
      setError(null);
      try {
        const comp = await compositionApi.updateComposition(teamId, projectId, data);
        setComposition(comp);
        return comp;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update composition';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [compositionApi, getIds]
  );

  const deleteComposition = useCallback(async (): Promise<void> => {
    const { teamId, projectId } = getIds();

    setLoading(true);
    setError(null);
    try {
      await compositionApi.deleteComposition(teamId, projectId);
      setComposition(null);
      setSelectedLayer(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete composition';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [compositionApi, getIds]);

  // Base Segment Actions
  const addBaseSegment = useCallback(
    async (data: CreateBaseSegmentRequest): Promise<BaseSegment> => {
      const { teamId, projectId } = getIds();

      try {
        const segment = await compositionApi.createBaseSegment(teamId, projectId, data);
        await loadComposition();
        return segment;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add base segment';
        setError(message);
        throw err;
      }
    },
    [compositionApi, getIds, loadComposition]
  );

  const updateBaseSegment = useCallback(
    async (segmentId: string, data: UpdateBaseSegmentRequest): Promise<BaseSegment> => {
      const { teamId, projectId } = getIds();

      try {
        const segment = await compositionApi.updateBaseSegment(teamId, projectId, segmentId, data);
        await loadComposition();
        return segment;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update base segment';
        setError(message);
        throw err;
      }
    },
    [compositionApi, getIds, loadComposition]
  );

  const deleteBaseSegment = useCallback(
    async (segmentId: string): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await compositionApi.deleteBaseSegment(teamId, projectId, segmentId);
        await loadComposition();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete base segment';
        setError(message);
        throw err;
      }
    },
    [compositionApi, getIds, loadComposition]
  );

  const reorderBaseSegments = useCallback(
    async (segmentIds: string[]): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await compositionApi.reorderBaseSegments(teamId, projectId, { segment_ids: segmentIds });
        await loadComposition();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder base segments';
        setError(message);
        throw err;
      }
    },
    [compositionApi, getIds, loadComposition]
  );

  // Overlay Layer Actions
  const addLayer = useCallback(
    async (data: CreateOverlayLayerRequest): Promise<OverlayLayer> => {
      const { teamId, projectId } = getIds();

      try {
        const layer = await layerApi.createOverlayLayer(teamId, projectId, data);
        await loadComposition();
        return layer;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add layer';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, loadComposition]
  );

  const selectLayer = useCallback(
    async (layerId: string): Promise<void> => {
      const { teamId, projectId } = getIds();

      setLoading(true);
      try {
        const layer = await layerApi.getOverlayLayer(teamId, projectId, layerId);
        setSelectedLayer(layer);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load layer';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [layerApi, getIds]
  );

  const updateLayer = useCallback(
    async (layerId: string, data: UpdateOverlayLayerRequest): Promise<OverlayLayer> => {
      const { teamId, projectId } = getIds();

      try {
        const layer = await layerApi.updateOverlayLayer(teamId, projectId, layerId, data);
        if (selectedLayer?.id === layerId) {
          setSelectedLayer(layer);
        }
        await loadComposition();
        return layer;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update layer';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, loadComposition]
  );

  const deleteLayer = useCallback(
    async (layerId: string): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await layerApi.deleteOverlayLayer(teamId, projectId, layerId);
        if (selectedLayer?.id === layerId) {
          setSelectedLayer(null);
        }
        await loadComposition();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete layer';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, loadComposition]
  );

  const reorderLayers = useCallback(
    async (layerIds: string[]): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await layerApi.reorderOverlayLayers(teamId, projectId, { layer_ids: layerIds });
        await loadComposition();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder layers';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, loadComposition]
  );

  const clearSelectedLayer = useCallback(() => {
    setSelectedLayer(null);
  }, []);

  // Keyframe Actions
  const addKeyframe = useCallback(
    async (layerId: string, data: AddKeyframeRequest): Promise<LayerKeyframe> => {
      const { teamId, projectId } = getIds();

      try {
        const keyframe = await layerApi.addKeyframe(teamId, projectId, layerId, data);
        if (selectedLayer?.id === layerId) {
          await selectLayer(layerId);
        }
        return keyframe;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add keyframe';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, selectLayer]
  );

  const updateKeyframe = useCallback(
    async (layerId: string, keyframeId: string, data: UpdateKeyframeRequest): Promise<LayerKeyframe> => {
      const { teamId, projectId } = getIds();

      try {
        const keyframe = await layerApi.updateKeyframe(teamId, projectId, layerId, keyframeId, data);
        if (selectedLayer?.id === layerId) {
          await selectLayer(layerId);
        }
        return keyframe;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update keyframe';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, selectLayer]
  );

  const deleteKeyframe = useCallback(
    async (layerId: string, keyframeId: string): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await layerApi.deleteKeyframe(teamId, projectId, layerId, keyframeId);
        if (selectedLayer?.id === layerId) {
          await selectLayer(layerId);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete keyframe';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, selectLayer]
  );

  // Transition Actions
  const setTransition = useCallback(
    async (fromLayerId: string, toLayerId: string, data: SetTransitionRequest): Promise<LayerTransition> => {
      const { teamId, projectId } = getIds();

      try {
        const transition = await layerApi.setTransition(teamId, projectId, fromLayerId, toLayerId, data);
        if (selectedLayer?.id === fromLayerId) {
          await selectLayer(fromLayerId);
        }
        return transition;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to set transition';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, selectLayer]
  );

  const removeTransition = useCallback(
    async (layerId: string): Promise<void> => {
      const { teamId, projectId } = getIds();

      try {
        await layerApi.removeTransition(teamId, projectId, layerId);
        if (selectedLayer?.id === layerId) {
          await selectLayer(layerId);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove transition';
        setError(message);
        throw err;
      }
    },
    [layerApi, getIds, selectedLayer, selectLayer]
  );

  return (
    <CompositionContext.Provider
      value={{
        composition,
        selectedLayer,
        loading,
        error,
        loadComposition,
        createComposition,
        updateComposition,
        deleteComposition,
        addBaseSegment,
        updateBaseSegment,
        deleteBaseSegment,
        reorderBaseSegments,
        addLayer,
        selectLayer,
        updateLayer,
        deleteLayer,
        reorderLayers,
        clearSelectedLayer,
        addKeyframe,
        updateKeyframe,
        deleteKeyframe,
        setTransition,
        removeTransition,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
}

export function useComposition() {
  const context = useContext(CompositionContext);
  if (!context) {
    throw new Error('useComposition must be used within CompositionProvider');
  }
  return context;
}
