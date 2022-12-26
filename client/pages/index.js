import axios from "axios"

const LandingPage = ({ currentUser })=>{
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

// we are not using useRequest since this function is not a component
LandingPage.getInitialProps = async ({req})=>{

    if(typeof window === 'undefined'){
        // we are on the server scenario
        // requests should be made to ingress nginx

        const {data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',{
            headers:req.headers
        })
        return data
    }
    else{
        // we are on the client scenario
        // requests should be made with the regular baseURL
        try{
            const {data } = await axios.get('/api/users/currentuser')
            return data
        }
        catch(err){

        }

    }
    // const response = await axios.get('api/users/currentuser').catch(err =>{
    //     console.log(err.message);
    // })
    return {}
}
export default LandingPage

