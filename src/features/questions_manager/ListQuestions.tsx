//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { Link, useParams } from 'react-router-dom';
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
    
        const [subQuestions, setsubQuestions] = useState<DataRowProps[]>([])
        const params = useParams<{ categoryId: string, sub_category_name: string, quiz_id: string}>();
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
          ];
        

        const { data: quiz, loading, error } =
            useAxiosFetch<QuizProps>({ url: url, method: 'get' })
       
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


        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setNewQuestionFormat(event.target.value);
        }

        return (
          <>
            <DataTable columns={columns} data={subQuestions} />
            
            <div className='flex flex-row justify-start'>
              <div>
            <Link to={`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/create_question/${newQuestionFormat}`}
            className='text-textColor1 mx-10'
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
                  <option value="9">Drop Down</option>
                  <option value="9">Letter Cloze</option>
                </select>
              </div>
            </div>
            </>
          );
}


