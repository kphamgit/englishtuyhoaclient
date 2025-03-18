//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
//import { renumberQuestions } from '../services/list';
import DataTable from './data-table';
import { ColumnProps, DataRowProps, UnitProps } from './types';

  
//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
//export default function ListUnits(props:{units: UnitProps[] | undefined }) {
  type SubCategoryProps = {
    categoryId: number,
    id: number,
    name: string
    sub_category_number: number
    level: string
    units: UnitProps[] | undefined
}

  export default function ListUnits(props:any) {

    const params = useParams<{ categoryId: string, sub_categoryId: string }>();
    const { data: sub_category, loading: sub_loading, error: sub_error } = useAxiosFetch<SubCategoryProps>({ url: `/sub_categories/${params.sub_categoryId}`, method: 'get' });
  

        const [data, setData] = useState<DataRowProps[]>([])
        const columns: ColumnProps[] = [
            { Header: 'Id', accessor: 'id', },
            { Header: 'Unit No.', accessor: 'item_number',  },
            { Header: 'Unit Name', accessor: 'item_name',  },
            { Header: 'Edit', accessor: 'edit_link' ,  },
            { Header: 'Delete', accessor: 'delete_button'  },
            { Header: 'Extra Link', accessor: 'extra_link' },
        ];
      /*
   <Route path="sub_categories/:sub_categoryId/display_unit/unit_id" element={<DisplayUnit />} >
                    <Route path="questions/:quiz_id" element={<ListQuestions />} />
                    <Route path="list_quizzes/:unit_id" element={<ListQuizzes />} />
                  </Route>
      */
     /*
 <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id" element={<ListQuizzes />} />
     */
        //extra_link: `list_quizzes/${unit.id}*Quizzes`,
        useEffect(() => {
            if (sub_category && sub_category.units) {
              const units_row:DataRowProps[] = sub_category.units.map((unit) => {
                  return {id: unit.id, 
                        item_number: unit.unit_number.toString(), 
                        item_name: `${unit.name}`, 
                        edit_link: `edit_unit/${unit.id}`, 
                        clone_button: "", 
                        delete_button: "",
                        extra_link: `display_unit/${unit.id}*Quizzes`,
                        data_type: "unit"
                        }
              })
              setData(units_row)
            }
        },[sub_category])

        //sub_categories/:sub_categoryId/list_quizzes/:unit_id" element={

    return (
      <>
      <div className='bg-bgColor2 text-textColor2 p-3'>Units: </div>
        <div className='grid grid-rows-2 bg-bgColor3 text-textColor2'>
        <div className='flex flex-row justify-start'>
          <DataTable columns={columns} data={data} data_type='unit' />
        </div>
        <div className='mx-5 mt-3'>
          <Link to={`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/create_unit`}
            className='bg-bgColor1 text-textColor1 mx-10 p-2 rounded-md'
          >
            New Unit
          </Link>
        </div>
       </div>
       </>
    )
        
}

/*
  
*/

