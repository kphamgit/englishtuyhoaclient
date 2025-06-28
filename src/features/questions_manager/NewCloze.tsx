import React, { useState, useEffect, } from 'react'
import { getClozeAnswerKey } from './getClozeAnswerKey'

export function NewCloze(props: {question_content: string, set_answer_key: (answer_string: string) => void}) {
        const [questionContent, setQuestionContent] = useState("")

        useEffect(() => {
            console.log("question_content in NewCloze = ", props.question_content)
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
        <div className='mx-20 my-3 text-textColor1 pb-10'><span>&nbsp;<button className='bg-bgColor4 p-1' onClick={getAnswerKey}>Get Answer Key</button></span></div>
        </>
    )
}

export default NewCloze

//props.set_answer_key(answer_str)