//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
//import { renumberQuestions } from '../services/list';
import DataTable from './data-table';
import { DataRowProps, QuestionProps } from './types';

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
export default function ListQuestions(props:any) {
    
        const [subQuestions, setsubQuestions] = useState<DataRowProps[] | undefined >([])
        const params = useParams<{ categoryId: string, sub_categoryId: string, unit_id: string, quiz_id: string}>();
        const navigate = useNavigate()
        
        const [newQuestionFormat, setNewQuestionFormat] = useState('1')
        const url = `/quizzes/${params.quiz_id}/get_questions`

        const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
        "4": "Radio ", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
        "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
      }

          const columns = [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Item Number', accessor: 'item_number' },
            { Header: 'Format', accessor: 'format' },
            { Header: 'Content', accessor: 'content' },
            { Header: 'Answer Key', accessor: 'answer_key' },
            { Header: 'Edit', accessor: 'edit_link' },
            { Header: 'Clone', accessor: 'clone_button' },
            { Header: 'Delete', accessor: 'delete_button' },
            { Header: 'Extra Link', accessor: 'extra_link' },
          ];
        
//http://localhost:5173/categories/2/sub_categories/15/display_unit/42/questions/155/take_question/5069
        const { data: quiz } =
            useAxiosFetch<QuizProps>({ url: url, method: 'get' })
            useEffect(() => {
            const sub_questions: DataRowProps[] | undefined = quiz?.questions.map(({ id, question_number, format, content, answer_key }) => {
              return {
                id: id,
                item_number: question_number.toString(),
                item_name: "", 
                format: formatConversion[format.toString()], //format coming from question is a number. So convert it to a string before indexing into the formatConversion dictionary 
                content: content, 
                answer_key: answer_key,
                extra_link: `take_question/${question_number.toString()}*Take (not working)`,
                data_type: "question",
              } as DataRowProps
            })
            if (sub_questions) {
            const temp: DataRowProps[] = sub_questions.map((sub_question) => {
           //Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id/questions/:quiz_id/edit_question/:question_id
                 const edit_link = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}/questions/${params.quiz_id}/edit_question/${sub_question.id}`
                return {...sub_question, edit_link: edit_link, clone_button: "Clone", delete_button: "Delete" }
            })
              setsubQuestions(temp)
            }
           
            //const names = users.map(({ name }) => name);
        },[quiz, setsubQuestions])


        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setNewQuestionFormat(event.target.value);
        }

        const goBackToQuizzes = () => {
            const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}`
            navigate(url)
        }

  return (
    <>
      <div className='text-textColor1 p-2 flex flex-row justify-center text-xl mt-3 mb-3'>
        <div className='mr-10'>Quiz: {quiz?.name} </div>
      </div>
     
      <div className='flex flex-row justify-start text-textColor1 bg-bgColor1 mx-3 p-1 text-lg'>
       
       <div className='text-lg text-textColor1 bg-bgColor1 mx-3 p-2'>Quiz ID: {quiz?.id}</div>
      </div>
      <div className='flex flex-row  justify-start'>
      <DataTable columns={columns} data={subQuestions} data_type="question" />
      </div>

      <div className='flex flex-row justify-start pb-10'>
        <div>
          <Link to={`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_questions/${params.quiz_id}/create_question/${newQuestionFormat}/${quiz?.questions.length}`}
            className='text-textColor1 bg-bgColor1 mx-10 my-4 p-1 rounded-md'
          >
            New Question
          </Link>
        </div>
        <div>
          <select value={newQuestionFormat} onChange={handleChange}>
            <option value="1" >Cloze</option>
            <option value="2">Button Cloze Select</option>
            <option value="3">Button Select</option>
            <option value="4">Radio</option>
            <option value="6">Scramble</option>
            <option value="7">Speech Recognition</option>
            <option value="8">Words Select</option>
            <option value="9">Recording</option>
            <option value="10">Drop Down</option>
            <option value="11">Letter Cloze</option>
          </select>
        </div>
      </div>
    </>
  );
}
/*
 <Link to={`/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}`}>
          Back to quizzes
        </Link>
*/


