import { useEffect, useRef, useState } from 'react'
import { deleteQuizAttempts, getQuizAttempts } from '../services/list'
import { useAxiosFetch } from '../../hooks'
import { useRootUrl } from '../../contexts/root_url'
import { time } from 'console'

type QuizAttemptProps = {
 
    id: number,
    completion_status: string,
    score: number,
    questions_exhausted: boolean,
    errorneous_questions: string,
    createdAt: any,
    updatedAt: any,
    "quiz.name": string,
    "user.user_name": string
}

export default function QuizAttemptsManager(props: any) {
   // const [key, setKey] = useState(0); // Update key to re-render the component
    const [quizAttempts, setQuizAttempts] = useState<QuizAttemptProps[] | undefined>([])
    
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const checkboxesRef = useRef<HTMLInputElement[] | undefined>([]);

    const {rootUrl} = useRootUrl()

     const url = `quiz_attempts`
  const { data: quiz_attempts, loading, error } =
        useAxiosFetch<QuizAttemptProps[]>({ url: url, method: 'get' })

useEffect(() => {
    if (quiz_attempts) {
        console.log("in useEffect quiz_attempts", quiz_attempts)
        setQuizAttempts(quiz_attempts)
    }
}, [quiz_attempts])

                /*
{
    "id": 1962,
    "completion_status": "uncompleted",
    "score": 0,
    "questions_exhausted": 0,
    "errorneous_questions": "1953",
    "quizId": 101,
    "userId": 15,
    "createdAt": "2024-12-31T00:42:09.000Z",
    "updatedAt": "2024-12-31T00:44:11.000Z",
    "quiz.id": 101,
    "quiz.name": "Giới từ chỉ thời gian",
    "quiz.quiz_number": 2,
    "quiz.disabled": 0,
    "quiz.video_url": null,
    "quiz.unitId": 13,
    "user.id": 15,
    "user.user_name": "basic2",
    "user.full_name": "basic2",
    "user.role": "student/admin",
    "user.level": "basic, intermediate, advanced",
    "user.message": "test",
    "user.password": "$2b$10$TRTJex3MD9/QALt/Dqi3n.aJUs1VxIG9dr4hpE7qkutHtcv6ZjWHq",
    "user.classId": 2
}
                */
    

    const calculateTimeElapsed = (updatedAt: any, createdAt: any) => {
        //console.log("AAA", updatedAt)
        const updated = new Date(updatedAt)
        const totalSecondsUpdatedAt = updated.getTime()/1000
        console.log("xxxxxxxx xxxxxxx totalSecondsUpdatedAt=", totalSecondsUpdatedAt )
        const created = new Date(createdAt)
        const totalSecondsCreatedAt = created.getTime()/1000
        //console.log("aaaaaa bbbbb totalSecondsCreatedAt=", totalSecondsCreatedAt )
        let totalSecondsElapsed = totalSecondsUpdatedAt - totalSecondsCreatedAt
        console.log("yyyyyyy yyyyy totalSecondsElapsed=", totalSecondsElapsed )
        //console.log("HERE totalSeconds", totalSeconds)
        //let hours = Math.floor(totalSecondsElapsed / 3600)
        if (totalSecondsElapsed >= 60) {
            //totalSecondsElapsed = 0
            // convert to minutes and seconds
            let minutes = Math.floor( totalSecondsElapsed / 60)
            totalSecondsElapsed = totalSecondsElapsed % 60
            // combine minutes and seconds to a string and return
            let timeString = minutes.toString().padStart(2, '0') + 'minutes :' + totalSecondsElapsed.toString().padStart(2, '0') + ' seconds'
          
            return timeString
        }
        
        return totalSecondsElapsed.toString().padStart(2, '0') + ' seconds'
        //return totalSecondsElapsed
    }
  
    
    const convertTime = ((utcDateString: string) => {
        // Step 1:
        //const utcDateString = "2023-06-29T16:45:06.387Z"; // UTC date string (example)
        const utcDateWithoutMillis = utcDateString.slice(0, -5) + "Z";
        const utcDate = new Date(utcDateWithoutMillis);
        //console.log("UTC Date:", utcDate.toISOString());

        // Step 2:
        const offsetMinutes = utcDate.getTimezoneOffset();
        //console.log("Time Zone Offset (minutes):", offsetMinutes);

        // Step 3:
        const localTime = new Date(utcDate.getTime() - offsetMinutes * 60 * 1000);
        //console.log("Local Time:", localTime.toISOString());

        // Display Local Time
        const localTimeString = localTime.toLocaleString();
        return localTimeString
    })

    const handleCheckboxChange = (value: string) => {
        setCheckedItems((prevCheckedItems) => {
          if (prevCheckedItems.includes(value)) {
            return prevCheckedItems.filter((item) => item !== value);
          } else {
            return [...prevCheckedItems, value];
          }
        });
      };

    const handleRefresh = () => {
        getQuizAttempts(rootUrl)
            .then((data) => {          
                //console.log("in handleRefresh data=",data)  
                  setQuizAttempts(data)
                }
            )
            .catch(error =>
                console.log(error)
            )
    }

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
        
        deleteQuizAttempts(rootUrl, checkedItems)
        .then( (data) => {
            setCheckedItems([]);
            //setQuizAttempts([])
            getQuizAttempts(rootUrl)
            .then((data) => {          
                //console.log("in handleRefresh data=",data)  
                  setQuizAttempts(data)
                }
            )
            .catch(error =>
                console.log(error)
            )
        })
        .catch(error => {
            console.log(error)
        })
        
    }

    return (
        <>
            <div className='bg-bgColor1 text-textColor m-5'>
            <button className='bg-bgColor3 text-textColor1 mx-2 p-2' onClick={handleRefresh}>Refresh</button>
            <button className='bg-bgColor3 text-textColor1 mx-2 p-2' onClick={handleCheckAll}>Check All</button>
            <button className='bg-bgColor3 text-textColor1 mx-2 p-2' onClick={deleteChecked}>Delete Checked Quiz Attempts</button>
            </div>
            <table className='bg-bgColor1 text-textColor1'>
                <thead>
                    <tr>
                        <th>Quiz Name</th>
                        <th>User Name</th>
                        <th>Start Time</th>
                        <th>Completed</th>
                        <th className='p-5'>Time Elapsed</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
            {quizAttempts &&
                quizAttempts.map((quiz_att, index) => (
                    <tr key={index}>
                        <td className='p-2'>{quiz_att["quiz.name"]}</td>
                        <td className='p-2'>{quiz_att["user.user_name"]}</td>
                        <td className='p-2'>{convertTime(quiz_att.createdAt)}</td>
                        <td className='p-2'>{quiz_att.completion_status.toString()}</td>
                        <td className='p-2'>{calculateTimeElapsed(quiz_att.updatedAt, quiz_att.createdAt)}</td>
                        <td className='p-2'>{quiz_att.score}</td>
                        <td>
                        <label >
                            <input
                                type="checkbox"
                                value={quiz_att.id}
                                checked={checkedItems.includes(quiz_att.id.toString())}
                                onChange={() => handleCheckboxChange(quiz_att.id.toString())}
                                ref={(el) => {
                                    if (checkboxesRef.current && el !== null) {
                                        checkboxesRef.current[index] = el
                                    }
                                }
                                }
                            />
                            {quiz_att.id}
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