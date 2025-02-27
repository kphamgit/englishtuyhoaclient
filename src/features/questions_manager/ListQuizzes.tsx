//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useState } from 'react';
import DataTable from './data-table';
import { DataRowProps, QuestionProps, UnitProps } from './types';
import { Outlet, useParams } from 'react-router-dom';

/*
interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }
*/
  
//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuizzes(props:any) {
    
        const [data, setData] = useState<DataRowProps[]| undefined>([])
        const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string}>();
        //const [newQuestionFormat, setNewQuestionFormat] = useState('1')
        /*
 <Route path="sub_categories/:sub_categoryId" element={<SubCategoryPageTeacher />}>
                    <Route path="quizzes/:unit_id" element={<ListQuizzes />} />
        */
        const url = `units/${params.unit_id}`

          const columns = [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Quiz No.', accessor: 'item_number' },
            { Header: 'Quiz name', accessor: 'item_name' },
            { Header: 'Edit', accessor: 'edit_link' },
            { Header: 'Clone', accessor: 'clone_button' },
            { Header: 'Delete', accessor: 'delete_button' },
            { Header: 'Extra Link', accessor: 'extra_link' },
          ];
        

        const { data: unit, loading, error } =
            useAxiosFetch<UnitProps>({ url: url, method: 'get' })
       
  return (
    <div>
      <div className='flex flex-row justify-center text-xl bg-navCatButtonBgActive text-textColor2'>Unit: {unit?.name}</div>
      <div>
        <div className='bg-bgColor2 text-textColor1'>Quizzes: </div>
        <div className='flex flex-row  bg-bgColor1 text-textColor1 justify-start'>
          <div><DataTable columns={columns} data={data} data_type="quiz" /></div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}