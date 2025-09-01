import { forwardRef, useState, useImperativeHandle, useEffect, useRef} from 'react'
import { Checkbox } from "flowbite-react";
import { RadioProps } from './types';

  interface NewCheckboxComponentProps {
    question_content: string
    answer_key: string
    set_checkbox_answer_key: (answer_key: string) => void
  }

  export interface NewCheckboxComponentHandle {
    //declare or type the child component handle
    getCheckboxTexts: (base_params:any) => RadioProps;
  }
 
     export const EditCheckbox= forwardRef<NewCheckboxComponentHandle, NewCheckboxComponentProps>((props, ref) => {
    
        const [choice1Text, setChoice1Text] = useState('choice 1 text')
        const [choice2Text, setChoice2Text] = useState('')
        const [choice3Text, setChoice3Text] = useState('')
        const [choice4Text, setChoice4Text] = useState('')
        const answerKey = useRef<string[]>(props.answer_key ? props.answer_key.split('/') : [])


    useEffect(() => {
      // split question_content by '/' into 4 parts and set the choice texts
      const choices = props.question_content.split('/')
      setChoice1Text(choices[0] || '')
      setChoice2Text(choices[1] || '')   
      setChoice3Text(choices[2] || '')
      setChoice4Text(choices[3] || '')
    },[props.question_content])

    const handleChange = (id: string, checked: any) => {
        console.log("in new Checkbox handlChange checked =", checked)
        // id can be choice1, choice2, choice3, or choice4
        
        // append id to answerKey string if checked is true 
        // if checked is true, add id to answerKey string
        if (checked) {
          // search for id in answerKey string
          if (!answerKey.current.includes(id)) {
            answerKey.current.push(id)
          }
        }
        else {
          // if checked is false, remove id from answerKey string
          answerKey.current = answerKey.current.filter(item => item !== id)
        }
        console.log("answerKey.current = ", answerKey.current)
        //console.log("value = ", value)
        props.set_checkbox_answer_key(answerKey.current.join('/'))
    }
    /*
        useImperativeHandle defines the functions that you want to expose to the parent, in this case, QuestionEditor.
    */
    useImperativeHandle(ref, () => ({
        //define child component handle functions to be called by parent component
        getCheckboxTexts(base_params:any) {
            const my_params = {
                choice_1_text: choice1Text,
                choice_2_text: choice2Text,
                choice_3_text: choice3Text,
                choice_4_text: choice4Text,
            }
            //return {...base_params, ...my_params}
            return my_params
        }
      }));
//onChange={e => setChoice1Text(e.target.value)}
return (
  <div className="flex max-w-md flex-col gap-4" id="checkbox">
    <div className="flex items-center gap-2">
      <Checkbox id="choice1" onChange={(e) => handleChange(e.target.id, e.target.checked)}  
        defaultChecked = {props.answer_key.includes("choice1")} 
      />
      <input type='text' value={choice1Text}  onChange={e => {setChoice1Text(e.target.value); }} size={80} />
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="choice2" onChange={(e) => handleChange(e.target.id, e.target.checked)} 
         defaultChecked = {props.answer_key.includes("choice2")} 
        />
      <input type='text' value={choice2Text}  onChange={e => {setChoice2Text(e.target.value); }} size={80} />
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="choice3" onChange={(e) => handleChange(e.target.id, e.target.checked)} 
         defaultChecked = {props.answer_key.includes("choice3")} 
        />
      <input type='text' value={choice3Text}  onChange={e => {setChoice3Text(e.target.value); }} size={80} />
    </div>
    <div className="flex gap-2 mb-14">
    <Checkbox id="choice4" onChange={(e) => handleChange(e.target.id, e.target.checked)} 
       defaultChecked = {props.answer_key.includes("choice4")} 
      />
    <input type='text' value={choice4Text}  onChange={e => {setChoice4Text(e.target.value); }} size={80} />
    </div>
 
  </div>
);
})

export default EditCheckbox