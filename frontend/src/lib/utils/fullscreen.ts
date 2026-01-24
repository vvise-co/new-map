export const getFullscreenElement = (): Element | null => {
  if (document.fullscreenEnabled) {
    return document.fullscreenElement;
  } else if ((document as any).webkitFullscreenEnabled) {
    return (document as any).webkitFullscreenElement;
  } else if ((document as any).mozFullScreenEnabled) {
    return (document as any).mozFullScreenElement;
  } else if ((document as any).msFullscreenEnabled) {
    return (document as any).msFullscreenElement;
  } else {
    return null;
  }
}

export const hasEvent = (contentElement: Element, eventName: string): boolean => {
  if (contentElement) {
    return eventName in contentElement;
  } else {
    return false;
  }
}

export const getFullScreenChangeEvent = (contentElement: Element): string | undefined => {
  if (document.fullscreenEnabled && hasEvent(contentElement, 'onfullscreenchange')) {
    return 'fullscreenchange';
  } else if ((document as any).webkitFullscreenEnabled && hasEvent(contentElement, 'onwebkitfullscreenchange')) {
    return 'webkitfullscreenchange';
  } else if ((document as any).mozFullScreenEnabled && hasEvent(contentElement, 'onmozfullscreenchange')) {
    return 'mozfullscreenchange';
  } else if ((document as any).msFullscreenEnabled && hasEvent(contentElement, 'onmsfullscreenchange')) {
    return 'msfullscreenchange';
  } else {
    return;
  }
};

export const getFullScreenCancelMethod = (): (() => Promise<void>) | undefined => {
  if (document.fullscreenEnabled && document.exitFullscreen) {
    return document.exitFullscreen;
  } else if ((document as any).webkitFullscreenEnabled && (document as any).webkitExitFullscreen) {
    return (document as any).webkitExitFullscreen;
  } else if ((document as any).mozFullScreenEnabled && (document as any).mozCancelFullScreen) {
    return (document as any).mozCancelFullScreen;
  } else if ((document as any).msFullscreenEnabled && (document as any).msExitFullscreen) {
    return (document as any).msExitFullscreen;
  } else {
    return;
  }
};

export const getFullScreenRequestMethod = ((contentElement: Element): ((options?: FullscreenOptions) => Promise<void>) | undefined => {
  if (document.fullscreenEnabled && contentElement.requestFullscreen) {
    return contentElement.requestFullscreen;
  } else if ((document as any).webkitFullscreenEnabled && (contentElement as any).webkitRequestFullscreen) {
    return (contentElement as any).webkitRequestFullscreen;
  } else if ((document as any).mozFullScreenEnabled && (contentElement as any).mozRequestFullScreen) {
    return (contentElement as any).mozRequestFullScreen;
  } else if ((document as any).msFullscreenEnabled && (contentElement as any).msRequestFullscreen) {
    return (contentElement as any).msRequestFullscreen;
  } else {
    return;
  }
});