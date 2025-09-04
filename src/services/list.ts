import axios from "axios"
import { use } from "framer-motion/client"
import { useRootUrl } from "../contexts/root_url"

type ClassProps = 
    {
        class_id: number,
        class_name: string,
        users: StudentProps[] | undefined
    }

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

export async function getAClass(id: string): Promise<ClassProps> {
    //console.log("in getAClass")
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/classes/${id}`
    const response = await axios.get(url)
   // console.log("UUUU response.data", response.data)
    return response.data
  
  }

  export async function getAGame(id: string | undefined) {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/match_games/${id}` 
    const response = await axios.get(url)
    return response.data
  
  }

  export async function getAllGamee() {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/match_games` 
    const response = await axios.get(url)
    return response.data
  
  }

  export async function upload_form_data_to_s3(formData: any, config: any) {
    const { rootUrl} = useRootUrl();
    const url = `${rootUrl}/api/uploads/do_upload_single` 
    //console.log(" in list upload..url =", url)
    //console.log("form data: ", formData)
     axios.post(url, formData, config).then((response) => {
       return response;
     });
  }