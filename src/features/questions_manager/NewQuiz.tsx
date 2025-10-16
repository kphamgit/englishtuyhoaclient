import {  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { VideoSegmentProps } from './types';
import { List } from 'flowbite-react';
import ListVideoSegments from './ListVideoSegments';
import { genericItemType } from './GenericSortableTable';
import { on } from 'events';
import { useRootUrl } from '../../contexts/root_url';
import { useMutation } from '@tanstack/react-query';
import { createQuiz } from '../services/list';

/*
export interface NewQuizProps {
    categoryId: string;
    sub_categoryId: string;
    unit_id: string;
    parent_func: (create_quiz_props: CreateQuizProps) => void;
}
*/

export interface CreateQuizProps {
    name: string;
    quiz_number: string | undefined;
    video_url: string | undefined;
    unitId: string; 
    video_segments?: VideoSegmentProps[];
}

export interface NewQuizModalContentProps {
    unitId: string;
  }

  export interface QuizCloseModalProps  {
    action: "edit" | "new" | "cancel",
    id?: string
    name: string,
    quiz_number: string,
    video_url: string,
    unitId: string,
  }

interface NewQuizProps {
 
   // format: string;
   //quiz_id: string;
   // quiz_has_video: boolean;
    modal_content: NewQuizModalContentProps;
    onClose: (params: QuizCloseModalProps) => void;
  }

//export default function NewQuiz(props: NewQuizProps) {
    const NewQuiz: React.FC<NewQuizProps> = ({ modal_content, onClose }) => {

    const {unitId} = modal_content

    const { rootUrl}  = useRootUrl()

      const [name, setName] = useState<string>('')
      const [quizNumber, setQuizNumber] = useState<string | undefined>('')
      const [videoUrl, setVideoUrl] = useState<string | undefined>('')
 
     
const create_quiz = async () => {
  
    const my_params = {
        name: name,
        quiz_number: quizNumber || '',
        video_url: videoUrl || '',
        unitId: unitId
    }
    const response = await createQuiz(rootUrl, my_params )
                   if (response) {
                    console.log(" NewQuiz: create quiz response data = ", response.data)
                      // console.log("button cloze question created ok")
                      
                          onClose({ action: 'new',
                            id: response.data.id.toString(),
                            name: name,
                            quiz_number: quizNumber || '',
                            video_url: videoUrl || '',
                            unitId: unitId
                          })
                            
                   }
  
  // const body = {
}

const handleCancel = () => {
     onClose({ action: 'cancel'
        , name: '',
        quiz_number: '',
        video_url: '',
        unitId: ''
     })
 }

  
        return (
            
            <div className='bg-bgColor1 text-textColor2'>
              <button className='bg-bgColor2 m-3 p-1' onClick={create_quiz}>Save Quiz</button>

              <div className='flex flex-row justify-start gap-2'>
                  
                    <button className='bg-bgColor2 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
                </div>

                <div className='bg-bgColor1 text-textColor2 mb-2'>New Quiz</div>
               <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-3/4 mx-1' type="text" value={name}
                    onChange={e => setName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Quiz Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={quizNumber}
                    onChange={e => setQuizNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Video URL
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-96 mx-1' type="text" value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}></input>
                </div>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {unitId}</div>
                
            </div>
        )
}

export default NewQuiz;
//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>