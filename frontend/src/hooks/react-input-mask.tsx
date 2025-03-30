import React from 'react';
import InputMask from 'react-input-mask';
import { TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

const BirthDateInput = ({ control }: { control: Control<any> }) => (
  <Controller
    name="birth_date_input"
    control={control}
    rules={{
      required: '생년월일은 필수입니다',
      pattern: {
        value: /^\\d{6}$/,
        message: 'YYMMDD 형식으로 입력하세요',
      },
    }}
    render={({ field, fieldState }) => (
      <InputMask
        {...field}
        mask="99-99-99"
        maskChar=""
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
            label="생년월일 (YYMMDD)"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      </InputMask>
    )}
  />
);

export default BirthDateInput;
