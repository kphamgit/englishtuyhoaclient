import React, { useEffect, useState } from 'react';

interface InputField {
  source: string;
  target: string;
}

interface Props {
    inputs: InputField[];
    parent_func?: (arg: InputField[]) => void
  }

const DynamicInput: React.FC<Props> = ({inputs, parent_func }) => {

  const [inputFields, setInputFields] = useState<InputField[]>([]);

  useEffect(() => {
    if (inputs) {
        setInputFields(inputs)
        //console.log("sub_categories ", inputs)
    }
    
  },[inputs])

  const handleChange1 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputFields = [...inputFields];
    newInputFields[index].source = event.target.value;
    
    setInputFields(newInputFields);
   
    if (parent_func) {
    
        parent_func(newInputFields)
    }
  };

  const handleChange2 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputFields = [...inputFields];
    newInputFields[index].target = event.target.value;
    
    setInputFields(newInputFields);
    if (parent_func)
    parent_func(newInputFields)
  };

  const handleAdd = () => {
    setInputFields([...inputFields, { source: '', target: '' }]);
  };
  

  const handleRemove = (index: number) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
     setInputFields(newInputFields);
  };

  return (
    <div className='bg-bgColor3'>
      {inputFields && inputFields.map((input, index) => (
        <div className='bg-bgColor3 text-textColor2' key={index}>
          <input className='bg-bgColor1 text-textColor1 mx-3 mb-2' type="text" value={input.source} onChange={(event) => handleChange1(index, event)} />
          <input className='bg-bgColor1 text-textColor3 mx-3 mb-2' type="text" value={input.target} onChange={(event) => handleChange2(index, event)} />
          <button type="button" onClick={() => handleRemove(index)}>Remove</button>
        </div>
      ))}
      <button className='mx-3 bg-bgColor1 text-textColor3 p-2' type="button" onClick={handleAdd}>Add Row</button>
  
    </div>
  );
};

export default DynamicInput;