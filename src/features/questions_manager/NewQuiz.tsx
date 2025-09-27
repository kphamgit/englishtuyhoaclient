import {  useState } from 'react'


import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/list';
import { useRootUrl } from '../../contexts/root_url';
import { VideoSegmentProps } from './types';

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
    video_segments: VideoSegmentProps[];
}

export default function NewQuiz(props: NewQuizProps) {

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
      const [videoUrl, setVideoUrl] = useState<string | undefined>('')

      const navigate = useNavigate();
      //const props = useprops<{categoryId: string, sub_categoryId: string, unit_id: string }>();
        //console.log("HUUUUU props =", props)

      const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([{id: 1, duration: 0, segment_number: 0, question_numbers: '1', start_time: '0:00', end_time: '0:10', quizId: 0}])


const create_quiz = () => {
    console.log("create quiz new .........")
    let quiz_props = {
        name: name,
        quiz_number: quizNumber,
        video_url: videoUrl,
        unitId: props.unit_id, 
        video_segments: videoSegments
    }
    props.parent_func(quiz_props)    
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
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {props.unit_id}</div>
             
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
                  
                </div>

            </div>
        )
}

//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>