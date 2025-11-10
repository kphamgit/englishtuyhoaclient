import { useEffect, useState } from 'react'
import { useAxiosFetch } from '../../hooks';
import { useRootUrl } from '../../contexts/root_url';

import { EditQuizModalContentProps } from './ListQuizzes';
import { QuizProps } from './types';
import ListVideoSegments, { VideoSegmentProps } from './ListVideoSegments';
import { QuizCloseModalProps } from './NewQuiz';
//import YoutubeVideoPlayer from '../components/YoutubeVideoPlayer';

interface EditQuizProps {
    modal_content: EditQuizModalContentProps;
    onClose: (params: QuizCloseModalProps) => void;
  }
  
    const EditQuiz: React.FC<EditQuizProps> = ({ modal_content, onClose }) => {

      const  {quiz_id} = modal_content

      const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([])

        const [name, setName] = useState<string>('')
   
        const [videoUrl, setVideoUrl] = useState<string | undefined>('')
        const { rootUrl } = useRootUrl();

      const url = `/quizzes/${quiz_id}`

      const { data: quiz, loading, error } =
          useAxiosFetch<QuizProps>({ url: url, method: 'get' })
 
    useEffect(() => {
        if (quiz) {
            //console.log("EditQuiz:  quiz=", quiz);
          setName(quiz.name)
          setVideoUrl(quiz.video_url || '')
          setVideoSegments(quiz.video_segments || [])
       }
    },[quiz])

    const handleCancel = () => {
        onClose({action: 'cancel',
            name:  '',
            quiz_number:  '',
            video_url:  '',
            unitId:  ''
        });
    }

    const update_quiz = () => {
        let quiz_params = {
            name: name,
            video_url: videoUrl,
        }
       
            const url = `${rootUrl}/api/quizzes/${quiz?.id}`
            // use fetch to send a PUT request to the server
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz_params),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                onClose({
                    action: 'edit', 
                    name: name, 
                    quiz_number: quiz?.quiz_number || '',
                    video_url: videoUrl || '',
                    unitId: quiz?.unitId || ''
                });
                //return response.json();
            })
    }
    

        return (
            <div className='bg-bgColor1 text-textColor2 w-auto'>
                <div className='bg-bgColor1 text-textColor2 mb-2 w-auto'>Edit Quiz. ID ={quiz?.id}</div>
                <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md  mx-1' type="text" value={name}
                        onChange={e => setName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Video URL
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-auto mx-1' size={60} type="text" value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}></input>
                </div>
         
                <div>
                    <ListVideoSegments quiz_id={quiz_id || ''}  videoUrl={videoUrl}/>

                </div>

                <button className='bg-bgColor3 m-3 p-1' onClick={update_quiz}>Save quiz</button>
                <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>

            </div>
        )
}


export default EditQuiz;


/*
   id?: number,
    duration: number,
    segment_number: number,
    question_numbers: string,
    start_time: string,
    end_time: string,
    quizId: number

*/


