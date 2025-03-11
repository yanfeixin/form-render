import { SourceMapConsumer } from 'source-map-js'
import type { ErrorSourceInfo } from './types'

type Nullable<T> = T | null

export interface ExtensionErrorOptions {
  source: {
    url: string
  } | boolean
}

export class SourceError {
  private options: Nullable<ExtensionErrorOptions> = null

  constructor(options?: ExtensionErrorOptions) {
    if (options)
      this.options = options
  }

  private parseStackTrace(stack: string): { fileName: string, lineNumber: number, columnNumber: number } | null {
    const lines = stack.split('\n')
    const errorLine = lines.find(line => line.includes('.js:') || line.includes('.ts:'))

    if (!errorLine) {
      return null
    }

    const match = errorLine.match(/(?:at(?:\s+\S.*(?:[\n\r\u2028\u2029]\s*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])|\s{2,})\()?([^\s(]+):(\d+):(\d+)/)
    if (!match) {
      return null
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    const [_, fileName, lineStr, columnStr] = match
    return {
      fileName,
      lineNumber: Number.parseInt(lineStr, 10),
      columnNumber: Number.parseInt(columnStr, 10)
    }
  }

  private async fetchSourceMap(fileName: string): Promise<any | null> {
    try {
      const sourceMapUrl = `${fileName}.map`
      const response = await fetch(sourceMapUrl)

      if (!response.ok) {
        return null
      }

      return await response.json()
    }
    catch (error) {
      console.error('获取 source map 失败:', error)
      return null
    }
  }

  // 通过 source map 获取原始错误位置和源码内容
  public async getErrorSource(
    error: Error | null | undefined
  ): Promise<ErrorSourceInfo | null> {
    if (!error?.stack) {
      return null
    }

    try {
      // 解析错误堆栈
      const stackInfo = this.parseStackTrace(error.stack)
      if (!stackInfo) {
        return null
      }

      // 获取并解析 source map
      const sourceMapData = await this.fetchSourceMap(stackInfo.fileName)
      if (!sourceMapData) {
        return stackInfo
      }

      const consumer = new SourceMapConsumer(sourceMapData)
      const originalPosition = consumer.originalPositionFor({
        line: stackInfo.lineNumber,
        column: stackInfo.columnNumber
      })

      if (!originalPosition.source) {
        return stackInfo
      }

      // 获取原始源码内容
      const sourceContent = consumer.sourceContentFor(originalPosition.source)
      const sourceLines = sourceContent?.split('\n') || []
      const relevantCode = sourceLines[originalPosition.line - 1] || ''

      return {
        fileName: originalPosition.source,
        lineNumber: originalPosition.line || 0,
        columnNumber: originalPosition.column || 0,
        sourceContent: relevantCode
      }
    }
    catch (error) {
      console.error('分析错误源码失败:', error)
      return null
    }
  }
}
