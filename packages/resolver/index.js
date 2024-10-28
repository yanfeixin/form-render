function GieResolver() {
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('K')) {
        const partialName = name.slice(1)
        return {
          name: `Gie${partialName}`,
          from: `@giegie/components`,
          sideEffects: `@giegie/components/es/${partialName}/style/index.css`
        }
      }
    }
  }
}

module.exports = {
  GieResolver
}
