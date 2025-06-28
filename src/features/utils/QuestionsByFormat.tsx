import { useEffect, useRef, useState } from 'react'
import { getQuestionsByFormat } from '../services/list'
import { useAppSelector } from '../../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuestionsByFormat() {
    
    //const rootpath = useAppSelector(state => state.rootpath.value)
    const rootpath = useAppSelector(state => state.rootpath.value)

    const [data, setData] = useState<any[]>([]);
    const [format, setFormat] = useState<'1' | '2' | '3' | '4' >('1'); // Default format is '0'
    const [url_to_quiz_questions, setUrlToQuizQuestions] = useState<string>('');
   
    const navigate = useNavigate();

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

        console.log(" root path in QuestionsByFormat = ", rootpath)
        //console.log("format", format)
        getQuestionsByFormat(format.toString())
            .then((data) => {
                // setOrphanQuestions(data.orphan_questions)
                //console.log(data.questions)
                // store data in a dictionary with data.questions.quiz_id as key
               setData(data.questions);
            })
            .catch(error =>
                console.log(error)
            )
    }, [format, rootpath])

    const fetch_quiz_old = (quiz_id: string) => {
        //console.log("fetch quiz with id = ", quiz_id)
        const url = `${rootpath}/api/quizzes/${quiz_id}/get_info`;
     
        setUrlToQuizQuestions(`questions/${quiz_id}`);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("fetched quiz data = ", data);
                const unit_id = data.unitId;
                const part = `display_unit/${unit_id}`;
                // prepend part to url_to_quiz_questions
                setUrlToQuizQuestions((prevUrl) => {
                    const newUrl = `${part}/${prevUrl}`;
                    console.log("****** newUrl = ", newUrl);
                    return newUrl;
                });
                // fetch unit based on unit_id
                const unitUrl = `${rootpath}/api/units/${unit_id}`;
                return fetch(unitUrl);
            })
            .then(response => response.json())
            .then(unitData => {
                console.log("fetched unit data = ", unitData);
                const subCategoryId = unitData.subCategoryId;
                const part = `sub_categories/${subCategoryId}`;
                setUrlToQuizQuestions((prevUrl) => {
                    const newUrl = `${part}/${prevUrl}`;
                    console.log("****** newUrl after sub_category = ", newUrl);
                    return newUrl;
                });
                // prepend part to url_to_quiz_questions
                //url_to_quiz_questions = `${part}/${url_to_quiz_questions}`;
                //setUrlToQuizQuestions(`${part}/${url_to_quiz_questions}`);
                // fetch sub_category based on subCategoryId
                const subCategoryUrl = `${rootpath}/api/sub_categories/${subCategoryId}`;
                return fetch(subCategoryUrl);
            })
            .then(response => response.json())
            .then(subCategoryData => {
                console.log("fetched sub_category data = ", subCategoryData);
                const categoryId = subCategoryData.categoryId;
                const part = `categories/${categoryId}`;
                setUrlToQuizQuestions((prevUrl) => {
                    const newUrl = `${part}/${prevUrl}`;
                    console.log("****** newUrl after category = ", newUrl);
                    return newUrl;
                });
                // prepend part to url_to_quiz_questions
                //setUrlToQuizQuestions(`${part}/${url_to_quiz_questions}`);
                // fetch category based on categoryId
                // You can handle the fetched quiz data here, e.g., display it or store it in state
            })
            .catch(error => {
                console.error("Error fetching quiz:", error);
            });
    }

    const fetch_quiz = async (quiz_id: string) => {
        try {
            const url = `${rootpath}/api/quizzes/${quiz_id}`;
    
            setUrlToQuizQuestions(`questions/${quiz_id}`);
    
            // Fetch quiz data
            const { data } = await axios.get(url);
            console.log("fetched quiz data = ", data);
    
            const unit_id = data.unitId;
            const part = `display_unit/${unit_id}`;
            setUrlToQuizQuestions((prevUrl) => {
                const newUrl = `${part}/${prevUrl}`;
                console.log("****** newUrl = ", newUrl);
                return newUrl;
            });
    
            // Fetch unit data
            const unitUrl = `${rootpath}/api/units/${unit_id}`;
            const { data: unitData } = await axios.get(unitUrl);
            console.log("fetched unit data = ", unitData);
    
            const subCategoryId = unitData.subCategoryId;
            const subCategoryPart = `sub_categories/${subCategoryId}`;
            setUrlToQuizQuestions((prevUrl) => {
                const newUrl = `${subCategoryPart}/${prevUrl}`;
                console.log("****** newUrl after sub_category = ", newUrl);
                return newUrl;
            });
    
            // Fetch sub-category data
            const subCategoryUrl = `${rootpath}/api/sub_categories/${subCategoryId}`;
            const { data: subCategoryData } = await axios.get(subCategoryUrl);
            console.log("fetched sub_category data = ", subCategoryData);
    
            const categoryId = subCategoryData.categoryId;
            const categoryPart = `categories/${categoryId}`;
            setUrlToQuizQuestions((prevUrl) => {
                const newUrl = `${categoryPart}/${prevUrl}`;
                console.log("****** newUrl after category = ", newUrl);
                return newUrl;
            });
    
            // You can handle the fetched quiz data here, e.g., display it or store it in state
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    };

    const edit_questions = () => {
        //console.log("edit questions with quiz_id = ", quiz_id)
        //const url = url_to_quiz_questions;
        console.log("url_to_quiz_questions = ", url_to_quiz_questions)
        //navigate(`/${url_to_quiz_questions}`);
    }
        
    /*
 <a href={`/${url_to_quiz_questions}`} className='text-textColor1'>
                    View quiz questions
                </a>
                 <span>1.Cloze, 2.ButtonCloze, 3.Button Select, 4.Radio, 6.DragDrop, 7.Speech Recog, 8.Word Select.
                    10.DropDown, 11. Cloze Letters.
                </span>
    */
    return (
        <div>
            <div>
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
                            <button onClick={() => (fetch_quiz(item.quiz_id)) }>Fetch quiz {item.quiz_id}</button>
                        </div>
                        { url_to_quiz_questions &&
            <div className='text-white bg-red-900 p-2 mx-3'>
               <button className='text-textColor1' onClick={edit_questions}>
                    Edit questions
                </button>
            </div>
            }
                        
                    </div>
                )
            })
            }
        </div>
    )
}

/*
              return (
                    <div key={index} className='flex flex-row justify-start'>
                        <div className='text-white bg-bgColor1 p-2'>
                            Question id: {item.id}
                        </div>
                        <div className='text-white bg-bgColor1 p-2'>
                            Question number: {item.question_number}
                        </div>
                        <div className='text-white bg-bgColor1 p-2'>
                            Content: {item.content}
                        </div>
                        <div className='text-white bg-bgColor1 p-2'>
                            Quiz id: {item.quiz_id}
                        </div>
                    </div>
                )
*/