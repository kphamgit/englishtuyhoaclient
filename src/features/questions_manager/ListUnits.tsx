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
export default function ListUnits(props:{units: UnitProps[] | undefined }) {
    
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
            if (props.units) {
              const units_row:DataRowProps[] = props.units.map((unit) => {
                  return {id: unit.id, 
                        item_number: unit.unit_number.toString(), 
                        item_name: `${unit.name}`, 
                        edit_link: "", clone_button: "", 
                        delete_button: "",
                        extra_link: `quizzes/${unit.id}*quizzes`,
                        }
              })
              setData(units_row)
            }
        },[props.units])

        //const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
         // setNewQuestionFormat(event.target.value);
        //}  //  <Link to={`/categories/${params.categoryId}/sub

        return (
          <div className='flex flex-row justify-start bg-red-400'>
            <DataTable columns={columns} data={data} />
            </div>
          );
}


