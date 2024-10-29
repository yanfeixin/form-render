import shell from 'shelljs'

export async function removeDist() {
  const componentPath = process.env.KING_COMPONENT_ROOT_PATH
  shell.rm('-rf', `${componentPath}/dist`)
  shell.rm('-rf', `${componentPath}/lib`)
  shell.rm('-rf', `${componentPath}/es`)
  shell.rm('-rf', `${componentPath}/types`)
  shell.rm('-rf', `${componentPath}/cdn`)
}
