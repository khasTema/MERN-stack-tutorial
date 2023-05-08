import { useState } from "react";
import { useAuthContext  } from "./useAuthContext";

export const useSignup = () => {
    const [ error, setError ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const responce = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const json = await responce.json()

        if (!responce.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (responce.ok) {
             // save user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // udate AuthContext
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }
    }

    return { signup, isLoading, error }
}