import { reportApi } from '../../api'

interface ErrorInfo {
  token: string
  custom?: { [key: string]: any }
  terminal: string
  platform: string
  wd?: any
  events: string[]
}

export function reportInitEvent(info: ErrorInfo) {
  const userAgent = navigator.userAgent
  if (info.events.includes('error')) {
    errorReportEvent(info, userAgent)
  }
  if (info.events.includes('unhandledrejection')) {
    rejectionReportEvent(info, userAgent)
  }
}

export function errorReportEvent(info: ErrorInfo, userAgent: string) {
  const selectWindow = info.wd || window
  selectWindow.onerror = (
    message: Event | string,
    source: any,
    lineno: any,
    colno: any,
    error: any
  ) => {
    const errorData = {
      message,
      source,
      lineno,
      colno,
      stack: error ? error.stack : ''
    }
    reportError(errorData, info, userAgent, 'error')
  }
}

export function rejectionReportEvent(info: ErrorInfo, userAgent: string) {
  const selectWindow = info.wd || window
  selectWindow.onunhandledrejection = (event: PromiseRejectionEvent) => {
    const errorData = {
      reason: event.reason
    }
    reportError(errorData, info, userAgent, 'reject')
  }
}

export async function reportError(errorData: any, info: ErrorInfo, userAgent: string, type: string) {
  const data = {
    token: info.token,
    terminal: info.terminal,
    platform: info.platform,
    terminalInfo: userAgent,
    level: 'error',
    message: '',
    traceId: '',
    type: '',
    apiUrl: '',
    remark: JSON.stringify(info.custom)
  }
  if (type === 'reject') {
    data.message = JSON.stringify(errorData.reason)
    data.traceId = errorData.reason.traceId
    data.apiUrl = errorData.reason.url
    data.type = 'unhandledrejection'
  }
  if (type === 'error') {
    data.message = errorData.stack || errorData.message
    data.type = errorData.message ? errorData.message.split(':')[0] : ''
  }
  try {
    await reportApi.errorReport({ data })
  }
  catch (error) {
    console.error('ErrorReporter report error:', error)
  }
}
