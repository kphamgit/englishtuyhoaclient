import React, {useState, useEffect} from 'react'

export function EditButtonSelect(props: {question_content: string, answer_key: string, set_answer_key: (answer_str: string) => void }) {
        const [questionContent, setQuestionContent] = useState('')
        //set_answer_key: (answer_string: string) => void}
        const [choices, setChoices] = useState<string[] | undefined>([])
        useEffect(() => {
            setQuestionContent(props.question_content)
            console.log(props.question_content)
        },[props.question_content])

        const handleChange = (value: any) => {
             props.set_answer_key(value)
        }

        const getAnswerKey = () => {
            const arr = questionContent.split('/')
            setChoices(arr)
            //set_answer_key(arr[0])
          }

    return (
        <div className='mx-14'>
        <div>
        { (choices && choices.length > 0 ) && 
             <select onChange={event => handleChange(event.target.value)}>
               { choices.map( (choice, index) => {
                   if (choice === props.answer_key)
                     return (<option key={index} id={index.toString()} selected >{choice} </option>)
                   else
                     return (<option key={index} id={index.toString()} >{choice} </option>)
               })
               }
             </select>
        }
        <span className='text-white'>&nbsp;&nbsp;<button className='bg-green-600' onClick={getAnswerKey}>Get Answer Key</button></span>
        </div>
        </div>
    )
}
