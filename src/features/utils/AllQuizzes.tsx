import { useEffect, useState } from 'react'
import { getQuestionsByFormat } from '../services/list'
import { useAppSelector } from '../../redux/store';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

type MissingQuestionNumbers = {
    quiz_id: string;
    missing_question_numbers: number[];
  };

export default function AllQuizzes() {
    
    
    //const rootpath = useAppSelector(state => state.rootpath.value)
    const rootpath = useAppSelector(state => state.rootpath.value)
    const [quizId, setQuizId] = useState<string>('');
    const [quizzesWithMissingQuestions, setQuizzesWithMissingQuestions] = useState<any[]>([]);

    const navigate = useNavigate();

    const [testArr, setTestArr] = useState<number[]>([2,3,4,7,8,9,10]);
    
    function fetch_all_quizzes() {
        //console.log("fetch all quizzes");
        ///api/quizzes/get_all',
        const quiz_url = `${rootpath}/api/quizzes/get_all`;
       // console.log("quiz_url = ", quiz_url);
        axios.get(quiz_url)
          .then(response => {
           //console.log('All quizzes data:', quizzes.data.all_question_numbers);
           //const all_missing_question_numbers: MissingQuestionNumbers[] = quizzes.data.quizzes;
           const quizzes = response.data.quizzes;
           //console.log("Total quizzes with missing questions: ", quizzes);
           setQuizzesWithMissingQuestions(quizzes);
              //setAllQuizzesWithMissingQuestions(all_missing_question_numbers);
             //console.log('All quizzes with missing question numbers:', all_missing_question_numbers);
           /*
           all_missing_question_numbers.forEach(async (qnum) => {
            //console.log('Missing question numbers in quiz:', qnum.quiz_id);
            // fetch each quiz details
            const quizName = await fetch_quiz(qnum.quiz_id);
            if (quizName) {
              console.log(`Quiz name: ${quizName}`);
              console.log("    ")
            } else {
              console.log('Failed to fetch quiz name.');
            }
           
           })
           */
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }

      function get_full_path(quiz_id: string) {
        //console.log("fetch all quizzes");
        ///api/quizzes/get_all',
        const quiz_url = `${rootpath}/api/quizzes/get_full_path/${quiz_id}`;
       // console.log("quiz_url = ", quiz_url);
        axios.get(quiz_url)
          .then(full_path => {
           //console.log('All quizzes data:', quizzes.data.all_question_numbers);
              //console.log('Full path data:', full_path.data);
              const quiz_id = full_path.data.quiz.id
              const unit_id = full_path.data.unit.id
              const sub_category_id = full_path.data.sub_category.id
              const category_id = full_path.data.category.id
              //console.log(`http://localhost:5173/categories/${category_id}/sub_categories/${sub_category_id}/display_unit/${unit_id}/questions/${quiz_id}`);
              const quiz_route = `/categories/${category_id}/sub_categories/${sub_category_id}/display_unit/${unit_id}/questions/${quiz_id}`
              navigate(quiz_route)
              /*
{
    "quiz": {
        "id": 6,
        "name": "Law for Kids. Grammar 1",
        "quiz_number": 1,
        "disabled": false,
        "video_url": null,
        "unitId": 4
    },
    "unit": {
        "id": 4,
        "name": "Level G",
        "unit_number": 4,
        "level": null,
        "content": "<p>Level G unit 4 content content content</p>",
        "subCategoryId": 2
    },
    "sub_category": {
        "id": 2,
        "name": "Razkids",
        "level": "beginner,basic,intermediate,advanced",
        "sub_category_number": 1,
        "categoryId": 2
    },
    "category": {
        "id": 2,
        "name": "Reading",
        "level": "beginner,basic,intermediate,advanced",
        "category_number": 2
    }
}
    //http://localhost:5173/categories/2/sub_categories/2/display_unit/4/questions/6
    //categories/${category_id}/sub_categories/${sub_category_id}/display_unit/${unit_id}/questions/${quiz_id}
              */
           })
      }
   
      async function fetch_quiz(quiz_id: string): Promise<string | null> {
        //console.log("fetch quiz with id = ", quiz_id);
        const quiz_url = `${rootpath}/api/quizzes/${quiz_id}`;
      
        try {
          const response = await axios.get(quiz_url);
          //console.log('quiz id:', quiz_id);
          return response.data.name; // Return the quiz name
        } catch (error) {
          console.error('Error fetching quiz:', error);
          return null; // Return null if there is an error
        }
      }

    return (
        <>
        <div className='text-white bg-blue-700 p-2 rounded-md w-300 mb-5'>
        This panel is to deal with the quizzes that have radio questions which
        have been invertently deleted from the database (white the radios database
        rows are still there. I made this mistake on Sep 1, 2025). Clicking on
        the "Get All Quizzes With Missing Questions" button below will list out (in the 
        debugging console) all such quizzes
        along with their missing question numbers.
    </div>
        <div className='justify-center m-5 p-20'>
               
                        <div className='text-white bg-green-700 p-2 rounded-md w-36 mb-5'>
                            <button onClick={() => (fetch_all_quizzes()) }>Get All Quizzes With Missing Questions</button>
                        </div>
                        <div className='flex flex-row justify-center text-white p-2 rounded-md w-200 my-5'>
                            
                            <button className='bg-orange-400 px-4 mx-3' onClick={() => (fetch_quiz(quizId)) }>Get Quiz</button>
                            <input type="text" 
                                placeholder='quiz id' 
                                className='text-black mx-2 p-1 w-20 mt-2'
                                value={quizId}
                                onChange={(e) => setQuizId(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-row text-white p-2 rounded-md w-200 my-5 justify-center'>
                            
                            <button className='bg-red-500 mx-3' onClick={() => (get_full_path(quizId)) }>Navigate to quiz:</button>
                            <input type="text" 
                                placeholder='quiz id' 
                                className='text-black mx-2 p-1 w-20 mt-2'
                                value={quizId}
                                onChange={(e) => setQuizId(e.target.value)}
                            />
                        </div>
                      <div>
                        {quizzesWithMissingQuestions.map((quiz) => (
                            <div key={quiz.quiz_id} className='text-white bg-bgColor1 p-2 m-2 rounded-md'>
                                <div>Quiz with missing question,  ID: {quiz.quiz_id}</div>
                                
                            </div>
                        ))}
                        </div>
                
        </div>
        </>
    )
}

/*
                 <div>
                        {allQuizzesWithMissingQuestions.map((quiz) => (
                            <div key={quiz.quiz_id} className='text-white bg-bgColor1 p-2 m-2 rounded-md'>
                                <div>Quiz ID: {quiz.quiz_id}</div>
                               
                            </div>
                        ))}
                        </div>
*/

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