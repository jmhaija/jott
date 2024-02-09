import fs from 'fs/promises'

export default {
  async main() {
    const data = await fs.readFile('./bin/help/usage', 'utf8')
    console.log(data)
  }
}
