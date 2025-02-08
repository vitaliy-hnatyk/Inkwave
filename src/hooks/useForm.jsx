import { useState } from 'react';

function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    handleSubmit
  };
}

export default useForm;