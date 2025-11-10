import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { createUnit, updateUnit } from '../services/list';
import { useRootUrl } from '../../contexts/root_url';
import { NewUnitModalContentProps } from './ListUnits';

export interface UnitCloseModalProps  {
    action: "edit" | "new" | "cancel",
    id?: string
    name: string,
    unit_number: string,
    subCategoryId: string,
  }

interface NewUnitProps {
    modal_content: NewUnitModalContentProps;
    onClose: (params: UnitCloseModalProps) => void;
  }
const NewUnit: React.FC<NewUnitProps> = ({ modal_content, onClose }) => {
//export default function NewUnit(props: NewUnitProps) {

      const [name, setName] = useState<string>('')
      const [unitNumber, setUnitNumber] = useState<string | undefined>('')
      const [level, setLevel] = useState<string | undefined>('beginner')
      //const [subCategoryId, setSubCategoryId] = useState<string>()
      
      //const navigate = useNavigate();
      //const params = useParams<{categoryId: string, sub_categoryId: string }>();

      const { rootUrl} = useRootUrl();

      const {subCategoryId} = modal_content

     const handleCancel = () => {
        console.log(" NewUnit: handleCancel called")
        onClose({ action: 'cancel'
           , name: '',
           unit_number: '',
           subCategoryId: ''
        })
    }

const create_unit = async () => {
    let unit_params = {
        name: name,
        unit_number: unitNumber,
        level: level,
        content: '',
        subCategoryId: subCategoryId
    }
   const response = await createUnit(rootUrl, unit_params )
                     if (response) {
                      
                        // console.log("button cloze question created ok")
                        
                            onClose({ action: 'new',
                              id: response.data.id.toString(),
                              name: name,
                              unit_number: unitNumber || '',
                              subCategoryId: subCategoryId || ''
                            })
                              
                     }
}
  
/*
 const createUnit = async ({ name, quiz_number, video_url, unitId, video_segments }: CreateQuizProps) => {
      console.log("createQuiz called with:", { name, quiz_number, video_url, unitId, video_segments });
      const response = await fetch(`${rootUrl}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          quiz_number: quiz_number,
          video_url: video_url,
          unitId: unitId,
          video_segments: video_segments
        }),
      });
      return response.json();
  
      // Perform additional logic with the properties
  };

*/

        return (
            <div className='bg-bgColor1 text-textColor2'>
                <div className='bg-bgColor1 text-textColor2 mb-2'>New Unit</div>
               <div className='mx-10 text-textColor1 mb-2'>Name
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={name}
                    onChange={e => setName(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Unit Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={unitNumber}
                    onChange={e => setUnitNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Level
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={level}
                    onChange={e => setLevel(e.target.value)}></input>
                </div>
                <div className='bg-bgColor1 text-textColor2 mb-2'>Sub Category ID:  {subCategoryId}</div>
               <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={create_unit}>Save unit</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        )
}

export default NewUnit;
//<button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>