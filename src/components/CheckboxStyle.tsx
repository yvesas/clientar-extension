/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from "react";

export interface checkBoxProps {
  // label?: string
  checked?: boolean
  onChange?: (e:any) => void;
}

const CheckboxStyle = ({
  checked = false,
  // label="",
  onChange = () => {},
}:checkBoxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  // const checkedStyle = isChecked ? 'checkbox-checked' : ''

  const handleChange = (event:any) => {
    setIsChecked(event.target.checked);
    onChange(isChecked);
  };

  return (
    // <div style={{ display: "flex", alignItems: "center" }}>
    // <div className={["checkbox", checkedStyle].join(" ")} >    
    // {/* <div className="checkbox" >     */}
    //   <input
    //     className={["", checkedStyle].join(" ")}
    //     type="checkbox"
    //     checked={isChecked}
    //     onChange={handleChange}
    //   />
    //   {/* <label style={{ marginLeft: 10 }}>{label}</label> */}
    // </div>
    
    <label className="container">
      <input 
        type="checkbox" 
        checked={isChecked}  
        onChange={handleChange}
      />
      <span className="checkmark"></span>
    </label>

    // <label className="checkboxContainer">
    //   <input 
    //     type="checkbox" 
    //     checked={isChecked}  
    //     onChange={handleChange}
    //   />
    //   <span className="checkmark"></span>
    // </label>
  );
};

export default CheckboxStyle;
