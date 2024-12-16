import { MouseEventHandler, useEffect, useState } from 'react'
import { getAClass, getS3RecordingObjects, deleteAudioRecordings } from '../services/list'

interface MyProps {
    Key: string;
  //setUser: (user: { name: string; email: string } | null) => void;
}

export function S3ObjectsManager(props: any) {
    const [S3Prefixes, setS3Prefixes] = useState<string[] | undefined>([])
    const [targetClass , setTargetClass ] = useState<string>('')
    const [classstudents, setClassStudents] = useState<string[] | undefined>()

    useEffect(() => {
        if (targetClass.length > 0 ) {
            getAClass(targetClass)
            .then((response) => {
                console.log("users ...", response.users)
                if (response.users) {
                  const names = response.users.map(usr => usr.user_name); 
                  setClassStudents(names)
                }
            })
            .catch(error => {
                console.log(error)
            });
        }
    },[targetClass, setClassStudents])

      //const get_audios = (e:HTMLButtonElement) => {

      //}
    const get_recordings: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        const student_name:string | null = el.textContent
          if (student_name) {
              getS3RecordingObjects(student_name)
                  .then((data) => {
                      //console.log("..xxxxxxxccccccccccc. s3 objects:", data as string[])
                      //data is an array of json objects such as "Key": "audios/recordings/thienkim/", {
                      //"Key": "audios/recordings/thienkim/04af77b0-21b2-4b7f-bcd3-e6f2c3047ee9-thienkim"

                      const arrayOfStrings: string[] = (data as MyProps[]).map(item => {
                          return item.Key; // Assuming you want the 'name' property
                      });
                      //console.log("yyyyyyyyy", arrayOfStrings)
                      setS3Prefixes(arrayOfStrings)
                      //console.log("xxxx ", (data[0].Key))
                      //let result: string[] = data.map(a => a.Key);
                  }
                  )
                  .catch(error =>
                      console.log(error)
                  )
          }
    }

    const delete_recordings: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        const student_name:string | null = el.textContent
          if (student_name) {
            console.log(" calling delee student name", student_name)
              deleteAudioRecordings(student_name)
                  .then((data) => {
                      //console.log("..xxxxxxxccccccccccc. s3 objects:", data as string[])
                      //data is an array of json objects such as "Key": "audios/recordings/thienkim/", {
                      //"Key": "audios/recordings/thienkim/04af77b0-21b2-4b7f-bcd3-e6f2c3047ee9-thienkim"

                      //const arrayOfStrings: string[] = (data as MyProps[]).map(item => {
                        //  return item.Key; // Assuming you want the 'name' property
                      //});
                      //console.log("yyyyyyyyy", arrayOfStrings)
                      //setS3Prefixes(arrayOfStrings)
                      //console.log("xxxx ", (data[0].Key))
                      //let result: string[] = data.map(a => a.Key);
                  }
                  )
                  .catch(error =>
                      console.log(error)
                  )
          }
    }

    return (
        <>
         <div className='mx-1 '>Class Id:<input className='bg-amber-300 px-2 text-sm rounded-md w-4/12' type="text" value={targetClass}
                onChange={e => setTargetClass(e.target.value)}
                            /></div>
            <div className='text-textColor1'>IN s3_Object Manager</div>
            { classstudents &&
                    classstudents.map((student_name, index) => (
                    <div key={index} className='text-textColor3'>
                        <button className='mr-2' onClick={get_recordings}>{student_name}</button>
                        Delete recordings for: <button className='mx-5 bg-bgColor3 mb-2 p-1 rounded-md' onClick={delete_recordings}>{student_name}</button>
                    </div>
                ))
            }
            { S3Prefixes &&
                S3Prefixes.map((prefix, index) => (
                    <div key={index} className='text-textColor3'>{prefix}</div>
                ))
            }
        </>
    )
}
//delete_student_recordings
/*
  const arrayOfJSONStrings = ['{"name": "John"}', '{"name": "Mary"}'];

const arrayOfStrings = arrayOfJSONStrings.map(jsonString => {
  const jsonObject = JSON.parse(jsonString);
  return jsonObject.name; // Assuming you want the 'name' property
});
*/