import { useEffect, useState } from 'react'
import { getQuestionsByFormat } from '../services/list'
import { useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRootUrl } from '../../contexts/root_url';

export default function QuestionsByFormat() {
    
    const [data, setData] = useState<any[]>([]);
    const [format, setFormat] = useState<'1' | '2' | '3' | '4' >('1'); // Default format is '0'
    const [routeToQuizQuestions, setRouteToQuizQuestions] = useState<string>('');
   
    const navigate = useNavigate();

    const {rootUrl} = useRootUrl();

    const [questionTypes, setQuestionTypes] = useState<string[]>([
        'Word Cloze',
        'Button Cloze Select',
        'Button Select',
        'Radio',
        'Word Scramble',
        'Speech Recognition',
        'Word Select',
        'Recording',
        'Drop Down',
        'Letter Cloze'
    ]);

    useEffect(() => {
        if (!format) {
            setData([]);
            return;
        }

        //console.log(" root path in QuestionsByFormat = ", rootUrl)
        //console.log("format", format)
        getQuestionsByFormat(rootUrl, format.toString())
            .then((data) => {
                // setOrphanQuestions(data.orphan_questions)
                //console.log(data.questions)
                // store data in a dictionary with data.questions.quiz_id as key
               setData(data.questions);
            })
            .catch(error =>
                console.log(error)
            )
    }, [format, rootUrl])

   
    function fetch_quiz(quiz_id: string) {
        let unit_id = '';
        let sub_category_id = '';
        let category_id = '';

        //console.log("fetch quiz with id = ", quiz_id);
        const quiz_url = `${rootUrl}/api/quizzes/${quiz_id}/get_questions`;
        //console.log("quiz_url = ", quiz_url);
        axios.get(quiz_url)
          .then(quiz => {
            //console.log('Quiz data:', quiz.data);
            unit_id = quiz.data.unitId;
            //console.log("Quiz fetched, unitId = ", unit_id);
            const unit_url = `${rootUrl}/api/units/${unit_id}`;
            //console.log("unit_url = ", unit_url);
            // Now use data from response1 in the second request
            return axios.get(unit_url); 
          })
          .then(unit => {
            //console.log('Unit fetched, data:', unit.data);
            sub_category_id = unit.data.subCategoryId;
            //console.log("Unit fetched, subCategoryId = ", sub_category_id);
            const sub_category_url = `${rootUrl}/api/sub_categories/${sub_category_id}`;
            //console.log("sub_category_url = ", sub_category_url);
            // Now use data from response2 in the third request
            return axios.get(sub_category_url);
          })
          .then(sub_category => {
            //console.log('Sub-category fetched, data:', sub_category.data);
            category_id = sub_category.data.categoryId;
            //console.log(" unit_id = ", unit_id, ", sub_category_id = ", sub_category_id, ", category_id = ", category_id);
            const react_router_str = `categories/${category_id}/sub_categories/${sub_category_id}/display_unit/${unit_id}/questions/${quiz_id}`;
            //console.log("react_router_str = ", react_router_str);
            navigate('/' + react_router_str); 
            setRouteToQuizQuestions(react_router_str);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }

    return (
        <div>
            <div>
                <div className='text-white bg-bgColor3'>{routeToQuizQuestions}</div>
               {/*  make a select box for question types */}
                <select
                    className='text-white bg-bgColor1 p-2'
                    value={format}
                    onChange={(e) => setFormat(e.target.value as '1' | '2' | '3' | '4')}
                >
                    {questionTypes.map((type, index) => (
                        <option key={index} value={(index + 1).toString()}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

         
            {data.map((item, index) => {
                return (
                    <div key={index} className='flex flex-row justify-start mb-3'>
                        <div className='text-white bg-bgColor1 p-2'>
                            Question id: {item.id}
                        </div>
                        <div className='text-white bg-bgColor1 p-2'>
                            Question number: {item.question_number}
                        </div>
                        <div className='text-white bg-bgColor1 p-2'>
                            Content: {item.content}
                        </div>
                        <div className='text-white bg-green-700 p-2 rounded-md'>
                            <button onClick={() => (fetch_quiz(item.quiz_id)) }>Edit Quiz {item.quiz_id}</button>
                        </div>
                       
                        
                    </div>
                )
            })
            }
        </div>
    )
}
