export function getClientInfo() {
  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timestamp: Date.now()
  }
}
