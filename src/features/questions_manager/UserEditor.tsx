import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { updateUser } from '../services/list';
import { UserProps } from './types';
import { useAxiosFetch } from './useAxiosFetch';


export default function UserEditor(props: any) {

      const [userName, setUserName]= useState<string>('')
      const [fullName, setFullName] = useState<string>('')
      const [level, setLevel] = useState<string | undefined>('')
      const [message, setMessage] = useState<string>('')
      const [role, setRole]= useState<string>('')
     
      const params = useParams<{id: string}>();
     
      const navigate = useNavigate();

    const url = `/users/${params.id}`

    const { data: user} = useAxiosFetch<UserProps>({ url: url, method: 'get' })

    useEffect(() => {
        if (user) {
            setFullName(user.full_name)
            setLevel(user.level)
            setUserName(user.user_name)
            setRole(user.role)
            setMessage(user.message)
        }
    },[user])
   
const handleCancel = () => {
    navigate(`/utils/manage_users`)
}

const update_user = () => {
    const unit_params = {
        full_name: fullName,
        level: level,
        message: message,
        user_name: userName,
        role: role,
    }
    updateUser(params.id, unit_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        //navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
    
}


  
        return (
            <div className='bg-bgColor1 text-textColor2'>
                <div className='mx-10 text-textColor1 mb-2'>User Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)}></input>
                </div>
               <div className='mx-10 text-textColor1 mb-2'>Full Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Role
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={role}
                    onChange={e => setRole(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Level
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={level}
                    onChange={e => setLevel(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Message
                <textarea className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md mx-1' rows={5} cols={70} value={message}
                    onChange={e => setMessage(e.target.value)}></textarea>
                </div>
                <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={update_user}>Save unit</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            )
}

