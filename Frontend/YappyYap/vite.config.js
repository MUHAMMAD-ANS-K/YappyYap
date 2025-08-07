import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const test = process.env.DEPLOY_FROM
console.log(test)
export default defineConfig({
  base : process.env.DEPLOY_FROM === 'GIT' ? "/YappyYap/": '/',
  plugins: [react()],
})
