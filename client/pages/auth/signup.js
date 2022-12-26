import useEmailPassword from '../../hooks/use-email-password'
export default ()=>{

    return (
        useEmailPassword({
            title:'Signup',
            buttonText:'Signup',
            postUrlRequest:'/api/users/signup'
        })
    )

}