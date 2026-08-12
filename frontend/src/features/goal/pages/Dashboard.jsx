import { useAuth } from "../../auth/hooks/useAuth"

const Dashboard = () => {

    const { handleLogout,user } = useAuth()
    
    const logoutHandler = ()=>{
        handleLogout()
    }
  return (
    <div>
      <h1>Dashboard welcome {user.username} </h1>
      
        <button onClick={logoutHandler} >
            Logout
        </button>
    </div>
  )
}

export default Dashboard
