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

    const params = useParams<{ sub_categoryId: string }>();
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
      
        useEffect(() => {
            if (sub_category && sub_category.units) {
              const units_row:DataRowProps[] = sub_category.units.map((unit) => {
                  return {id: unit.id, 
                        item_number: unit.unit_number.toString(), 
                        item_name: `${unit.name}`, 
                        edit_link: `edit_unit/${unit.id}`, 
                        clone_button: "", 
                        delete_button: "",
                        extra_link: `list_quizzes/${unit.id}*Quizzes`,
                        }
              })
              setData(units_row)
            }
        },[sub_category])

        //sub_categories/:sub_categoryId/list_quizzes/:unit_id" element={

        return (
          <div className='bg-bgColor1 text-textColor2 '>
          <div className='flex flex-row justify-center text-xl'>Units</div>
          <div className='flex flex-row justify-start'>
            <DataTable columns={columns} data={data} />
            </div>
            </div>
          )
        
}


