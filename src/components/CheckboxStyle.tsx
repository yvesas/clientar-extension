/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from "react";

export interface checkBoxProps {
  id: string
  checked?: boolean
  onChange?: (id:string, checked:boolean) => void;
}

const CheckboxStyle = ({
  id,
  checked = false,
  // label="",
  onChange = () => {},
}:checkBoxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  // const checkedStyle = isChecked ? 'checkbox-checked' : ''

  const handleChange = (event:any) => {
    setIsChecked(event.target.checked);
    onChange(id, event.target.checked);
  };

  return (    
    <label id={id} data-extapp="chckbx" className="container">
      <input         
        type="checkbox" 
        checked={isChecked}  
        onChange={handleChange}
      />
      <span className="checkmark"></span>
    </label>
  );
};

export default CheckboxStyle;
