import { useState } from 'react'
import { createSubCategory } from '../services/list'
import { useParams } from 'react-router-dom';
import { useRootUrl } from '../../contexts/root_url';

export function NewSubCategory(props: any) {
    const [name, setName] = useState<string>('')
    const [subCategoryNumber, setSubCategoryNumber] = useState<string>('')
    
     const params = useParams<{categoryId: string}>();
    const {rootUrl} = useRootUrl();
   
const create_sub_category = () => {
    let sub_category_params = {
        name: name,
        sub_category_number: subCategoryNumber,
        categoryId: params.categoryId,
    }
    createSubCategory(rootUrl, sub_category_params )
    .then(response => {
        console.log("SUCCESS creating sub_category")
        //navigate("/live_quiz", { state: arg })
       // navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}`)
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
            <div className='bg-bgColor2 text-textColor2 mb-2'>New SUB Category</div>
           <div className='mx-10 text-textColor1 mb-2'>Name
                <input className='bg-bgColor4 px-2 text-lg text-textColor4 rounded-md w-4/12 mx-1' type="text" value={name}
                onChange={e => setName(e.target.value)}></input>
            </div>

            <div className='mx-10 text-textColor2 mb-2'>Sub Category Number
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={subCategoryNumber}
                    onChange={e => setSubCategoryNumber(e.target.value)}></input>
                </div>
            
            <div className='bg-bgColor2 text-textColor2 mx-10'> Category ID: &nbsp;
                {params.categoryId}
            </div>
               <div className='flex flex-row justify-start gap-2 mx-14'>
                    <button className='bg-bgColor3 m-3 p-1' onClick={create_sub_category}>Save Sub Category</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
       
        </div>
    )
}
