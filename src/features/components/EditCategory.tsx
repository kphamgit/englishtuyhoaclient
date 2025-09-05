import { useEffect, useState } from 'react'
import { updateCategory } from '../services/list'
import { useParams } from 'react-router-dom'

import { useAxiosFetch } from '../../hooks'
import { useRootUrl } from '../../contexts/root_url';

interface CategoryProps {
    id: number;
    name: string;
    category_number: number;
    level: string;
}

export function EditCategory(props: any) {
    const [name, setName] = useState<string>('')
    const [categoryNumber, setCategoryNumber] = useState<string>('')
    const [level, setLevel] = useState<string>('')

    //const navigate = useNavigate();
    const params = useParams<{categoryId: string}>();
    const {rootUrl} = useRootUrl();
    /*
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
    */

    const url = `/categories/${params.categoryId}`

    const { data: category, loading, error } = useAxiosFetch<CategoryProps>({ url: url, method: 'get' })
    useEffect(() => {
        if (category) {
            setName(category.name)
            setCategoryNumber(category.category_number.toString())
            setLevel(category.level)
        }
    },[category])

const update_category = () => {
    let category_params = {
        name: name,
        category_number: categoryNumber,
        level: level,
    }
    updateCategory(rootUrl, params.categoryId, category_params )
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
            <div className='bg-bgColor2 text-textColor2 mb-2'>Edit Category</div>
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
                    <button className='bg-bgColor3 m-3 p-1' onClick={update_category}>Update Category</button>
                    <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
                </div>
       
        </div>
    )
}
