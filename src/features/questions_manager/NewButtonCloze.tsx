import React, { useState, useEffect, useImperativeHandle, } from 'react'

export interface NewButtonClozeComponentProps {
    //define the props that you want to pass to the child component
    ref: React.Ref<ButtonClozeComponentHandle>; // use this to access the child component handle
    question_content: string;
    set_answer_key: (answer_string: string) => void;
}

export interface ButtonClozeComponentHandle {
    //declare or type the child component handle
    getChoices: () => {};  // return a string separated by slashes
}

const NewButtonCloze: React.FC<NewButtonClozeComponentProps> = ({ question_content, set_answer_key, ref }) => {

//export function NewButtonCloze1(props: {question_content: string, set_answer_key: (answer_string: string) => void}) {
        const [questionContent, setQuestionContent] = useState("")
        const [choices, setChoices] = useState<string>('')

        // getChoices is called (through the handler) when user saves the question
        const getChoices = () => {
            if (choices) {
               return choices
            } else {
                return ''
            }
        }
          useImperativeHandle(ref, () => ({
              getChoices,
          }));

        useEffect(() => {
            //console.log("question_content in NewCloze = ", question_content)
            setQuestionContent(question_content)
        },[question_content])

        const getAnswerKey = () => {
            const regex = /\[(.*?)\]/g;
            //console.log("question_content = ", questionContent)
            const matches = questionContent.match(regex);
            if (matches && matches.length > 0) {
               // remove the square brackets from the matches
                const answerKey = matches.map(match => match.replace(/[\[\]]/g, '')).join('/');
                set_answer_key(answerKey)
                // also set the choices state
                setChoices(answerKey);
            }
        }

    return (
        <>
        <div className='mx-20 my-3 text-textColor1 pb-10'><span>&nbsp;<button className='bg-bgColor4 p-1' onClick={getAnswerKey}>Get Answer Key
        </button></span></div>
        <div className='bg-bgColor2 text-textColor3 mb-3 mt-5'>Choices (separated by slashes)</div>
        <input className='bg-bgColor4 text-textColor4 m-2 p-2 mb-10' type="text"
                value={choices}
                onChange={e => setChoices(e.target.value)}
                size={70}
                placeholder="choice1/choice2"
        />
        </>
    )
}

export default NewButtonCloze

//props.set_answer_key(answer_str)