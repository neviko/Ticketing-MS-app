import useEmailPassword from '../../hooks/use-email-password'
export default ()=>{

    return (
        useEmailPassword({
            title:'Sign in',
            buttonText:'Sign in',
            postUrlRequest:'/api/users/signin'
        })
    )

}