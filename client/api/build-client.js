import axios from "axios"
const buildClient = async ({req}) =>{

    if(typeof window === 'undefined'){
        // we are on the server scenario
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers:req.headers,
        })
    }
    else {
        // we are on the client scenario
       return axios.create({
            baseURL: '/',            
        })

    }
}

export default buildClient