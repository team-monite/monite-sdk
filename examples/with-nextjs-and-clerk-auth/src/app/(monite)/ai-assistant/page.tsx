'use client';

import { useState } from 'react';

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function AiAssistantPage() {
  return (
    <Box className="Monite-PageContainer Monite-AiAssistant">
      <Stack direction="column" sx={{ width: '100%', height: '100%' }}>
        <Typography variant="h2">AI Assistant</Typography>
        <Box flexGrow={2}>
          <Stack direction="column" sx={{ width: '100%', height: '100%' }}>
            <Typography variant="subtitle2">
              Some examples of what you can do:
            </Typography>
          </Stack>
        </Box>
        <Stack alignItems="center" justifyContent="center">
          <SearchBar />
        </Stack>
      </Stack>
    </Box>
  );
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Search term:', searchTerm);
    // Add your search handling logic here
  };

  return (
    <TextField
      className="Monite-AiSearchField"
      variant="outlined"
      placeholder="What we can help you with?"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      fullWidth
      sx={{ maxWidth: '720px', background: '#ffffff', borderRadius: '4px' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="outlined"
              size="small"
              className="Monite-withShadow"
              onClick={handleSearch}
              style={{ textTransform: 'none' }} // Ensures "Send" text is not all caps
            >
              Send
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};
