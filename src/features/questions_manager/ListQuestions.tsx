//import { useAxiosFetch } from '../components/services/useAxiosFetch';
import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../components/Question';
import { Link, useParams } from 'react-router-dom';
import { MouseEventHandler, useEffect, useState } from 'react';
import { cloneQuestion, deleteQuestion } from '../services/list';
import Table from '../components/Table';
import { renumberQuizQuestions } from '../services/list';
import QuestionList from './question-list';
import { QuestionRowProps } from './types';

type RadioProps =
  {
    id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
    selected: string
    questionId: number
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
    
        const [questions, setQuestions] = useState<QuestionProps[] | undefined>([])
        const [subQuestions, setsubQuestions] = useState<QuestionRowProps[] | undefined>([])
    
        const params = useParams<{ categoryId: string, sub_category_name: string, quiz_id: string}>();
        //const url = `/quizzes/${[[params.quiz_id]]}/get_questions`
        const url = `/quizzes/${params.quiz_id}/get_questions`

    
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

        /*
        const clone_question: MouseEventHandler<HTMLButtonElement> = (event) => {
            console.log(" CLONING>.....")
            const el = event.target as HTMLButtonElement
            cloneQuestion(el.id.split('_')[1])
            .then(data => {
                //const new_arr = [...questions, data]
                setQuestions([...questions as any[], data])
                // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
                // why???
                //setQuestions(prev => prev?.push(data))
            })
            .catch(error => {
                console.log(error)
            })
                //useAxiosFetch({ url: url_clone, method: 'get' })
            ///api/questions/:id/clone',
            //console.log("xxxx", url_clone)
        }
        */

        /*
        const delete_question: MouseEventHandler<HTMLButtonElement> = (event) => {
            const el = event.target as HTMLButtonElement
            deleteQuestion(el.id.split('_')[1])
            .then(data => {
                //console.log("mmmmm mmmmmm data ", data)
                //const new_arr = [...questions, data]
                const reduced_questions = questions?.filter(question => question.id != data.id)
                setQuestions(reduced_questions)
                // kpham: typescript tips: use "as any[]" like above to avoid error: type ... must have a '[Symbol.iterator]()' method that returns an iterator.
                // why???
                //setQuestions(prev => prev?.push(data))
            })
            .catch(error => {
                console.log(error)
            })
                //useAxiosFetch({ url: url_clone, method: 'get' })
            ///api/questions/:id/clone',
            //console.log("xxxx", url_clone)
        }
        */

        useEffect(() => {
            const sub_questions = quiz?.questions.map(({ id, question_number, format, content, answer_key }) => ({id, question_number, format, content, answer_key}) )
            //setQuestions(quiz?.questions)
           // const newss= [...subQuestions, edit_link: "test"]
            if (sub_questions) {
            const news = sub_questions.map((product) => {
                const edit_link = `/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/edit_question/${product.id}`
                return {...product, edit_link: edit_link, clone_button: "Clone", delete_button: "Delete" }
            })
            
              setsubQuestions(news)
            }
           
            //const names = users.map(({ name }) => name);
        },[quiz, setsubQuestions])

        const paginate = () => {
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
        }

        return (
            <QuestionList columns={columns1} data={subQuestions} renumber_question={paginate} />
          );
}
/*
 return (
            <QuestionList columns={columns1} data={subQuestions} renumber_question={paginate} />
          );
*/

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

