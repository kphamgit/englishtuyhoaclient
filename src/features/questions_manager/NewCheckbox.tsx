import { forwardRef, useState, useImperativeHandle, useEffect, useRef} from 'react'
import { Checkbox, Label } from "flowbite-react";
import { RadioProps } from './types';

  interface NewCheckboxComponentProps {
    set_checkbox_answer_key: (answer_key: string) => void
  }

  export interface NewCheckboxComponentHandle {
    //declare or type the child component handle
    getCheckboxTexts: (base_params:any) => RadioProps;
  }
 
     export const NewCheckbox= forwardRef<NewCheckboxComponentHandle, NewCheckboxComponentProps>((props, ref) => {
    
        const [choice1Text, setChoice1Text] = useState('choice 1 text')
        const [choice2Text, setChoice2Text] = useState('')
        const [choice3Text, setChoice3Text] = useState('')
        const [choice4Text, setChoice4Text] = useState('')
        const answerKey = useRef<string[]>([])

    const handleChange = (id: string, choice_text: string, checked: any) => {
        //console.log("in new Checkbox handlChange checked =", checked)
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
        //console.log("answerKey.current = ", answerKey.current)
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
  <div className="m-5 flex max-w-md flex-col gap-4" id="checkbox">
    <h3>{choice1Text}</h3>
    <div className="flex items-center gap-2">
      <Checkbox id="choice1" onChange={(e) => handleChange(e.target.id, choice1Text, e.target.checked)}  />
      <input className='bg-bgColor4' type='text' value={choice1Text}  onChange={e => {setChoice1Text(e.target.value); }} size={80} />
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="choice2" onChange={(e) => handleChange(e.target.id, choice2Text, e.target.checked)} />
      <input className='bg-bgColor4' type='text' value={choice2Text}  onChange={e => {setChoice2Text(e.target.value); }} size={80} />
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="choice3" onChange={(e) => handleChange(e.target.id, choice3Text, e.target.checked)} />
      <input className='bg-bgColor4' type='text' value={choice3Text}  onChange={e => {setChoice3Text(e.target.value); }} size={80} />
    </div>
    <div className="flex gap-2 mb-14">
    <Checkbox id="choice4" onChange={(e) => handleChange(e.target.id, choice4Text, e.target.checked)} />
    <input className='bg-bgColor4' type='text' value={choice4Text}  onChange={e => {setChoice4Text(e.target.value); }} size={80} />
    </div>
 
  </div>
);
})

export default NewCheckbox