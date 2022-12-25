import {useState} from 'react'
import axios from'axios'

export default ({url,method,body})=>{
    const [errors, setErrors] = useState(null)
    const doRequest = async () =>{
        try{
            setErrors(null)
            const response = await axios[method](url,body)
            return response.data
        }
        catch(err){
            console.log(err)
            setErrors(
                <div className='alert alert-danger'>
                    <h4>Ooopss....</h4>
                    <ul className='my-0'>
                        {err.response.data.errors.map(e=> <li key={e.message} >
                            {e.message}
                        </li> )}
                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors }

}