import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

export default function OnboardingBasicInformation() {
  return (
    <OnboardingStepContent>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Country"
          defaultValue={10}
        >
          <MenuItem value={10}>Georgia</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="test"
        fullWidth
        label="Business structure"
        variant="outlined"
      />
    </OnboardingStepContent>
  );
}
