import type { AxiosInstance } from 'axios'

declare global {
  interface Window {
    $http: AxiosInstance
  }
  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>
  type DefineFn<T extends [...any]> = (...args: T) => void
}
