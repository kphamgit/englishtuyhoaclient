import { useAppSelector} from '../../redux/store'
import { lazy, Suspense} from 'react'
import React from 'react'

//import { HomeTeacher } from './HomeTeacher'

const HomeTeacher = lazy(() => import("./HomeTeacher"))

/*
function getAuthFromSessionStorage() {
  const tokenString = sessionStorage.getItem('auth');
  if (tokenString !== null)
    return JSON.parse(tokenString)
  else {
    return null
  }
}
*/

export default function Home() {
    const user = useAppSelector(state => state.user.value)
    //const [auth, setAuth] = useState(getAuthFromSessionStorage());
    //const {socket, users} = useContext(SocketContext).SocketState;
   // const [loggedInUsers, setLoggedInUsers] = useState<SocketInfo[] | undefined>([])
   //const [loggedInUsers, setLoggedInUsers] = useState<SocketInfo[] | undefined>([])
   
    //const navigate = useNavigate();


  return (
    <div>
 <Suspense fallback={<div>Loading...</div>}>
      {user.role === 'teacher' ?
        <HomeTeacher />
        :
        <div>NOT ALLOWED</div>
      }
 </Suspense >
 
    </div>

  )
}

