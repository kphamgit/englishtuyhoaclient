import axios from "axios";
import { QuestionProps } from "../questions_manager/types";
import { sub, use } from "framer-motion/client";
import { QuestionRowProps } from "../questions_manager/types";
import { useRootUrl } from "../../contexts/root_url";

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


export async function updateUnit(id: string | undefined, params: any) {
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/units/${id}`
  //console.log("HEE url", url)
  const response = await axios.put(url, params)
  return response
  //return "test"
}

export async function updateUser(id: string | undefined, params: any) {
  console.log(" in updateUser id ",id )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/users/${id}`
  console.log("in updateUser url", url)
  const response = await axios.put(url, params)
  return response
  //return "test"
}

export async function createCategory(params: any) {
  console.log(" in createCategory params ", params )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/categories`
  //console.log("HEE url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}



export async function updateCategory(id: string | undefined, params: any) {
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/categories/${id}`
 // console.log("HEEXZXXXXXX url", url)
  const response = await axios.put(url, params)
  return response
}

export async function createSubCategory(params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/sub_categories`
  //console.log("createSubCategory url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function updateSubCategory(id: string | undefined, params: any) {
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/sub_categories/${id}`
 // console.log("HEEXZXXXXXX url", url)
  const response = await axios.put(url, params)
  return response
}

export async function createUnit(params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/units`
  //console.log("HEE url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function moveQuestion(id: string, quiz_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/questions/${id}/move/${quiz_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function moveQuiz(id: string, unit_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/quizzes/${id}/move/${unit_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function moveUnit(id: string, sub_cat_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/units/${id}/move/${sub_cat_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function createQuiz(params: any) {
  //console.log(" in updateQuestion id ",id )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/quizzes`
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function createUser(params: any) {
  console.log(" in createUser params = ",params )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/users`
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function updateQuiz(id: string | undefined, params: any) {
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/quizzes/${id}`
 // console.log("HEEXZXXXXXX url", url)
  const response = await axios.put(url, params)
  return response
}

export async function uploadFile(formData: any) {
  console.log(" in uploadFile formData= ",formData )
  //console.log(" in updateQuestion id ",body )
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/upload_s3/do_upload_single`
  //console.log("HEE url", url)
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response
  //return "test"
}

export async function updateQuestion(id: string | undefined, params: any) {
  const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/questions/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
  }

  export async function updateGame(id: string | undefined, params: any) {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/match_games/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
  }

  export async function createGame(params: any) {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/match_games`
    //console.log("HEE url", url)
    const response = await axios.post(url, params)
    return response
  }

  export async function createQuestion(params: any) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/questions`
    console.log("createQuestion,  url", url)
    const response = await axios.post(url, params)
    return response
    //return "test"
  }

  export async function getQuizAttempts() {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/quiz_attempts`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getOrphanQuestions() {
    //console.log(" XXXXX in getOrphanQuestions")
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/questions/find_orphans`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getQuestionsByFormat(format: string) {
    //console.log(" VVVVVVVV in getQuestionsByFormat format =", format)
    //console.log(" in updateQuestion id ",body )
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/questions/find_by_format/${format}`
    ///api/questions/find_by_format/:format
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getS3RecordingObjects(student_name: string) {
    
    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/s3_utils/list_objects`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    //console.log("get getS3RecordingObjects , response data", response.data)
    return response.data
    //return "test"
  }
//api/questions/:id/clone',

  export async function deleteAudioRecordings(student_name: string) {
    //console.log(" in list deleteAudioRecordings student =",student_name)

    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/s3_utils/delete_student_recordings`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    console.log(" deleteAudioRecordings , response data", response.data)
    return response.data
    //return "test"
  }

//api/questions/:id/clone',
//delete_student_recordings
export async function cloneQuestion(id: string): Promise<QuestionProps> {
  
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/questions/${id}/clone`
  const response = await axios.get(url)
  //console.log("UUUU in getAClass response.data", response.data)
  return response.data

}

interface CloneProps {
  id: string,
  item_number: number
}

//export async function clone_a_row(id: string, type: string): Promise<QuestionRowProps | undefined> {
export async function clone_a_row(id: string, type: string): Promise<CloneProps | undefined> {
  console.log(" clone a row type = ",type)
  const { rootUrl} = useRootUrl();
  if (type === "question") {
  
  const url = `${rootUrl}/api/questions/${id}/clone`
  const response = await axios.get(url)
    return response.data
  }
  else if (type === "quiz") {
    console.log("EEEEE EEEEE clone quiz id=", id)
    
    const url = `${rootUrl}/api/quizzes/${id}/clone`
    const response = await axios.get(url)
    return response.data
  }
  else {
    return undefined
  }
}

interface MProps {
  id: string | undefined
}
export async function deleteTableRow(id: string, data_type: string): Promise<MProps > {
  console.log("DElet table row data type =", data_type)
  const { rootUrl} = useRootUrl();
  //let response: MProps | undefined
  if (data_type === 'question') {
    console.log(" here ....")
    
    const url = `${rootUrl}/api/questions/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else if (data_type === 'quiz') {
   
    const url = `${rootUrl}/api/quizzes/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else if (data_type === 'units') {
   
    const url = `${rootUrl}/api/units/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else if (data_type === 'user') {
   
    const url = `${rootUrl}/api/users/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else {
    return {id: '0'}
  }
}

export async function deleteQuizAttempts(quiz_attempt_ids: string[]): Promise<QuestionProps> {
  console.log("deleteAllQuizAttempts xxxx",quiz_attempt_ids)
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/quiz_attempts`
  const response = await axios.delete(url, {data: { quiz_attempt_ids: quiz_attempt_ids }})
  
  return response.data

}

export async function deleteOrphanQuestions(question_ids: string[]): Promise<void> {
  console.log("deleteOrphanQuestions xxxx",question_ids)
  const { rootUrl} = useRootUrl();
  const url = `${rootUrl}/api/questions`
  const response = await axios.delete(url, {data: { question_ids: question_ids }})

}

export async function renumberRows(row_ids: string[], data_type: string): Promise<string> {
   
  let url = ''
  const { rootUrl} = useRootUrl();
  if (data_type === 'question') {
    
     url = `${rootUrl}/api/questions/renumber`
  }
  else if (data_type === 'quiz') {
    //console.log("xxxxx renumberRows data type =", data_type)
    url = `${rootUrl}/api/quizzes/renumber`
  }
  else if (data_type === 'unit') {
    //console.log("xxxxx renumberRows data type =", data_type)
    url = `${rootUrl}/api/units/renumber`
  }
  const response = await axios.post(url, {row_ids: row_ids})
  //console.log("UUUU in getAClass response.data", response.data)
  
  return "response.data"

}
  export async function getAClass(id: string): Promise<ClassProps> {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/classes/${id}`
    const response = await axios.get(url)
    //console.log("UUUU in getAClass response.data", response.data)
    return response.data
  
  }
  