import {  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { VideoSegmentProps } from './types';
import { List } from 'flowbite-react';
import ListVideoSegments from './ListVideoSegments';

export interface NewQuizProps {
    categoryId: string;
    sub_categoryId: string;
    unit_id: string;
    parent_func: (create_quiz_props: CreateQuizProps) => void;
}

export interface CreateQuizProps {
    name: string;
    quiz_number: string | undefined;
    video_url: string | undefined;
    unitId: string; 
    video_segments?: VideoSegmentProps[];
}

export default function NewQuiz(props: NewQuizProps) {

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
      const [videoUrl, setVideoUrl] = useState<string | undefined>('')
 
const create_quiz = () => {
    //console.log("create quiz new .........")
    let quiz_props = {
        name: name,
        quiz_number: quizNumber,
        video_url: videoUrl,
        unitId: props.unit_id, 
        
    }
    props.parent_func(quiz_props)    
}

  
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
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {props.unit_id}</div>
                <button className='bg-bgColor2 m-3 p-1' onClick={create_quiz}>Create Quiz</button>
            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>