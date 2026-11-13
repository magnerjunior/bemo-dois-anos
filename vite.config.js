import {defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'')
 const candidate=env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/,'')||''
 const site=/^https?:\/\//.test(candidate)?new URL(candidate).origin:''
 const title='Para Gabriella, com amor, de Magner'
 return {plugins:[react(),{name:'album-sharing',transformIndexHtml(){return [
 {tag:'meta',attrs:{property:'og:type',content:'website'}},
 {tag:'meta',attrs:{property:'og:locale',content:'pt_BR'}},
 {tag:'meta',attrs:{property:'og:title',content:title}},
 {tag:'meta',attrs:{property:'og:description',content:'Dois anos de nós. Um álbum feito de lembranças, carinho e tudo o que ainda quero viver com você.'}},
 {tag:'meta',attrs:{property:'og:image',content:`${site}/og/album.jpg`}},
 {tag:'meta',attrs:{property:'og:image:width',content:'1200'}},
 {tag:'meta',attrs:{property:'og:image:height',content:'630'}},
 {tag:'meta',attrs:{property:'og:image:alt',content:'O álbum de Magner e Gabriella sobre uma mesa, com fotografias e luz quente.'}},
 {tag:'meta',attrs:{name:'twitter:card',content:'summary_large_image'}},
 {tag:'meta',attrs:{name:'twitter:title',content:title}},
 {tag:'meta',attrs:{name:'twitter:image',content:`${site}/og/album.jpg`}},
 ...(site?[{tag:'meta',attrs:{property:'og:url',content:site}},{tag:'link',attrs:{rel:'canonical',href:site}}]:[])
 ]}}]}
})
