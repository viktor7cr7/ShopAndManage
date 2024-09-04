
const FormRowSelect = ({name, labelText, list, defaultValue='', onChange, value, style, id}) => {
  return (
    <div className="form-row grid-item" style={style}>
    <label htmlFor={name} className='form-label'>{labelText || name}</label>
  <select name={name} id={id} className='form-select'
  defaultValue={defaultValue} onChange={(onChange)} value={value}>
    {list.map((itemValue) => {
      return (
        <option key={itemValue} value={itemValue}>
          {itemValue}
        </option>
      )
    })}
  </select>
  </div>
  )
}

export default FormRowSelect