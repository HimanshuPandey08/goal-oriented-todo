import { router } from "./app.routes.jsx"
import { RouterProvider } from "react-router"
import { AuthProvider } from "./features/auth/auth.context.jsx"


const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </div>
  )
}

export default App
