import { useRef, useState } from 'react'
import { EditorRef } from './tiptap_editor/SimpleEditor'
import SimpleEditor from './tiptap_editor/SimpleEditor'
import { createQuestion } from '../services/list';
import NewCloze from './NewCloze';
import { RadioComponentHandle } from './types';
import NewRadio from './NewRadio';
import { WordScrambleComponentHandle } from './types';
import NewWordScramble from './NewWordScramble';
import NewButtonCloze, { ButtonClozeComponentHandle }  from './NewButtonCloze';
import NewCheckbox, { NewCheckboxComponentHandle } from './NewCheckbox';
import { useRootUrl } from '../../contexts/root_url';

import { CloseModalProps, NewModalContentProps } from './ListQuestions';

//export interface CloseNewModalProps {
   // video_segment_id?: string
 // }

interface NewQuestionProps {
 
   // format: string;
   //quiz_id: string;
   // quiz_has_video: boolean;
    modal_content: NewModalContentProps;
    onClose: (params: CloseModalProps) => void;
  }
  
  //const NewQuestion: React.FC<NewQuestionProps> = ({format, quiz_id, quiz_has_video, content, onClose }) => {
    const NewQuestion: React.FC<NewQuestionProps> = ({ modal_content, onClose }) => {
    // content is the current question number
    
          const [prompt, setPrompt] = useState<string>('')
          const [audioSrc, setAudioSrc] = useState('')
          const [audioStr, setAudioStr] = useState('')
          const [questionContent, setQuestionContent] = useState('')
         
          const {question_number, format, quiz_has_video, quiz_id} = modal_content
          
          const [questionNumber, setQuestionNumber] = useState<number>(question_number ? question_number : 1) 

         // const [questionNumber, setQuestionNumber] = useState({
           // question_number: content ? parseInt(content) + 1 : 1
         // })
          const [answerKey, setAnswerKey] = useState('')
          const [timeLimit, setTimeLimit] = useState('30000')
          const [score, setScore] = useState<number>()
          const [instruction, setInstruction] = useState<string>('instruction')
          const [help1, setHelp1] = useState(null)
          const [display_instruction, setDisplayInstruction] = useState<boolean>(false)

          //for video quiz questions only
          const [videoSegmentId, setVideoSegmentId] = useState<number>(0)
    
           
      const editorRef = useRef<EditorRef>(null)
      const radioRef = useRef<RadioComponentHandle>(null)
      const checkBoxRef = useRef<NewCheckboxComponentHandle>(null)
      const buttonClozeRef = useRef<ButtonClozeComponentHandle>(null)
      const wordScrambleRef = useRef<WordScrambleComponentHandle>(null)

      const {rootUrl} = useRootUrl();

        //kpham Typescript lesson: learned how to type an object as a dictionary 12/16/2024
        const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
            "4": "Radio ",  "5": "Checkbox", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
            "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
        }

      const set_answer_key = (answer_key: string) => {
        //console.log("********** in set_answer_key ", answer_key)
        setAnswerKey(answer_key)
    }

    const create_question = async () => {    
        // validate inputs
        // validate questionNumber 
        if (!questionNumber || isNaN(Number(questionNumber))) {
            alert("Please enter a valid question number")
            return
        }
        let new_question_id ;
        
        let question_params = {
            question_number: questionNumber,
            format: format,
            instruction: editorRef.current?.get_content(),
            display_instruction: display_instruction,
            prompt: prompt,
            audio_src: audioSrc,
            audio_str: audioStr,
            content: questionContent,
            answer_key: answerKey,
            videoSegmentId: quiz_has_video ? videoSegmentId : undefined,
            timeout: timeLimit,
            score: score,
            help1: help1,
            quiz_id: quiz_id
        }

        //console.log("********** question_params to create=", question_params)

        if (format === "2") {  
            //console.log("buttonClozeRef.current=", buttonClozeRef.current)
            if (buttonClozeRef.current) {
                //console.log("buttonClozeRef.current.getChoices()=", buttonClozeRef.current.getChoices())
                const button_cloze_options = buttonClozeRef.current?.getChoices()
                const my_params = {...question_params, button_cloze_options}
                //console.log("MMMMMM my_params=", my_params)
                const response = await createQuestion(rootUrl, my_params )
                if (response) {
                   // console.log("button cloze question created ok")
                    new_question_id = response.data.id
                }
            }
        }
        else if (format === "4") {    //add parameters for radio questions
            if (radioRef.current) {
                //question_params = radioRef.current.addParams(question_params)
                const radio_params = radioRef.current.getRadioTexts(question_params)
                //console.log("hereerere radio_params=", radio_params)
                /*
{
    "choice_1_text": "one",
    "choice_2_text": "two",
    "choice_3_text": "three",
    "choice_4_text": "four"
}
                */
                // combine radios_params into question content
                const question_content = radio_params.choice_1_text + '/' + radio_params.choice_2_text + '/' +
                    radio_params.choice_3_text + '/' + radio_params.choice_4_text
                setQuestionContent(question_content)
                const my_params = {...question_params, content: question_content}
                //console.log("MMMMMM radio_params=", res)
                const response = await createQuestion(rootUrl, my_params )
                if (response) {
                   // console.log("button cloze question created ok")
                    new_question_id = response.data.id
                }
            }
        }
        else if (format === "5") {    //add parameters for radio questions
            if (checkBoxRef.current) {
                
                //question_params = radioRef.current.addParams(question_params)
                const checkbox_params = checkBoxRef.current.getCheckboxTexts(question_params)
                const question_content = checkbox_params.choice_1_text + '/' + checkbox_params.choice_2_text + '/' +
                    checkbox_params.choice_3_text + '/' + checkbox_params.choice_4_text
                const my_params = {...question_params, content: question_content}
                //console.log("MMMMMM my_params=", my_params)
                const response = await createQuestion(rootUrl, my_params )
                if (response) {
                    //console.log("button cloze question created ok")
                    new_question_id = response.data.id
                }
                
            }
        }
        else if (format === "6") {    //add parameters for word scramble questions
                if (wordScrambleRef.current) {
                const my_params = {...question_params,  words_scramble_direction: wordScrambleRef.current.getDirection()}
                //console.log("MMMMMM radio_params=", res)
                const response = await createQuestion(rootUrl, my_params )
                if (response) {
                    //console.log("button cloze question created ok")
                    new_question_id = response.data.id
                }
            }
        }
        else {
                //await createQuestion(rootUrl, question_params)
                const response = await createQuestion(rootUrl, question_params )
                if (response) {
                    //console.log(" cloze question created ok")
                    //console.log(" ********* response.data=", response.data)   
                    new_question_id = response.data.id
                }
        }
       console.log("before onClose questtionContent =", questionContent)
        onClose({ 
            action: 'new',
            itemId: new_question_id,
            item_number: questionNumber,
            format: format,
            content: questionContent,
            answer_key: answerKey,
            video_segment_id: quiz_has_video ? String(videoSegmentId) : undefined,
         })
        //const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}/questions/${params.quiz_id}`
        //navigate(url)
        
    }

    const handleCancel = () => {
       // const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/list_quizzes/${params.unit_id}/questions/${params.quiz_id}`
        //navigate(url)
        onClose({ action: 'cancel' })
    }

    const insertSlashesInContent = () => {
        let new_content = questionContent.replace(/ /g, '/')
        setQuestionContent(new_content)
    }

    /*
 <div className='mx-10 text-textColor1 mb-2'>Question Number
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={questionNumber}
                    onChange={e => setQuestionNumber(e.target.value)}></input>
                </div>
    */

    return (
      <div className="bg-bgColor2 text-textColor2 rounded shadow-lg w-auto p-50">
           
        

            <div className='flex flex-col bg-bgColor1 text-textColor2'>
                <div className='text-textColor1 text-lg mx-10 my-5'>New Question, format: {format && formatConversion[format]} ({format})</div>
                 { instruction &&
                    <SimpleEditor initialContent={instruction} ref={editorRef} />
                 }
                  <div className='flex flex-row justify-start gap-2'>
                    <button className='bg-bgColor3 text-textColor1 m-3 p-1' onClick={create_question}>Create question</button>
                    <button className='bg-bgColor2 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
                </div>
       
                <div className='mx-10 text-textColor1 mb-2'>Question Number
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="number" value={questionNumber}
                    onChange={e => setQuestionNumber(parseInt(e.target.value))}></input>
                </div>

                <div className='mx-10 bg-bgColor1 text-textColor1 mb-2'>Display Instruction
                     {/* add a checkbox to toggle display_instruction */}
                     <input className='mx-2' type="checkbox" checked={display_instruction}
                        onChange={e => setDisplayInstruction(e.target.checked)}>
                        </input>
                </div>

                <div className='mx-10 bg-bgColor1 text-textColor1 mb-2'>Promptt
                 <textarea className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md mx-1' rows={3} cols={70} value={prompt}
                    onChange={e => setPrompt(e.target.value)}></textarea>
                </div>
        
                <div className='mx-10 text-textColor1 mb-2'>Audio text
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={audioStr}
                    onChange={e => setAudioStr(e.target.value)}></input>
                </div>

                <div className='mx-10 text-textColor1 mb-2'>Amazon S3 Audio Source
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={audioSrc}
                    onChange={e => setAudioSrc(e.target.value)}></input>
                </div>

                 <div className='flex flex-row justify-start gap-2'>
                <div className='mx-10 text-textColor1 mb-2'>Content
               
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md  mx-1' size={70} type="text" value={questionContent}
                    onChange={e => setQuestionContent(e.target.value)}></input>

                
                </div>
              
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Answer Key
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={answerKey}
                    onChange={e => setAnswerKey(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Video Segment ID
                { quiz_has_video &&
                    <input className='mx-10 text-textColor2 mb-2 bg-bgColor4' type="text" value={videoSegmentId} 
                    onChange={e => setVideoSegmentId(Number(e.target.value))}></input>
                }
                Starts with 0
                </div>
                <div className='mx-10 bg-bgColor2 text-textColor2 mb-2'>Time Limit
                    <input className='bg-bgColor4 px-2 text-lg text-textColor2 rounded-md w-4/12 mx-1' type="text" value={timeLimit}
                    onChange={e => setTimeLimit(e.target.value)}></input>
                </div>
                { (format === "1" || format === "10") && 
                    <NewCloze question_content={questionContent} set_answer_key={set_answer_key}/>
                }
                { (format === "2") && 
                    <NewButtonCloze question_content={questionContent} set_answer_key={set_answer_key} ref={buttonClozeRef} />
                }
                { (format === "4") && 
                    <NewRadio set_radio_answer_key={set_answer_key} ref={radioRef}/>
                }
                { (format === "5") && 
                    <NewCheckbox set_checkbox_answer_key={set_answer_key} ref={checkBoxRef}/>
                }
                { (format === "6") && 
                    <NewWordScramble  ref={wordScrambleRef}/>
                }
            </div>
            

      </div>
    );
  };

  export default NewQuestion;