'use client';

import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function SelectField({
  value,
  onChange,
  options = [],
  emptyOptionLabel = '- none -',
  optionValueKey = 'id',
  optionLabelKey = null,
  className = '',
  name,
  label = null,
  minWidth = 120,
  sx = {},
}) {
  const handleChange = (e) => {
    const v = e.target.value;
    onChange && onChange(v === '' ? null : v);
  };

  return (
    <FormControl size="small" sx={{ minWidth, ...sx }} className={className}>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <Select
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        label={label || undefined}
        displayEmpty
      >
        <MenuItem value="">{emptyOptionLabel}</MenuItem>
        {options.map((opt) => {
          const val = opt[optionValueKey];
          const labelText = optionLabelKey
            ? opt[optionLabelKey]
            : opt.name || opt.key || opt[optionValueKey];
          return (
            <MenuItem key={val} value={val}>
              {labelText}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
