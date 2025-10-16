import { forwardRef, useState, useImperativeHandle, useEffect} from 'react'
import { Radio } from "flowbite-react";
import { RadioProps } from './types';

/*
export interface RadioProps {
    id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
    selected: string
    questionId: number
  }
*/

  interface NewRadioComponentProps {
    set_radio_answer_key: (answer_key: string) => void
  }

  export interface NewRadioComponentHandle {
    //declare or type the child component handle
    getRadioTexts: (base_params:any) => RadioProps;
  }
 
     export const NewRadio = forwardRef<NewRadioComponentHandle, NewRadioComponentProps>((props, ref) => {
    
        const [choice1Text, setChoice1Text] = useState('')
        const [choice2Text, setChoice2Text] = useState('')
        const [choice3Text, setChoice3Text] = useState('')
        const [choice4Text, setChoice4Text] = useState('')

    const handleChange = (value: any, choice_text: string) => {
        props.set_radio_answer_key(value)
    }
    /*
        useImperativeHandle defines the functions that you want to expose to the parent, in this case, QuestionEditor.
    */
    useImperativeHandle(ref, () => ({
        //define child component handle functions to be called by parent component
        getRadioTexts(base_params:any) {
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
      
    return (
        <>
        <div className='mx-12 my-10'>
    <fieldset className="flex max-w-md flex-col gap-4 pb-12">
      <legend className="mb-4">Fill in choices</legend>
      <div className=" flex items-center gap-2">
            <Radio onChange={e => handleChange(e.target.value, choice1Text)} id="choice1" name="choices" value="choice1"  />
            <input className='bg-bgColor4' type='text' value={choice1Text}  onChange={e => setChoice1Text(e.target.value)} size={80} />
      </div>
      <div className="flex items-center gap-2">
            <Radio onChange={e => handleChange(e.target.value, choice2Text)} id="choice2" name="choices" value="choice2" />
            <input className='bg-bgColor4'  type='text' value={choice2Text}  onChange={e => setChoice2Text(e.target.value)} size={80} />
      </div>
      <div className="flex items-center gap-2">
            <Radio onChange={e => handleChange(e.target.value, choice3Text)} id="choice3" name="choices" value="choice3"  />
            <input className='bg-bgColor4'  type='text' value={choice3Text}  onChange={e => setChoice3Text(e.target.value)} size={80} />
      </div>
      <div className="flex items-center gap-2">
            <Radio onChange={e => handleChange(e.target.value, choice4Text)} id="choice4" name="choices" value="choice4"  />
        <input className='bg-bgColor3'  type='text' value={choice4Text}  onChange={e => setChoice4Text(e.target.value)} size={80} />
      </div>
    </fieldset>
    </div>
        </>
    )
})

export default NewRadio