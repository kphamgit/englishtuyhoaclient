import { useState } from 'react'
import { createCategory } from '../services/list'
import { useRootUrl } from '../../contexts/root_url'

export function NewCategory(props: any) {
    const [name, setName] = useState<string>('')
    const [categoryNumber, setCategoryNumber] = useState<string>('')
    const [level, setLevel] = useState<string>('')
const {rootUrl} = useRootUrl();

const create_category = () => {
    let category_params = {
        name: name,
        category_number: categoryNumber,
        level: level,
    }
    createCategory(rootUrl, category_params )
    .then(response => {
        //console.log("SUCCESS updating question")
        //navigate("/live_quiz", { state: arg })
       // navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}`)
        //ocalhost:5173/categories/1/sub_categories/7
     })
    .catch(error => {
        console.log(error)
    })
}

const handleCancel = () => {
    //setName('')
}
    return (
        <div className='bg-bgColor1 text-textColor2'>
            <div className='bg-bgColor2 text-textColor2 mb-2'>New Category</div>
           <div className='mx-10 text-textColor1 mb-2'>Name
                <input className='bg-bgColor4 px-2 text-lg text-textColor4 rounded-md w-4/12 mx-1' type="text" value={name}
                onChange={e => setName(e.target.value)}></input>
            </div>

            <div className='mx-10 text-textColor1 mb-2'>Category Number
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={categoryNumber}
                    onChange={e => setCategoryNumber(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Level
                    <input className='bg-bgColor3 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={level}
                    onChange={e => setLevel(e.target.value)}></input>
                </div>
            
               <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={create_category}>Save Category</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
       
        </div>
    )
}
