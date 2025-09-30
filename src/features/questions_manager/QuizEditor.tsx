import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { updateQuiz, updateVideoSegment } from '../services/list';
import { useAxiosFetch } from './useAxiosFetch';
import { QuizProps } from './types';
import { useRootUrl } from '../../contexts/root_url';
import { VideoSegmentProps } from './types';
import ListVideoSegments from './ListVideoSegments';

export default function QuizEditor(props: any) {

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
        const [videoUrl, setVideoUrl] = useState<string | undefined>('')
      const [unitId, setUnitId] = useState('')
      const navigate = useNavigate();
      const {rootUrl} = useRootUrl();
   
      const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>()

      const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string, quiz_id: string }>();

        const url = `/quizzes/${params.quiz_id}`
       
        const { data: quiz,  } = useAxiosFetch<QuizProps>({ url: url, method: 'get' })
    
        useEffect(() => {
            if (quiz) {
                console.log("heeeee quiz ", quiz)
                setName(quiz.name)
                setQuizNumber(quiz.quiz_number.toString())
                setUnitId(quiz.unitId)
                console.log("***** quiz video segments =", quiz.video_segments)
                setVideoSegments(quiz.video_segments || [])
                setVideoUrl(quiz.video_url || '')
            }
        },[quiz])
     
const handleCancel = () => {
    //navigate(`/categories/${params.sub_categoryId}/sub_categories/${params.unitId}`)
    // const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}/questions/${params.quiz_id}`
    navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${unitId}`)
   //navigate(`list_quizzes/${params.unitId}`)
}


const update_quiz = () => {
    let quiz_params = {
        name: name,
        quiz_number: quizNumber,
        video_url: videoUrl,
        unitId: params.unit_id,
        //video_segments: videoSegments
    }
    console.log("update quiz: videoSegments ", videoSegments)
    console.log("update quiz: quizparams ", quiz_params)
    updateQuiz(rootUrl, quiz?.id, quiz_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${unitId}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
        
}

const update_video_segment = () => {
  let params = {
    duration: 0,
    segment_number: 0,
    question_numbers: '1',
    start_time: '0:00',
    end_time: '0:10',
};
  console.log("update quiz: videoSegments ", videoSegments)
  console.log("update quiz: quizparams ", params)
  updateVideoSegment(rootUrl, quiz?.id, params )
  .then(response => {
      //console.log("SUCCESS updating question")
      //navigate("/live_quiz", { state: arg })
     // navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${unitId}`)
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
                <div>
                </div>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {params.unit_id}</div>
                <button className='bg-bgColor3 m-3 p-1' onClick={update_quiz}>Save quiz</button>
                <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                <div>
                  <ListVideoSegments videoSegments={videoSegments} quiz_id= {quiz?.id} />
                </div>
            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>
/*
              {videoSegments && videoSegments.length > 0 && (
                    <div className='mx-10 text-textColor1 mb-2'>
                        <div>Video Segments:</div>
                        <ul className='list-disc list-inside'>
                            {videoSegments.map((segment, index) => (
                                <li key={index}>
                                    Segment id: {segment.id},
                                    Segment number: {segment.segment_number},
                                    Start: {segment.start_time},
                                    End: {segment.end_time}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
*/
