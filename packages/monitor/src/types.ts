import type { ErrorMonitor } from './core'

export interface Integration {
  name: string
  install: (monitor: ErrorMonitor) => void
}
export interface ClientInfo {
  url: string
  userAgent: string
  screenSize: string
  timestamp: number
}
export interface BreadcrumbItem {
  type: string
  message: string
  timestamp: number
}
export interface ErrorInfo extends Partial<ClientInfo> {
  type: 'js' | 'promise' | 'resource'
  message: string
  filename?: string
  lineno?: number
  colno?: number
  stack?: string
  extraInfo?: Record<string, any>
}
export interface MonitorOptions {
  url: string
  appId: string
  env?: 'production' | 'development'
  sampleRate?: number
  extraInfo?: Record<string, any>
  beforeSend?: (data: any) => any | false | null
  integrations?: Integration[]
}

export interface ErrorSourceInfo {
  fileName: string
  lineNumber: number
  columnNumber: number
  sourceContent?: string
}
