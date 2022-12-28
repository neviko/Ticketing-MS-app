/**
 * this file aimed for be the first to load 
 * it will load the global css file
 */
import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({Component, pageProps,currentUser})=>{

    AppComponent.getInitialProps = async (appContext)=>{
        const client = await buildClient(appContext.ctx)
        const {data} = await client.get('/api/users/currentuser')
        let pageProps ={}
        if(appContext.Component.getInitialProps){
            pageProps = await appContext.Component.getInitialProps(appContext.ctx)
        }
        
        return {
            pageProps,
            ...data
        }
    }

    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    
    )
}

export default AppComponent