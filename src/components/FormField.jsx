import './FormField.css';

function FormField({
  label,
  id,
  icon,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  autoComplete,
  ...rest
}) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{label}</span>
      <div className="form-field__control">
        {icon ? (
          <span className="material-symbols-outlined form-field__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          className="form-field__input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          {...rest}
        />
      </div>
    </label>
  );
}

export default FormField;
