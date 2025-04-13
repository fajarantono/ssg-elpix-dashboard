import React, { FC, ReactNode, FormEvent } from 'react';

interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  encType?: string;
}

const Form: FC<FormProps> = ({ onSubmit, children, className, encType }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
        onSubmit(event);
      }}
      className={`${className}`} // Default spacing between form fields
      encType={encType} 
    >
      {children}
    </form>
  );
};

export default Form;
