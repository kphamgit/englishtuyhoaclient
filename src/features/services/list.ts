import axios from "axios";
import { QuestionProps } from "../questions_manager/types";
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

export async function updateUnit(id: string | undefined, params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const url = `${rootpath}/api/units/${id}`
  //console.log("HEE url", url)
  const response = await axios.put(url, params)
  return response
  //return "test"
}

export async function createUnit(params: any) {
  //console.log(" in updateQuestion id ",id )
  //console.log(" in updateQuestion id ",body )
  const url = `${rootpath}/api/units`
  //console.log("HEE url", url)
  const response = await axios.post(url, params)
  return response
  //return "test"
}

/*
try {
        const response = await axios.post('/api/upload_s3/do_upload_single', newFormData, {
          headers: {
            'enctype': 'multipart/form-data',
          },
        });

        <form method="post" enctype="multipart/form-data" action="/api/uploads/do_upload_single">

    <p>
        <input id="s3_file_path" type="text" name="s3_file_path" size="65" value="">
        <input id="file" type="file" name="file" multiple="">
    </p>

    <p>
        <input type="submit">
    </p>
</form>
		
					form_data.delete('file1')
                       $.ajax({
        					enctype: 'multipart/form-data',
				            url: "/api/uploads/do_upload_single",
				            data: form_data,
				            processData: false,
				            contentType: false,
				            cache: false,
				            timeout: 600000,
                            type: 'POST',
                            success: function (data) {
								console.log("good")
                            },
                            error: function (error) {
                            }
                        })
        

*/

export async function uploadFile(formData: any) {
  console.log(" in uploadFile formData= ",formData )
  //console.log(" in updateQuestion id ",body )
  const url = `${rootpath}/api/upload_s3/do_upload_single`
  //console.log("HEE url", url)
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response
  //return "test"
}

/*
    try {
        const response = await axios.post('/api/upload_s3/do_upload_single', newFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data); // Handle successful upload
      } catch (error) {
        console.error(error); // Handle upload error
      }
*/

export async function updateQuestion(id: string | undefined, params: any) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/questions/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
    //return "test"
  }

 


  export async function updateGame(id: string | undefined, params: any) {
    const url = `${rootpath}/api/match_games/${id}`
    //console.log("HEE url", url)
    const response = await axios.put(url, params)
    return response
  }

  export async function createGame(params: any) {
    const url = `${rootpath}/api/match_games`
    //console.log("HEE url", url)
    const response = await axios.post(url, params)
    return response
  }

  export async function createQuestion(params: any) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/questions`
    console.log("createQuestion,  url", url)
    const response = await axios.post(url, params)
    return response
    //return "test"
  }

  export async function getQuizAttempts() {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/quiz_attempts`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
    return response.data
    //return "test"
  }

  export async function getOrphanQuestions() {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/questions/find_orphans`
    
    const response = await axios.get(url)
    //console.log("get Quiz Attempts , response", response)
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
    //console.log("get getS3RecordingObjects , response data", response.data)
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

interface CloneProps {
  id: string,
  item_number: number
}

//export async function clone_a_row(id: string, type: string): Promise<QuestionRowProps | undefined> {
export async function clone_a_row(id: string, type: string): Promise<CloneProps | undefined> {
  console.log(" clone a row type = ",type)
  if (type === "question") {
  const url = `${rootpath}/api/questions/${id}/clone`
  const response = await axios.get(url)
    return response.data
  }
  else if (type === "quiz") {
    console.log("EEEEE EEEEE clone quiz id=", id)
    const url = `${rootpath}/api/quizzes/${id}/clone`
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
  //let response: MProps | undefined
  if (data_type === 'question') {
    console.log(" here ....")
    const url = `${rootpath}/api/questions/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else if (data_type === 'quiz') {
    const url = `${rootpath}/api/quizzes/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else if (data_type === 'units') {
    const url = `${rootpath}/api/units/${id}`
     const response = await axios.delete(url)
     return response.data
  }
  else {
    return {id: '0'}
  }
}

/*
export async function deleteQuestion(id: string): Promise<QuestionProps> {
  const url = `${rootpath}/api/questions/${id}`
  const response = await axios.delete(url)
  //console.log("UUUU in getAClass response.data", response.data)
  return response.data

}
*/

export async function deleteAllQuizAttempts(quiz_attempt_ids: string[]): Promise<QuestionProps> {
  console.log("deleteAllQuizAttempts xxxx",quiz_attempt_ids)
  const url = `${rootpath}/api/quiz_attempts`
  const response = await axios.delete(url, {data: { quiz_attempt_ids: quiz_attempt_ids }})
  
  return response.data

}

export async function deleteOrphanQuestions(question_ids: string[]): Promise<void> {
  console.log("deleteOrphanQuestions xxxx",question_ids)
  const url = `${rootpath}/api/questions`
  const response = await axios.delete(url, {data: { question_ids: question_ids }})

}

export async function renumberRows(row_ids: string[], data_type: string): Promise<string> {
  
  //console.log("xxxxx renumberRows data type =", data_type)

  //console.log("xxxxx renumberRows row ids =", row_ids)
  
  let url = ''
  if (data_type === 'question') {
     url = `${rootpath}/api/questions/renumber`
  }
  else if (data_type === 'quiz') {
    console.log("xxxxx renumberRows data type =", data_type)
    url = `${rootpath}/api/quizzes/renumber`
  }

  const response = await axios.post(url, {row_ids: row_ids})
  //console.log("UUUU in getAClass response.data", response.data)
  
  return "response.data"

}
  export async function getAClass(id: string): Promise<ClassProps> {
  
    const url = `${rootpath}/api/classes/${id}`
    const response = await axios.get(url)
    //console.log("UUUU in getAClass response.data", response.data)
    return response.data
  
  }
  