import { useAppSelector} from '../../redux/store'
import { HomeTeacher } from './HomeTeacher'


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

export function Home() {
    const user = useAppSelector(state => state.user.value)
    //const [auth, setAuth] = useState(getAuthFromSessionStorage());
    //const {socket, users} = useContext(SocketContext).SocketState;
   // const [loggedInUsers, setLoggedInUsers] = useState<SocketInfo[] | undefined>([])
   //const [loggedInUsers, setLoggedInUsers] = useState<SocketInfo[] | undefined>([])
   
    //const navigate = useNavigate();


  return (
    <div className='m-14'>
 
      {user.role === 'teacher' ?
        <HomeTeacher />
        :
        <div>NOT ALLOWED</div>
      }
 
 
    </div>

  )
}

