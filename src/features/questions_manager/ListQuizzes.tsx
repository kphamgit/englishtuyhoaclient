//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useState } from 'react';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
//import { renumberQuestions } from '../services/list';
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
       
            //  const params = useParams<{ sub_categoryId: string }>();
   // const { data: sub_category, loading: sub_loading, error: sub_error } = useAxiosFetch<SubCategory>({ url: `/sub_categories/${params.sub_categoryId}`, method: 'get' });
  
            useEffect(() => {
              console.log("here")
              if (unit) {
                //console.log("mmmmnnnn cccccc ", unit.quizzes)
                const quiz_rows: DataRowProps[] | undefined = unit.quizzes?.map((quiz) => {
                    return {
                          id: quiz.id.toString(), 
                          item_number: quiz.quiz_number, 
                          item_name: `${quiz.name}`, 
                          edit_link: "", 
                          delete_button: "",
                          clone_button: "",
                          extra_link: `questions/${quiz.id}*Questions`,
                          }
                })
                console.log(" quiz rows =", quiz_rows)
                setData(quiz_rows)
              }
          },[unit])

        return (
          <>
           <div className='flex flex-row justify-center text-xl bg-bgColor1 text-textColor2'>Quizzes</div>
            <div className='flex flex-row  bg-bgColor1 justify-start'>
            <div><DataTable columns={columns} data={data} data_type="quiz" /></div>
        
            </div>
            </>
          );
}

// <DataTable columns={columns} data={data} />
