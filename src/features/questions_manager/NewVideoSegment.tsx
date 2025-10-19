import {  useState } from 'react'
import { VideoSegmentProps } from './ListVideoSegments';
import { useRootUrl } from '../../contexts/root_url';
import { createQuiz } from '../services/list';

export interface CreateQuizProps {
    name: string;
    quiz_number: string | undefined;
    video_url: string | undefined;
    unitId: string; 
    video_segments?: VideoSegmentProps[];
}

export interface NewSegmentModalContentProps {
    quizId: string;
  }

  export interface SegmentCloseModalProps  {
    action: "edit" | "new" | "cancel",
    id?: string
    segment_number: string,
    quizId: string,
  }

interface NewVideoSegmentProps {
 
   // format: string;
   //quiz_id: string;
   // quiz_has_video: boolean;
    modal_content: NewSegmentModalContentProps;
    onClose: (params: SegmentCloseModalProps | null) => void;
  }

//export default function NewQuiz(props: NewQuizProps) {
    const NewVideoSegment: React.FC<NewVideoSegmentProps> = ({ modal_content, onClose }) => {

    const {quizId} = modal_content

    const { rootUrl}  = useRootUrl()

      const [segmentNumber, setSegmentNumber] = useState<string | undefined>('')
      const [videoUrl, setVideoUrl] = useState<string | undefined>('')
 
     
const create_segment = async () => {
    const my_params = {
        segment_number: segmentNumber || '',
        quizId: quizId
    }
    const response = await createQuiz(rootUrl, my_params )
                   if (response) {
                    console.log(" NewQuiz: create quiz response data = ", response.data)
                      // console.log("button cloze question created ok")
                      
                          onClose({ action: 'new',
                            id: response.data.id.toString(),
                            segment_number: segmentNumber || '',
                            quizId: quizId
                          })
                            
                   }
  
  // const body = {
}

const handleCancel = () => {
    console.log(" NewVideoSegment: handleCancel")
     onClose(null)
 }

  
        return (
            
            <div className='bg-bgColor1 text-textColor2'>
              <button className='bg-bgColor2 m-3 p-1' onClick={create_segment}>Saveeeeeee Segment</button>

              <div className='flex flex-row justify-start gap-2'>
                  
                    <button className='bg-bgColor2 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
                </div>

                <div className='bg-bgColor1 text-textColor2 mb-2'>New Quiz</div>
                <div className='mx-10 text-textColor1 mb-2'>Quiz Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={segmentNumber}
                    onChange={e => setSegmentNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Video URL
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-96 mx-1' type="text" value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}></input>
                </div>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Unit ID:  {quizId}</div>
                
            </div>
        )
}

export default NewVideoSegment;
//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>