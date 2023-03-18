import { createContext, useContext,useState,useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

const ChatContext = createContext()


const ChatProvider = ({children})=>{
    // const navigate = useNavigate()
    const [user, setUser] = useState( )

    useEffect(()=>{
      const userInfo= JSON.parse(localStorage.getItem("userInfo"))
      setUser(userInfo)

      if(!userInfo){
        window.location.href="/"
      }
    },[])
    return (
        <ChatContext.Provider value={{user,setUser}}>
            {children}
        </ChatContext.Provider>
    )   
}

export const ChatState = ()=>{
return useContext(ChatContext)
}


export default ChatProvider