import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import fs from "fs"
export default defineConfig(()=>{
  const useHttps = process.env.VITE_DEV_HTTPS === "true"
  let httpsConfig;
  if (useHttps) {
    const keyP = path.resolve(__dirname, "..", "..", "Backend", "certs", "key.pem")
    const certP = path.resolve(__dirname, "..", "..", "Backend", "certs" , "cert.pem")
    httpsConfig = {
      key: fs.readFileSync(keyP),
      cert : fs.readFileSync(certP)
    }
  }
  return {
  base : process.env.VITE_DEPLOY_FROM === 'GIT' ? "/YappyYap": '/',
  plugins: [react()],
     server: {
    https: httpsConfig,
    port: 5173
     }
  }
})
