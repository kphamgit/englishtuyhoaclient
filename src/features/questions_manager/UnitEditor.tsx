import { useEffect, useState } from 'react'


import { useNavigate, useParams } from 'react-router-dom';
import { updateUnit } from '../services/list';
import { UnitProps } from './types';
import { useAxiosFetch } from './useAxiosFetch';


export default function UnitEditor(props: any) {

      const [name, setName] = useState<string>('')
      const [unitNumber, setUnitNumber] = useState<string | undefined>('')
      const [level, setLevel] = useState<string | undefined>('')
      
      const navigate = useNavigate();
      const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string}>();
      //console.log("MMMMNNNNNNN xxxxxxxxxxxx params", params)
      // const { data: sub_category, loading: sub_loading, error: sub_error } =
      // useAxiosFetch<SubCategoryProps>({ url: `/sub_categories/${params.sub_categoryId}`, method: 'get' });

    //  const { data: question, loading, error } =
    //  useAxiosFetch<QuestionProps>({ url: url, method: 'get' })

    const url = `/units/${params.unit_id}`

    const { data: unit, loading, error } = useAxiosFetch<UnitProps>({ url: url, method: 'get' })

    useEffect(() => {
        if (unit) {
            setName(unit.name)
            setUnitNumber(unit.unit_number.toString())
            setLevel(unit.level)
        }
    },[unit])
   
const handleCancel = () => {
    navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}`)
}

const update_unit = () => {
    let unit_params = {
        name: name
        
    }
    updateUnit(params.unit_id, unit_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
        navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
}
  
        return (
            <div className='bg-bgColor1 text-textColor2'>
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
                <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={update_unit}>Save unit</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            )
}

/*
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
*/