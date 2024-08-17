import { getPackages } from '@manypkg/get-packages'

const { packages, tool } = await getPackages(process.cwd())
console.log(packages)
console.log(tool)
