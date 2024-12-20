import React, { useState, useEffect, } from 'react'
import { getClozeAnswerKey } from './getClozeAnswerKey'

export function NewCloze(props: {question_content: string, set_answer_key: (answer_string: string) => void}) {
        const [questionContent, setQuestionContent] = useState("")
        useEffect(() => {
            setQuestionContent(props.question_content)
        },[props.question_content])

        const getAnswerKey = () => {
           getClozeAnswerKey(questionContent)
           .then(response => {
                props.set_answer_key(response)
           })
           .catch(err => {
                console.log(err)
           })
        }

    return (
        <>
        <div className='mx-10 text-white'><span>&nbsp;<button className='bg-green-600' onClick={getAnswerKey}>Gett Answer Key</button></span></div>
        </>
    )
}

export default NewCloze

//props.set_answer_key(answer_str)