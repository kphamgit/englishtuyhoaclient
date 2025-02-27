import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz, updateQuiz } from '../services/list';
import { useAxiosFetch } from './useAxiosFetch';
import { QuizProps } from './types';

export default function QuizEditor(props: any) {

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
        const [videoUrl, setVideoUrl] = useState<string | undefined>('')
      const [unitId, setUnitId] = useState('')
      const navigate = useNavigate();
      const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string, quiz_id: string }>();
        console.log("HUUUUU quiz editor, params =", params)
        //
//{categoryId: '6', sub_categoryId: '13', quiz_id: '146'}
        /*
{
    "categoryId": "6",
    "sub_categoryId": "13",
    "unit_id": "37",
    "quiz_id": "146"
}
        */
        const url = `/quizzes/${params.quiz_id}`
       
        const { data: quiz,  } = useAxiosFetch<QuizProps>({ url: url, method: 'get' })
    
        useEffect(() => {
            if (quiz) {
                console.log("heeeee quiz ", quiz)
                setName(quiz.name)
                setQuizNumber(quiz.quiz_number.toString())
                setUnitId(quiz.unitId)
            }
        },[quiz])


     // useEffect(() => {
      //  setSubCategoryId(params.sub_categoryId)
     // }, [params.sub_categoryId])
     
const handleCancel = () => {
    //navigate(`/categories/${params.sub_categoryId}/sub_categories/${params.unitId}`)
    // const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
    navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${unitId}`)
   //navigate(`display_unit/${params.unitId}`)
}

/*
 name: req.body.name,
    quiz_number: req.body.quiz_number,
    disabled: disabled,
    video_url: req.body.video_url,
    unitId: req.body.unitId
*/

const update_quiz = () => {
    let quiz_params = {
        name: name,
        quiz_number: quizNumber,
        video_url: videoUrl,
        unitId: params.unit_id
    }
    updateQuiz(quiz?.id, quiz_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${unitId}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
}
  
        return (
            <div className='bg-bgColor1 text-textColor2'>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Edit Quiz. ID ={quiz?.id}</div>
               <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={name}
                    onChange={e => setName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Quiz Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={quizNumber}
                    onChange={e => setQuizNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Video URL
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}></input>
                </div>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {params.unit_id}</div>
               <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={update_quiz}>Save quiz</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>