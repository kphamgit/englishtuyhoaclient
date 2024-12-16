import { useEffect, useState } from 'react'
import { getQuizAttempts } from '../services/list'
import { data } from 'framer-motion/client'

type QuizAttemptProps = {
    id: number,
    completion_status: string,
    score: number,
    userId: number,
    questions_exhausted: boolean,
    errorneous_questions: string,
    quizId: number,
}

export function QuizAttemptsManager(props: any) {
    const [quizAttempts, setQuizAttempts] = useState<QuizAttemptProps[] | undefined>([])
    useEffect(() => {
        getQuizAttempts()
            .then((data) => {
                console.log("..xxxxxxx.", data)
                setQuizAttempts(data)
                }
            )
            .catch(error =>
                console.log(error)
            )
    }, [])

    return (
        <>
            <div>IN QuizAttemptsManager</div>
            {quizAttempts &&
                quizAttempts.map(( quiz_att, index) => (
                    <div key={index} className='text-textColor1 m-1'>{quiz_att.id}</div>
                ))
            }

        </>
    )
}

/*
{
    "id": 1884,
    "completion_status": "uncompleted",
    "score": 0,
    "userId": 15,
    "questions_exhausted": false,
    "errorneous_questions": "",
    "quizId": 207,
    "createdAt": "2024-12-02T23:49:46.000Z",
    "updatedAt": "2024-12-02T23:49:46.000Z"
}
*/