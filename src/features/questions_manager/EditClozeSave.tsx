import React, { useState, useEffect, } from 'react'

export function EditClozeSave(props: {question_content: string, set_answer_key: (answer_string: string) => void}) {
        const [questionContent, setQuestionContent] = useState("")
        useEffect(() => {
            setQuestionContent(props.question_content)
        },[props.question_content])

        const getAnswerKey = () => {
            var match_arr = questionContent.match(/\[([\u00C0-\u1EF9a-zA-Z^\'\/\s.,])*\]/g);
            if (match_arr == null) {
                alert(" Please add question content");
            }
            else {
                var answer_str = '';
                for(let i=0; i< match_arr.length; i++) {
                    let bracket_content = match_arr[i].replace('[','').replace(']',''); // remove square brackets
                    if (bracket_content.indexOf('/') >= 0 ) {     //dropdown cloze question
                        if (bracket_content.indexOf('^') < 0 ) {
                            alert("Missing caret ^ for dropdown clozequestion");
                        }
                        else {  
                          var choices = bracket_content.split('/');
                          for(let j=0;j<choices.length;j++) {
                            if (choices[j].indexOf('^') >= 0 ) {
                                let my_answer = choices[j].replace('^','');
                                if (i === 0 ) {
                                    answer_str += my_answer;
                                }
                            else {
                                answer_str += '/' + my_answer;
                            }
                            break;
                            }
                          }
                        }
                    }
                    else if (i === 0) {
                         answer_str += bracket_content;
                    }
                    else {
                      answer_str += '/' + bracket_content;
                    }
                    props.set_answer_key(answer_str)
               }
            }
             //console.log(answer_str)
            
        }

    return (
        <>
        <div className='mx-10 text-white'><span>&nbsp;<button className='bg-green-600' onClick={getAnswerKey}>Gett Answer Key</button></span></div>
        </>
    )
}

export default EditClozeSave