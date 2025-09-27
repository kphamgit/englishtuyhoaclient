import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz, createUser } from '../services/list';

/*
     name: req.body.name,
          unit_number: req.body.unit_number,
          level: req.body.level,
          content: req.body.content,
          subCategoryId: req.body.subCategoryId
*/

export default function NewUser(props: any) {

      const [userName, setUserName] = useState<string>('')
      const [fullName, setFullName] = useState<string>('')
      const [role, setRole] = useState<string | undefined>('')
      const [level, setLevel] = useState<string | undefined>('')
      const [password, setPassword] = useState<string | undefined>('')
      const [classId, setClassId] = useState<string | undefined>('')

      const navigate = useNavigate();
     // const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string }>();
     //   console.log("HUUUUU params =", params)
     // useEffect(() => {
      //  setSubCategoryId(params.sub_categoryId)
     // }, [params.sub_categoryId])
     
const handleCancel = () => {
    //navigate(`/categories/${params.sub_categoryId}/sub_categories/${params.unitId}`)
    // const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}/questions/${params.quiz_id}`
   // navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}`)
   //navigate(`list_quizzes/${params.unitId}`)
}

/*
 name: req.body.name,
    quiz_number: req.body.quiz_number,
    disabled: disabled,
    video_url: req.body.video_url,
    unitId: req.body.unitId
*/

const create_user = () => {
    let user_params = {
        user_name: userName,
        full_name: fullName,
        role: role,
        level: level,
        password: password,
        classId: classId,
 
    }
    createUser(user_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        //navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
}
  
        return (
            <div className='bg-bgColor1 text-textColor2'>
                <div className='bg-bgColor1 text-textColor2 mb-2'>New Quiz</div>
               <div className='mx-10 text-textColor1 mb-2'>User Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={userName}
                    onChange={e => setUserName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Full Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Level
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={level}
                    onChange={e => setLevel(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Role
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={role}
                    onChange={e => setRole(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Class Id
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={classId}
                    onChange={e => setClassId(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Password
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={password}
                    onChange={e => setPassword(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Class ID
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={classId}
                    onChange={e => setClassId(e.target.value)}></input>
                </div>
               <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={create_user}>Save User</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>