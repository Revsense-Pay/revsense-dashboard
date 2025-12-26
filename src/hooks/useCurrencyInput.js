import { useState } from 'react';

export const useCurrencyInput = () => {
  const [rawValue, setRawValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const format = (value) => {
    if (!value) return '';
    const number = Number(value);
    if (isNaN(number)) return '';

    return number
  .toFixed(2)
  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const onChange = (e) => {
    const input = e.target.value.replace(/[^0-9.]/g, '');

    if ((input.match(/\./g) || []).length > 1) return;

    setRawValue(input);
    setDisplayValue(input);
  };

  const onBlur = () => {
    if (!rawValue) return;
    setDisplayValue(format(rawValue));
  };

  const onFocus = () => {
    setDisplayValue(rawValue);
  };

  return {
    value: displayValue,
    onChange,
    onBlur,
    onFocus,
    numericValue: rawValue ? Number(rawValue) : 0,
  };
};