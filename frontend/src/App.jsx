import { router } from "./app.routes.jsx"
import { RouterProvider } from "react-router"

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
