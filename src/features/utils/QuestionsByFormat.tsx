import { useEffect, useRef, useState } from 'react'
import { getQuestionsByFormat } from '../services/list'
import { u, use } from 'framer-motion/client';
import { useParams } from 'react-router-dom';



export default function QuestionsByFormat() {
    
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkboxesRef = useRef<HTMLInputElement[] | undefined>([]);

    const [data, setData] = useState<any[]>([]);
    const [format, setFormat] = useState<'1' | '2' | '3' | '4' >(); // Default format is '0'
   
    useEffect(() => {
        if (!format) {
            setData([]);
            return;
        }

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
    }, [format])

    return (
        <div>
            <div className='text-white'> Enter Format</div>
            <input
                type='text'
                className='text-white bg-bgColor1 p-2'
                placeholder='Enter format (e.g., 1, 2, etc.)'
                autoFocus
                value={format}
                onChange={(e) => setFormat(e.target.value as '1' | '2' | '3' | '4' | undefined)}
            />
            {data.map((item, index) => {
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