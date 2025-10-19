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


export async function updateUnit(rootUrl: string, id: string | undefined, params: any) {
   
  console.log(" in *********** updateUnit id ",id )
  const url = `${rootUrl}/api/units/${id}`
  //console.log("HEE url", url)
  const response = await axios.put(url, params)
  return response
  //return "test"
}

export async function updateUser(rootUrl: string, id: string | undefined, params: any) {
  console.log(" in updateUser id ",id )
   
  const url = `${rootUrl}/api/users/${id}`
  console.log("in updateUser url", url)
  const response = await axios.put(url, params)
  return response
  //return "test"
}

export async function createCategory(rootUrl: string, params: any) {
  console.log(" in createCategory params ", params )
   
  const url = `${rootUrl}/api/categories`
  //console.log("HEE url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}



export async function updateCategory(rootUrl: string,id: string | undefined, params: any) {
   
  const url = `${rootUrl}/api/categories/${id}`
 // console.log("HEEXZXXXXXX url", url)
  const response = await axios.put(url, params)
  return response
}

export async function createSubCategory(rootUrl: string, params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
   
  const url = `${rootUrl}/api/sub_categories`
  //console.log("createSubCategory url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function updateSubCategory(rootUrl: string, id: string | undefined, params: any) {
   
  const url = `${rootUrl}/api/sub_categories/${id}`
 // console.log("HEEXZXXXXXX url", url)
  const response = await axios.put(url, params)
  return response
}

export async function createUnit(rootUrl: string, params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
   
  const url = `${rootUrl}/api/units`
  //console.log("HEE url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function moveQuestion(rootUrl: string, id: string, quiz_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
   
  const url = `${rootUrl}/api/questions/${id}/move/${quiz_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function moveQuiz(rootUrl: string, id: string, unit_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
   
  const url = `${rootUrl}/api/quizzes/${id}/move/${unit_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function moveUnit(rootUrl: string, id: string, sub_cat_id: string) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
   
  const url = `${rootUrl}/api/units/${id}/move/${sub_cat_id}`
  //console.log("HEE url", url)
  const response = await axios.get(url)
  return response
  //return "test"
}

export async function createQuiz(rootUrl: string, params: any) {
  //console.log(" in updateQuestion id ",id )
   
  const url = `${rootUrl}/api/quizzes`
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function createVideoSegment(rootUrl: string, params: any) {
  //console.log(" in updateQuestion id ",id )
   
  const url = `${rootUrl}/api/video_segments`
  const response = await axios.post(url, params)
  return response
  //return "test"
}


export async function createUser(rootUrl: string, params: any) {
  console.log(" in createUser params = ",params )
   
  const url = `${rootUrl}/api/users`
  const response = await axios.post(url, params)
  return response
  //return "test"
}

export async function updateQuiz(rootUrl: string, id: string | undefined, params: any) {
  // enclose params.videoSegments in the body of the put request

  const url = `${rootUrl}/api/quizzes/${id}`
  console.log("list.ts updateQuiz, url", url)
  const response = await axios.put(url, params)
  return response
}

export async function updateVideoSegment(rootUrl: string, id: string | undefined, params: any) {
  // enclose params.videoSegments in the body of the put request

  const url = `${rootUrl}/api/video_segments/${id}`
  console.log("up video_segments, url", url)
  const response = await axios.put(url, params)
  return response
}

export async function uploadFile(rootUrl: string, formData: any) {
  console.log(" in uploadFile formData= ",formData )
  //console.log(" in updateQuestion id ",body )
   
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

export async function updateQuestion(rootUrl: string, id: string | undefined, params: any) {
   
    const url = `${rootUrl}/api/questions/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
  }

  export async function updateGame(rootUrl: string, id: string | undefined, params: any) {
     
    const url = `${rootUrl}/api/match_games/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
  }

  export async function createGame(rootUrl: string, params: any) {
     
    const url = `${rootUrl}/api/match_games`
    //console.log("HEE url", url)
    const response = await axios.post(url, params)
    return response
  }

  export async function createQuestion(rootUrl: string, params: any) {
    console.log(" in createQuestion rootUrl ", rootUrl )
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
     
    const url = `${rootUrl}/api/questions`
    console.log("createQuestion,  url", url)
    const response = await axios.post(url, params)
    return response
    //return "test"
  }

  

  export async function getQuizAttempts(rootUrl: string, ) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
     
    const url = `${rootUrl}/api/quiz_attempts`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getOrphanQuestions(rootUrl: string, ) {
    //console.log(" XXXXX in getOrphanQuestions")
     
    const url = `${rootUrl}/api/questions/find_orphans`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getQuestionsByFormat(rootUrl: string, format: string) {
    //console.log(" VVVVVVVV in getQuestionsByFormat format =", format)
    //console.log(" in updateQuestion id ",body )
     
    const url = `${rootUrl}/api/questions/find_by_format/${format}`
    ///api/questions/find_by_format/:format
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getS3RecordingObjects(rootUrl: string, student_name: string) {
    
    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
     
    const url = `${rootUrl}/api/s3_utils/list_objects`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    //console.log("get getS3RecordingObjects , response data", response.data)
    return response.data
    //return "test"
  }
//api/questions/:id/clone',

  export async function deleteAudioRecordings(rootUrl: string, student_name: string) {
    //console.log(" in list deleteAudioRecordings student =",student_name)

    //const response = await axios.post(url,{user_answer: user_answer})
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
     
    const url = `${rootUrl}/api/s3_utils/delete_student_recordings`
    
    const response = await axios.post(url, {prefix: `audios/recordings/${student_name}`})
    console.log(" deleteAudioRecordings , response data", response.data)
    return response.data
    //return "test"
  }

//api/questions/:id/clone',
//delete_student_recordings
export async function cloneQuestion(rootUrl: string, id: string): Promise<QuestionProps> {
  
   
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
export async function clone_a_row(rootUrl: string, id: string, type: string): Promise<CloneProps | undefined> {
  console.log(" clone a row type = ",type)
   
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
export async function deleteTableRow(rootUrl: string, id: string, data_type: string): Promise<MProps > {
  console.log("DElet table row data type =", data_type)
   
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

export async function deleteQuizAttempts(rootUrl: string, quiz_attempt_ids: string[]): Promise<QuestionProps> {
  console.log("deleteAllQuizAttempts xxxx",quiz_attempt_ids)
   
  const url = `${rootUrl}/api/quiz_attempts`
  const response = await axios.delete(url, {data: { quiz_attempt_ids: quiz_attempt_ids }})
  
  return response.data

}

export async function deleteOrphanQuestions(rootUrl: string, question_ids: string[]): Promise<void> {
  console.log("deleteOrphanQuestions xxxx",question_ids)
   
  const url = `${rootUrl}/api/questions`
  const response = await axios.delete(url, {data: { question_ids: question_ids }})

}

export async function renumberRows(rootUrl: string, row_ids: string[], data_type: string): Promise<string> {
   
  let url = ''
   
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
  export async function getAClass(rootUrl: string, id: string): Promise<ClassProps> {
     
    const url = `${rootUrl}/api/classes/${id}`
    const response = await axios.get(url)
    //console.log("UUUU in getAClass response.data", response.data)
    return response.data
  
  }
  