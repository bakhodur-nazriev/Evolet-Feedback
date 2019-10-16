import React, { useState } from "react";

const AuthContext = React.createContext();
export default AuthContext;

export function AuthContextProvider(props) {
    const [auth, setAuth] = useState(null);
    
    const noitazb = localStorage.getItem('noitazb');
    
    window.axios.interceptors.response.use(
        response => response,
        error => {
            const UNAUTORIZE_CODE = 401;
            const unAutorized = error.response.status === UNAUTORIZE_CODE

            if(unAutorized){
                localStorage.setItem('noitazb', null);
                setAuth(null);
            }      
        }
    )

    if(noitazb && noitazb !== 'null' && auth === null){
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + noitazb;
        setAuth(noitazb);
    }

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {props.children}
        </AuthContext.Provider>
    );
}

