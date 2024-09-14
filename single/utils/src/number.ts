export function rangeNumber(range: string) {
  const pages = range.split(',').map(pageRange => pageRange.trim())

  const result: number[] = []
  pages.forEach((pageRange) => {
    if (pageRange.includes('-')) {
      const [start, end] = pageRange.split('-').map(Number)
      if (Number.isNaN(start) || Number.isNaN(end))
        return
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
    }
    else {
      const page = Number(pageRange)
      if (!Number.isNaN(page)) {
        result.push(page)
      }
    }
  })

  return result
}
