import { useState } from 'react';

type FormState = 'idle' | 'error' | 'loading';

export const useFormState = (initialState?: FormState) => {
  const [state, setState] = useState<FormState>(initialState || 'idle');

  return {
    formState: state,
    setFormState: setState,
  };
};