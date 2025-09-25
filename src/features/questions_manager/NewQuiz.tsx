import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz } from '../services/list';
import { useRootUrl } from '../../contexts/root_url';
import { VideoSegmentProps } from './types';

export default function NewQuiz(props: any) {

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
      const [videoUrl, setVideoUrl] = useState<string | undefined>('')

      const navigate = useNavigate();
      const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string }>();
        //console.log("HUUUUU params =", params)

      const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([{id: 1, duration: 0, segment_number: 0, question_numbers: '1', start_time: '0:00', end_time: '0:10', quizId: 0}])

      const {rootUrl} = useRootUrl();
     /*
 id: number,
    duration: number,
    segment_number: number,
    question_numbers: string,
    start_time: string,
    end_time: string,
    quizId: number
     */
     
const handleCancel = () => {
    //navigate(`/categories/${params.sub_categoryId}/sub_categories/${params.unitId}`)
    // const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
    navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}`)
   //navigate(`display_unit/${params.unitId}`)
}

const create_quiz = () => {
    let quiz_params = {
        name: name,
        quiz_number: quizNumber,
        video_url: videoUrl,
        unitId: params.unit_id, 
        video_segments: videoSegments
    }
    console.log("create quiz rootUrl = ", rootUrl)
    
    createQuiz(rootUrl, quiz_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
        
}

    const add_video_segment = () => {
        const newSegment: VideoSegmentProps = {
            id: videoSegments.length + 1,
            duration: 0,
            segment_number: 0,
            question_numbers: '1',
            start_time: '0:00',
            end_time: '0:10',
            quizId: 0
        };
        setVideoSegments([...videoSegments, newSegment]);
      };
  
        return (
            <div className='bg-bgColor1 text-textColor2'>
                <div className='bg-bgColor1 text-textColor2 mb-2'>New Quiz</div>
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
             
                <div>
                {videoSegments && videoSegments.length > 0 && (
                    <div className='mx-10 text-textColor1 mb-2'>
                        <div>Video Segments:</div>
                        <ul className='list-disc list-inside'>
                            {videoSegments.map((segment, index) => (
                             <li key={index} className="mb-2">
                             <div className="flex items-center gap-2">
                               <span>Segment ID: {segment.id}</span>
                               <input
                                 className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-16 mx-1'
                                 type="text"
                                 value={segment.segment_number}
                                 onChange={(e) => {
                                   const updatedSegments = [...videoSegments];
                                   updatedSegments[index] = {
                                     ...updatedSegments[index],
                                     segment_number: e.target.value === "" ? 0 : parseInt(e.target.value) , // Ensure segment_number is always a number
                                   };
                                   setVideoSegments(updatedSegments);
                                 }}
                                
                               />
                               <input
                                 className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-24 mx-1'
                                 type="text"
                                 value={segment.start_time}
                                 onChange={(e) => {
                                   const updatedSegments = [...videoSegments];
                                   updatedSegments[index] = {
                                     ...updatedSegments[index],
                                     start_time: e.target.value,
                                   };
                                   setVideoSegments(updatedSegments);
                                 }}
                                 placeholder="0:00"
                               />
                               <input
                                 className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-24 mx-1'
                                 type="text"
                                 value={segment.end_time}
                                 onChange={(e) => {
                                   const updatedSegments = [...videoSegments];
                                   updatedSegments[index] = {
                                     ...updatedSegments[index],
                                     end_time: e.target.value,
                                   };
                                   setVideoSegments(updatedSegments);
                                 }}
                                 placeholder="0:00"
                               />
                                <input
                                 className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-24 mx-1'
                                 type="text"
                                 value={segment.question_numbers}
                                 onChange={(e) => {
                                   const updatedSegments = [...videoSegments];
                                   updatedSegments[index] = {
                                     ...updatedSegments[index],
                                     question_numbers: e.target.value,
                                   };
                                   setVideoSegments(updatedSegments);
                                 }}
                                 placeholder="1"
                               />
                             </div>
                           
                           </li>
                            ))}
                        </ul>
                    </div>
                )}
                </div>
                <div className='flex flex-row justify-start gap-2 mx-14'>
                <button className='bg-bgColor3 m-3 p-1' onClick={add_video_segment}>Add video segment</button>
                    <button className='bg-bgColor3 m-3 p-1' onClick={create_quiz}>Save quiz</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>

            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>