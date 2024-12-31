import React, { useState } from 'react';

interface InputField {
  value: string;
}

const DynamicInputSave: React.FC = () => {
  const [inputFields, setInputFields] = useState<InputField[]>([{ value: '' }]);

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = event.target.value;
    setInputFields(newInputFields);
  };

  const handleAdd = () => {
    setInputFields([...inputFields, { value: '' }]);
  };

  const handleRemove = (index: number) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };

  return (
    <div>
      {inputFields.map((input, index) => (
        <div key={index}>
          <input type="text" value={input.value} onChange={(event) => handleChange(index, event)} />
          <button type="button" onClick={() => handleRemove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAdd}>Add</button>
    </div>
  );
};

export default DynamicInputSave;