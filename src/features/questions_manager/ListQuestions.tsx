//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { Link, useParams } from 'react-router-dom';
import { MouseEventHandler, useEffect, useState } from 'react';
import { cloneQuestion, deleteQuestion } from '../services/list';
//import Table from '../components/data-table_old';
import { renumberQuizQuestions } from '../services/list';
import DataTable from './data-table';
import { CategoryRowProps, QuestionRowProps } from './types';

type RadioProps =
  {
    //id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
   // selected: string
   // questionId: number
  }

interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }

  export type QuestionProps = {
    id: string,
    question_number: number,
    format: number,
    audio_src: string,
    audio_str : string,
    video_src : string,
    instruction : string,
    prompt : string,
    content : string,
    words_scramble_direction : string,
    answer_key : string,
    score : number,
    show_help : boolean,
    help1 : string,
    help2 : string,
    coding : boolean,
    quizId : number,
    radio : RadioProps,
    speech_recognition : boolean
}

//{ id: string; question_number: number; format: number; content: string; answer_key: string; }[] | undefined' 
export function ListQuestions(props:any) {
    
        const [subQuestions, setsubQuestions] = useState<QuestionRowProps[] | CategoryRowProps[]>([])
        /*
export interface QuestionRowProps {
    id: string,
    question_number?: number,
    format?: string,
    content? : string,
    answer_key? : string,
    edit_link: string
    clone_button: string,
    delete_button: string
}
        */
        const params = useParams<{ categoryId: string, sub_category_name: string, quiz_id: string}>();
        const [newQuestionFormat, setNewQuestionFormat] = useState('1')
        const url = `/quizzes/${params.quiz_id}/get_questions`

        const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
        "4": "Radio ", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
        "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
      }

          const columns1 = [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Question Number', accessor: 'question_number' },
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
                question_number, 
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
            console.log("MMMMM news", temp)
            /*

            */
              setsubQuestions(temp)
            }
           
            //const names = users.map(({ name }) => name);
        },[quiz, setsubQuestions])

        const paginate = () => {
          /*
            renumberQuizQuestions(params.quiz_id)
            .then(data => {
                console.log("renumber.....", data)
                //console.log("mmmmm mmmmmm data ", data)
                //const new_arr = [...questions, data]
                //const reduced_questions = questions?.filter(question => question.id != data.id)
                //setQuestions(reduced_questions)
                // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
                // why???
                //setQuestions(prev => prev?.push(data))
            })
            .catch(error => {
                console.log(error)
            })
            */
        }

        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setNewQuestionFormat(event.target.value);
        }

        /*
        const paginate = () => {
          if (tableData) {
              console.log("XXXXX")
              const sorted_arr = tableData.map((question, index) => {
                  return { ...question, question_number: index + 1 }
              })
              //console.log("test arr", test_arr)
              setTableData(sorted_arr)
              renumber_question()
          }
      }
      */
        return (
          <>
            <DataTable columns={columns1} data={subQuestions} renumber_question={paginate} />
            
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
/*

New cloze question (1)
New button cloze select question (2)
New button select question (3)
New radio question (4)
New word scramble question (6)
New speech recognition question (7)
New words select question (8)
New recording question (9)
New dropdown question (10)
New letter cloze question (11)


"/categories/1/sub_categories/First%20Grammar%201/list_questions/134/create_question" 
 return (
            <QuestionList columns={columns1} data={subQuestions} renumber_question={paginate} />
          );
*/
//{`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/edit_question/${question.id}`}>
/*
     return (
            <div className="container mx-auto p-4">
              <h1 className="text-lg text-textColor1 font-bold mb-4">Questions Table</h1>
              <button className='text-textColor1' onClick={paginate}>PAGINATE</button>
              { subQuestions &&
              <Table columns={columns1} data={subQuestions} renumber_question={paginate}  />
              }
            </div>
          );
*/

