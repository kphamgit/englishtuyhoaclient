//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { useEffect, useState } from 'react';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
//import { renumberQuestions } from '../services/list';
import DataTable from './data-table';
import { DataRowProps, QuestionProps, UnitProps } from './types';

interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }

  
//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export default function ListQuizzes(props:any) {
    
        const [data, setData] = useState<DataRowProps[]| undefined>([])
        //const params = useParams<{ categoryId: string, sub_category_name: string, quiz_id: string}>();
        //const [newQuestionFormat, setNewQuestionFormat] = useState('1')
        const url = `units/13`

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
                console.log("mmmmnnnn cccccc ", unit.quizzes)
                /*
[
    {
        "id": 62,
        "name": "Giới từ",
        "quiz_number": 1,
        "disabled": false,
        "video_url": null,
        "unitId": 13
    },
    // extra_link: `quizzes/${quiz.id}*questions`,
]
                */
                const quiz_rows: DataRowProps[] | undefined = unit.quizzes?.map((quiz) => {
                    return {
                          id: quiz.id.toString(), 
                          item_number: quiz.quiz_number, 
                          item_name: `${quiz.name}`, 
                          edit_link: "", 
                          delete_button: "",
                          clone_button: "",
                          extra_link: `questions/${quiz.id}*questions`,
                          }
                })
                console.log(" quiz rows =", quiz_rows)
                setData(quiz_rows)
               /*
[
    {
        "id": 62,
        "item_number": 1,
        "item_name": "Giới từ",
        "edit_link": "",
        "clone_button": "",
        "delete_button": "",
        "extra_link": "extra link"
    },
]
               */
                
/*
export interface DataRowProps {
    id: string,
    item_number: number,
    item_name: string,
    edit_link: string,
    extra_link?: string,
    clone_button: string,
    delete_button: string
}

*/
              }
          },[unit])

            /*
        useEffect(() => {
            const sub_questions = quiz?.questions.map(({ id, question_number, format, content, answer_key }) => {
              return {
                id,
                item_number: question_number, 
                format: formatConversion[format.toString()], //format coming from question is a number. So convert it to a string before indexing into the formatConversion dictionary 
                content, 
                answer_key
              }
            })
            //setQuestions(quiz?.questions)
           // const newss= [...subQuestions, edit_link: "test"]
            if (sub_questions) {
            const temp = sub_questions.map((sub_question) => {
                const edit_link = `/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/edit_question/${sub_question.id}`
                return {...sub_question, edit_link: edit_link, clone_button: "Clone", delete_button: "Delete" }
            })
              setsubQuestions(temp)
            }
           
            //const names = users.map(({ name }) => name);
        },[quiz, setsubQuestions])
        */

       // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        //  setNewQuestionFormat(event.target.value);
       // }

        return (
          <>
           
            QUIX...
            <DataTable columns={columns} data={data} />
            
            </>
          );
}

// <DataTable columns={columns} data={data} />
