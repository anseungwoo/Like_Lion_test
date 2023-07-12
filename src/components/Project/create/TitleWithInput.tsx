'use client';
import React, { ChangeEvent, useState, FC, RefObject } from 'react';

interface TitleWithInputProps {
  title: string;
  placeholder?: string;
  ref: RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
}

const TitleWithInput: FC<TitleWithInputProps> = ({
  title,
  placeholder,
  ref,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange(newValue);
  };

  return (
    <div className="flex items-center">
      <h1 className="mr-4 text-[16px] font-semibold whitespace-nowrap">
        {title}
      </h1>
      <input
        className="border-black text-black bg-white bg-opacity-30 border-[1px] rounded-lg w-full px-2 py-1 my-1 hover:cursor-pointer hover:border-red-300"
        type="text"
        value={inputValue}
        placeholder={placeholder ?? ''}
        ref={ref}
        onChange={handleChange}
      />
    </div>
  );
};

export default TitleWithInput;
