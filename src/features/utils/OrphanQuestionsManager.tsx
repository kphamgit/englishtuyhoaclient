import React from 'react'

import { useEffect, useRef, useState } from 'react'
import { deleteAllQuizAttempts, deleteOrphanQuestions, getOrphanQuestions, getQuizAttempts } from '../services/list'

type OrphanQuestionProps = {
 
    id: number,
}

export default function OrphanQuestionsManager(props: any) {
    const [orphanQuestions, setOrphanQuestions] = useState<OrphanQuestionProps[] | undefined>([])
    
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkboxesRef = useRef<HTMLInputElement[] | undefined>([]);
    
    useEffect(() => {
        getOrphanQuestions()
            .then((data) => {
                setOrphanQuestions(data.orphan_questions)
            })
            .catch(error =>
                console.log(error)
            )
    }, [])

    const handleCheckboxChange = (value: string) => {
        setCheckedItems((prevCheckedItems) => {
          if (prevCheckedItems.includes(value)) {
            return prevCheckedItems.filter((item) => item !== value);
          } else {
            return [...prevCheckedItems, value];
          }
        });
      };

    const handleCheckAll = () => {
        if (checkboxesRef.current) {
            const allValues = checkboxesRef.current
                .filter((checkbox) => checkbox !== null)
                .map((checkbox) => checkbox.value);

            if (checkedItems.length === allValues.length) {
                setCheckedItems([]);
            } else {
                setCheckedItems(allValues);
            }
        }
    };

    const deleteChecked = () => {
        //console.log("eeex xxxxxxxx", checkedItems)
        
        deleteOrphanQuestions(checkedItems)
        .then( (data) => {
            //console.log(data)
            setCheckedItems([]);
        })
        .catch(error => {
            console.log(error)
        })
        
    }

    return (
        <>
            <div className='bg-bgColor1 text-textColor m-5'>
            <button className='bg-bgColor3 text-textColor1 mx-2 p-2' onClick={handleCheckAll}>Check All</button>
            <button className='bg-bgColor3 text-textColor1 mx-2 p-2' onClick={deleteChecked}>Delete Checked Questions</button>
            </div>
            <table className='bg-bgColor1 text-textColor1'>
                <tbody>
            {orphanQuestions &&
                orphanQuestions.map((question, index) => (
                    <tr key={index}>
                        <td className='p-2'>{question.id}</td>
                        <td>
                        <label >
                            <input
                                type="checkbox"
                                value={question.id}
                                checked={checkedItems.includes(question.id.toString())}
                                onChange={() => handleCheckboxChange(question.id.toString())}
                                ref={(el) => {
                                    if (checkboxesRef.current && el !== null) {
                                        checkboxesRef.current[index] = el
                                    }
                                }
                                }
                            />
                            {question.id}
                        </label>
                        </td>
                    </tr>
                ))
           
            }
            </tbody>
             </table>
        </>
    )
}
