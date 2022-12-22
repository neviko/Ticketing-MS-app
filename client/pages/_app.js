/**
 * this file aimed for be the first to load 
 * it will load the global css file
 */
import 'bootstrap/dist/css/bootstrap.css'

export default ({Component, pageProps})=>{
    return <Component {...pageProps} />
}