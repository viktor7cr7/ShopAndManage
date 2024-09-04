const FormRow = ({type, name, labelText, defaultValue, onChange, min, max, required,minLength, id}) => {
    return (
      <div className="form-row full-width">
      <label htmlFor={name} className='form-label'>{labelText || name}</label>
      <input type={type}
      id={id}
      name={name}
      className='form-input'
      defaultValue={defaultValue || ''}
      required={required}
      onChange={onChange}
      min={min}
      max={max}
      minLength={minLength}>
      </input>
  </div>
    )
  }

  export default FormRow