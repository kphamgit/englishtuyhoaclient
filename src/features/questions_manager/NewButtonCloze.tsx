import {useState, useEffect, useImperativeHandle} from 'react'

export interface NewButtonClozeComponentProps {
    //define the props that you want to pass to the child component
    ref: React.Ref<ButtonClozeComponentHandle>; // use this to access the child component handle
   // button_cloze_choices?: string; // optional prop to initialize choices
}

export interface ButtonClozeComponentHandle {
    //declare or type the child component handle
    getChoices: () => {};  // return a string separated by slashes
  }

const NewButtonCloze: React.FC<NewButtonClozeComponentProps> = ({ ref }) => {
 
    const [choices, setChoices] = useState<string>('')
      
    const getChoices = () => {
        if (choices) {
           return choices
        } else {
            return ''
        }
    }

    useImperativeHandle(ref, () => ({
      getChoices,
  }));

    return (
        <div className='mx-14'>
        <div>
          <div className='bg-bgColor2 text-textColor3 mb-3 mt-5'>Choices (separated by slashes)</div>
        <input className='bg-bgColor4 text-textColor4 m-2 p-2' type="text"
                value={choices}
                onChange={e => setChoices(e.target.value)}
                size={70}
                placeholder="choice1/choice2"
        />
        </div>
        </div>
    )
}

export default NewButtonCloze;
