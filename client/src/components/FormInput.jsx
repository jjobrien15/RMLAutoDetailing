import { useState } from "react";

import "../stylesheets/formInput.scss";

const FormInput = (props) => {
    
  const { ...input } = props;

  const [focused, setFocused] = useState(false);

  const handleFocused = (e) => {
      setFocused(true)
  }

  console.log(input.name + " - " + input.label);

  return (
    <div className="formGroup">
        <label htmlFor={input.name}>{input.label}</label>
          <input
              {...input}
              onBlur={handleFocused}
              focused={focused.toString()}
              onFocus={() => input.name === "pwd2" && setFocused(true)}
              autoComplete="true"
          />
          <span className="formErrMessage">{input.errormessage}</span>
    </div>
  )
}

export default FormInput
