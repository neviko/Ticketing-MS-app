import axios from "axios"
import buildClient from "../api/build-client"

const LandingPage = ({currentUser})=>{
    console.log(`NEVO - ${currentUser}`)
    return <div>
        {currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>}
    </div> 
}

// we are not using useRequest since this function is not a component
LandingPage.getInitialProps = async (context)=>{
    try{
        const client = await buildClient(context)
        const {data} = await client.get('/api/users/currentuser')
        // console.log('NEVO data is:', data)
        return {data}

    }
    catch(e){
        console.error('index.js currentuser failed ')
        return {currentUser:null}
    }
}
export default LandingPage

