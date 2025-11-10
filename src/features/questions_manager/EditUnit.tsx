import { useEffect, useState } from 'react'
import { useAxiosFetch } from '../../hooks';
import { useRootUrl } from '../../contexts/root_url';

import { QuizProps, UnitProps } from './types';
import { EditUnitModalContentProps } from './ListUnits';
import { UnitCloseModalProps } from './NewUnit';
//import YoutubeVideoPlayer from '../components/YoutubeVideoPlayer';

interface EditUnitProps {
    modal_content: EditUnitModalContentProps;
    onClose: (params: UnitCloseModalProps) => void;
  }
  
    const EditUnit: React.FC<EditUnitProps> = ({ modal_content, onClose }) => {

      const  {unit_id} = modal_content
    
    const [name, setName] = useState<string>('')
   
        const [videoUrl, setVideoUrl] = useState<string | undefined>('')
        const { rootUrl } = useRootUrl();

      const url = `/quizzes/${unit_id}`

      const { data: unit, loading, error } =
          useAxiosFetch<UnitProps>({ url: url, method: 'get' })
 
    useEffect(() => {
        if (unit) {
            //console.log("EditQuiz:  quiz=", quiz);
          setName(unit.name)
       }
    },[unit])

    const handleCancel = () => {
        onClose({action: 'cancel',
            name:  '',
            unit_number:  '',
            subCategoryId:  ''
        });
    }

    const update_unit = () => {
        let quiz_params = {
            name: name,
        }
       
            const url = `${rootUrl}/api/units/${unit?.id}`
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
                    unit_number: String(unit?.unit_number || ''),
                    subCategoryId: String(unit?.subCategoryId || '')
                });
                //return response.json();
            })
    }
    

        return (
            <div className='bg-bgColor1 text-textColor2 w-auto'>
                <div className='bg-bgColor1 text-textColor2 mb-2 w-auto'>Edit Unit. ID ={unit?.id}</div>
                <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md  mx-1' type="text" value={name}
                        onChange={e => setName(e.target.value)}></input>
                </div>
                <button className='bg-bgColor3 m-3 p-1' onClick={update_unit}>Save Unit</button>
                <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>

            </div>
        )
}


export default EditUnit;


/*
   id?: number,
    duration: number,
    segment_number: number,
    question_numbers: string,
    start_time: string,
    end_time: string,
    quizId: number

*/


