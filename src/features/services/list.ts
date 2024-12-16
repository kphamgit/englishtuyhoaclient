import axios from "axios";
import { QuestionProps } from "../questions_manager/ListQuestions";
import { sub } from "framer-motion/client";
import { QuestionRowProps } from "../questions_manager/types";

type StudentProps = 
{
   
        id: number,
        user_name: string
        full_name: string
        role: string
        level: string
        classId: number
        message: string
        password: string
    
}

type ClassProps = 
    {
        class_id: number,
        class_name: string,
        users: StudentProps[] | undefined
    }

let rootpath = ''
if (process.env.NODE_ENV === "production") {
    rootpath = 'https://fullstack-kp-f6a689f4a15c.herokuapp.com'
    //rootpath = 'https://www.tienganhtuyhoa.com'
}
else if (process.env.NODE_ENV === "development"){
    rootpath = 'http://localhost:5001'
    
}
else {
    console.log("invalid NODE_ENV ")
}

//http://localhost:5001/api/quiz_attempts

export async function updateQuestion(id: string | undefined, body: {instruction: string}) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/questions/${id}`
    console.log("HEE url", url)
    const response = await axios.put(url, body)
    return response
    //return "test"
  }

  export async function getQuizAttempts() {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/quiz_attempts`
    
    const response = await axios.get(url)
    console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getS3RecordingObjects(student_name: string) {
    //http://localhost:5001/api/s3_utils/list_s3_objects
    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/s3_utils/list_objects`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    console.log("get getS3RecordingObjects , response data", response.data)
    return response.data
    //return "test"
  }
//api/questions/:id/clone',

  export async function deleteAudioRecordings(student_name: string) {
    //console.log(" in list deleteAudioRecordings student =",student_name)
    //http://localhost:5001/api/s3_utils/list_s3_objects
    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/s3_utils/delete_student_recordings`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    console.log(" deleteAudioRecordings , response data", response.data)
    return response.data
    //return "test"
  }

//api/questions/:id/clone',
//delete_student_recordings
export async function cloneQuestion(id: string): Promise<QuestionProps> {
  
  const url = `${rootpath}/api/questions/${id}/clone`
  const response = await axios.get(url)
  //console.log("UUUU in getAClass response.data", response.data)
  return response.data

}

export async function clone_a_row(id: string, type: string): Promise<QuestionRowProps | undefined> {
  
  if (type === "question") {
  const url = `${rootpath}/api/questions/${id}/clone`
  const response = await axios.get(url)
  
  const sub_question: QuestionRowProps = {
    id: response.data.id,
    question_number: response.data.question_number, 
    format: response.data.format,
    content: response.data.content,
    answer_key: response.data.answer_key,
    edit_link: "",
    clone_button: "",
    delete_button: ""
  }
    return sub_question
  }
  else {
    return undefined
  }
}
export async function deleteQuestion(id: string): Promise<QuestionProps> {
  
  const url = `${rootpath}/api/questions/${id}`
  const response = await axios.delete(url)
  //console.log("UUUU in getAClass response.data", response.data)
  return response.data

}

export async function renumberQuizQuestions(id: string | undefined): Promise<QuestionProps> {
  
  const url = `${rootpath}/api/quizzes/${id}/renumber_questions`
  const response = await axios.get(url)
  //console.log("UUUU in getAClass response.data", response.data)
  return response.data

}
  export async function getAClass(id: string): Promise<ClassProps> {
  
    const url = `${rootpath}/api/classes/${id}`
    const response = await axios.get(url)
    //console.log("UUUU in getAClass response.data", response.data)
    return response.data
  
  }
  