import { useEffect, useRef, useState } from 'react'
import { EditorRef }  from './tiptap_editor/SimpleEditor';
import  SimpleEditor  from './tiptap_editor/SimpleEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { QuestionProps } from './types';
import { updateQuestion } from '../services/list';
import NewCloze from './NewCloze';
import { EditButtonSelect } from './EditButtonSelect';
import EditRadio from './EditRadio';
import { RadioComponentHandle } from './types';
import EditWordScramble from './EditWordScramble';
import { WordScrambleComponentHandle } from './types';
import { RadioProps } from './types';

import  {EditButtonClozeRef} from './EditButtonCloze';
import EditButtonCloze from './EditButtonCloze';
import { NewCheckboxComponentHandle } from './NewCheckbox';
import EditCheckbox from './EditCheckbox';
import { useRootUrl } from '../../contexts/root_url';


export default function QuestionEditor(props: any) {

      const [format, setFormat] = useState<string>()
      const [questionNumber, setQuestionNumber] = useState<number>()
      const [prompt, setPrompt] = useState<string>('null')
      const [audioSrc, setAudioSrc] = useState('')
      const [audioStr, setAudioStr] = useState('')
      const [questionContent, setQuestionContent] = useState('')
      const [answerKey, setAnswerKey] = useState('')
      const [score, setScore] = useState<number>()
      const [instruction, setInstruction] = useState<string>('')
      const [display_instruction, setDisplayInstruction] = useState<boolean>(false)
      const [help1, setHelp1] = useState(null)
      //const [help2, setHelp2] = useState(null)
      const [radioContent, setRadioContent] = useState<RadioProps | undefined>()
      const [wordScrambleDirection, setwordScrambleDirection] = useState<string>('');
      const [timeLimit, setTimeLimit] = useState('')
      

      //kpham Typescript lesson: learned how to type an object as a dictionary 12/16/2024
      const formatConversion: { [key: string]: string } = {"1": 'Cloze', "2": "Button Cloze Select", "3": 'Button Select', 
        "4": "Radio ", "6": "Word Scramble", "7": "Speech Recognition", "8": "Word Select",
        "9": "Recording", "10": "Drop Down", "11": "Letter Cloze",
      }

      //kpham: Javascript lesson: use dynamic key to index into formatConversion object (a dictionary )
      //the following snippet prints out the string "Cloze"
   //const tname = "1"

      const radioRef = useRef<RadioComponentHandle>(null)
      const checkBoxRef = useRef<NewCheckboxComponentHandle>(null)
      const wordScrambleRef = useRef<WordScrambleComponentHandle>(null)

      const buttonClozeRef = useRef<EditButtonClozeRef>(null)

      const editorRef = useRef<EditorRef>(null)

      const navigate = useNavigate();
      const params = useParams<{categoryId: string, sub_categoryId: string, unit_id: string,  quiz_id: string, question_id: string}>();
     // console.log("MMMMNNNNNNN question editor:  params", params)
      const {rootUrl} = useRootUrl();

      const url = `/questions/${params.question_id}`
      //console.log("url ", url)
      const { data: question, loading, error } =
          useAxiosFetch<QuestionProps>({ url: url, method: 'get' })
 

    useEffect(() => {
        if (question) {
        //console.log("HEEEHWWWHWWWWwwww.......... question:", question)
        setFormat(question.format.toString())
        setQuestionNumber(question.question_number)
        //console.log("here question instrcution", question.instruction)
        //console.log("here question instrcution LENGTH=", question.instruction.length)
        if (question.instruction.length > 0) {
            //console.log("HHHHH setting instruction", question.instruction)
            setInstruction(question.instruction)
        }
        else
            setInstruction(' ')     // there has to be at least a space. Otherwise SimpleEditor won't show

        setPrompt(question.prompt)
        setDisplayInstruction(question.display_instruction)
        setAudioSrc(question.audio_src)
        setAudioStr(question.audio_str)
        setQuestionContent(question.content)
        setAnswerKey(question.answer_key)
        setTimeLimit(question.timeout.toString())
        setScore(question.score)
        
        //if (question.radio != null) {
           // setRadioContent(question.content ? question.radio : undefined)
       // }
        if (question.format === 6) {
            //console.log("SCRAMMMMMMMMM direction =", response.data.direction)
            //setDirection(question.words_scramble_direction)
            setwordScrambleDirection(question.words_scramble_direction)
        }
       }
    },[question, question?.instruction])

    const update_instruction = (editor_content: string) => {
        //console.log("UUUUUUUyyyyyyyUUUUUUU ")
        //console.log("XXXX", editor_content)
        setInstruction(editor_content)
    }

    //this function is called when user selects a radio button
    const set_radio_answer_key = (answer_key: string) => {
        setAnswerKey(answer_key)
    }

    const update_question = () => {
        let question_params = {
            format: format,
            instruction: editorRef.current?.get_content(),
            display_instruction: display_instruction,
            prompt: prompt,
            audio_src: audioSrc,
            audio_str: audioStr,
            content: questionContent,
            answer_key: answerKey,
            timeout: timeLimit,
            score: score,
            help1: help1
        }
        
        if (format === "2") {  
            //console.log("buttonClozeRef.current=", buttonClozeRef.current)
            if (buttonClozeRef.current) {
                //console.log("buttonClozeRef.current.getChoices()=", buttonClozeRef.current.getChoices())
                const button_cloze_options = buttonClozeRef.current?.getChoices()
                //const my_params = {...question_params, button_cloze_options}
                
                //console.log("HHHHHHHHHHHH my_params=", my_params)
                
                updateQuestion(rootUrl, question?.id, {...question_params, button_cloze_options} )
                .then(response => {
                    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
                    navigate(url)
                 })
                    
                 //button_cloze_options: { button_cloze_choices: 'choice1/choice2/choice3' }
                //console.log("question_params=", question_params)
            }
        }
        else if (format === "4") {    //add parameters for radio questions
            //console.log("in RADIO format ...")
            if (radioRef.current) {
                //console.log("HEEEE")
                //question_params = radioRef.current.addParams(question_params)
                const radio_params = radioRef.current.getRadioTexts(question_params)
                const my_params = {...question_params, radio_params}
                //console.log("MMMMMM MMMMMMMMMMM my_params=", my_params)
                
                updateQuestion(rootUrl, question?.id, my_params )
                .then(response => {
                    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
                    navigate(url)
                 })
                 
            }
        }
        else if (format === "5") {    //add parameters for radio questions
            if (checkBoxRef.current) {

                //question_params = radioRef.current.addParams(question_params)
                const checkbox_params = checkBoxRef.current.getCheckboxTexts(question_params)
                const my_params = { ...question_params, checkbox_params }
                //console.log("MMMMMM my_params=", my_params)
                updateQuestion(rootUrl, question?.id, my_params)
                    .then(response => {
                        const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
                        navigate(url)
                    })

            }
        }
        else if (format === "6") {    //add parameters for radio questions
                if (wordScrambleRef.current) {
                const my_params = {...question_params,  words_scramble_direction: wordScrambleRef.current.getDirection()}
                //console.log("MMMMMM radio_params=", res)
                updateQuestion(rootUrl, question?.id, my_params )
                .then(response => {
                    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
                    navigate(url)
                 })
            }
        }
        else {
           // console.log("Update question!!!")
            updateQuestion(rootUrl, params.question_id, question_params)
                .then(response => {
                    const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
                    //console.log("XXXXX UTL", url)
                    navigate(url)
                })
        }
        
    }
    
    const handleCancel = () => {
        const url = `/categories/${params.categoryId}/sub_categories/${params.sub_categoryId}/display_unit/${params.unit_id}/questions/${params.quiz_id}`
        //console.log("XXXXX UTL", url)
        navigate(url)
    }

    const insertSlashesInContent = () => {
        let new_content = questionContent.replace(/ /g, '/')
        setQuestionContent(new_content)
    }

    // <SimpleEditor initialContent={instruction} ref={editorRef} />
    //kpham: Javascript lesson: use dynamic key (i.e, format state variable) to index into formatConversion object
        return (
            <div className='bg-bgColor1'>
                <div>EDITOR........</div>
                <div className='mx-10 text-textColor1'>Question: {question?.question_number}
                <span className='mx-2 text-textColor1'>{format && formatConversion[format]} ({format}) </span>
                </div>
                 { instruction &&
                    <SimpleEditor initialContent={instruction} ref={editorRef}/>
                 }
           
                <div className='flex flex-row justify-start gap-2'>
                    <button className='bg-bgColor4 text-textColor4 m-3 p-1' onClick={update_question}>Save question</button>
                    <button className='bg-bgColor4 m-3 p-1 text-textColor4' onClick={handleCancel}>Cancel</button>
                </div>

                <div className='mx-10 bg-bgColor1 text-textColor1 mb-2'>Display Instruction
                     {/* add a checkbox to toggle display_instruction */}
                     <input className='mx-2' type="checkbox" checked={display_instruction}
                        onChange={e => setDisplayInstruction(e.target.checked)}>
                        </input>
                </div>

                <div className='mx-10 bg-bgColor1 text-textColor1 mb-2'>Prompt1
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
                {format === "4" ?
                     <div className='mx-10 text-textColor1 mb-2 bg-gray-700 p-2 rounded-md'>
                     {questionContent}
                 </div>
                      :
                      <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md  mx-1' size={70} type="text" value={questionContent}
                      onChange={e => setQuestionContent(e.target.value)}></input>
                }

                </div>
                {format === "6" &&
                    <button onClick={insertSlashesInContent} className='bg-bgColor3 text-textColor3 p-1 rounded-md'>Inser slashes</button>
                }
                </div>

                <div className='mx-10 text-textColor1 mb-2'>Answer Key
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={answerKey}
                    onChange={e => setAnswerKey(e.target.value)}></input>
                </div>
                <div className='mx-10 text-textColor1 mb-2'>Time Limit
                    <input className='bg-bgColor4 px-2 text-lg text-textColor1 rounded-md w-4/12 mx-1' type="text" value={timeLimit}
                    onChange={e => setTimeLimit(e.target.value)}></input>
                </div>

                { (format === "1" || format === "10") && 
                    <NewCloze question_content={questionContent} set_answer_key ={setAnswerKey} />
                }
                { (format === "2" ) && 
                    <EditButtonCloze ref = {buttonClozeRef} 
                     button_cloze_choices = {question?.button_cloze_options} 
                     question_content={questionContent}
                     set_answer_key ={setAnswerKey}
                     />
                }
                { (format === "3") &&  
                    <EditButtonSelect question_content={questionContent} answer_key={answerKey} set_answer_key ={setAnswerKey} />
                }
                { (format === "4") && 
                    <EditRadio radio_data = {question?.content || ''} answer_key ={answerKey || ''} set_radio_answer_key={set_radio_answer_key} ref={radioRef}/>
                }
                { (format === "5") && 
                    <EditCheckbox question_content={questionContent} answer_key={answerKey} set_checkbox_answer_key={set_radio_answer_key} ref={checkBoxRef}/>
                }
                { (format === "6") && 
                    <EditWordScramble ref = {wordScrambleRef} direction={wordScrambleDirection}/>
                }
            </div>
            )
}

