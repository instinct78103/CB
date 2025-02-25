import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // add ip address to etc/hosts (e.g. 172.99.0.2 driveredtogo.com) to open driveredtogo.com:3000 in the browser
  // server:{
  //   allowedHosts: ['driveredtogo.com']
  // }
})
