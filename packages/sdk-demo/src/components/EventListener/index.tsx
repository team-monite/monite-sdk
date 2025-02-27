import { useEffect, useState, useCallback, useMemo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Alert,
  Snackbar,
  Typography,
  Paper,
  Box,
  Stack,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Badge,
} from '@mui/material';

import {
  MoniteEventTypes,
  MoniteEvent,
  addMoniteEventListener,
} from '../../../../sdk-drop-in/src/lib/MoniteEvents';

const MAX_DISPLAYED_EVENTS = 50;

export const EventListener = () => {
  const [events, setEvents] = useState<MoniteEvent[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [latestEvent, setLatestEvent] = useState<MoniteEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNewEvent = useCallback(
    (event: CustomEvent<MoniteEvent>) => {
      try {
        console.log('[EventListener] ========== NEW EVENT RECEIVED ==========');
        console.log('[EventListener] Event type:', event.type);
        console.log('[EventListener] Event detail:', event.detail);
        console.log('[EventListener] Event target:', event.target);
        console.log(
          '[EventListener] Event current target:',
          event.currentTarget
        );
        console.log('[EventListener] Event bubbles:', event.bubbles);
        console.log('[EventListener] Event cancelable:', event.cancelable);
        console.log('[EventListener] Event composed:', event.composed);
        console.log(
          '[EventListener] Event timestamp:',
          new Date().toISOString()
        );
        console.log('[EventListener] ======================================');

        setEvents((prevEvents) => {
          const newEvents = [event.detail, ...prevEvents].slice(
            0,
            MAX_DISPLAYED_EVENTS
          );
          console.log('[EventListener] Updated events list:', newEvents);
          return newEvents;
        });

        if (!isExpanded) {
          setUnreadCount((prev) => prev + 1);
        }

        setLatestEvent(event.detail);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('[EventListener] Error handling Monite event:', error);
        console.error('[EventListener] Error details:', {
          error,
          event,
          eventType: event?.type,
          eventDetail: event?.detail,
        });
      }
    },
    [isExpanded]
  );

  useEffect(() => {
    console.log('[EventListener] ========== SETUP START ==========');
    console.log('[EventListener] Setting up event listener');

    const cleanup = addMoniteEventListener(handleNewEvent);
    console.log('[EventListener] Event listener setup complete');

    return () => {
      console.log('[EventListener] ========== CLEANUP START ==========');
      console.log('[EventListener] Cleaning up event listener');
      cleanup();
      console.log('[EventListener] Event listener cleanup complete');
      console.log('[EventListener] ========== CLEANUP END ==========');
    };
  }, [handleNewEvent]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleClearEvents = () => {
    setEvents([]);
    setUnreadCount(0);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      setUnreadCount(0);
    }
  };

  const formatEventType = (type: MoniteEventTypes): string => {
    return type.replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = JSON.stringify(event)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedEventType === 'all' || event.type.startsWith(selectedEventType);
      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedEventType]);

  const getEventDetails = (event: MoniteEvent): React.ReactNode => {
    if (
      event.type === MoniteEventTypes.INVOICE_CREATED &&
      'invoice' in event.payload
    ) {
      const { invoice } = event.payload;
      return (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Invoice Details:</strong>
          </Typography>
          {invoice?.status && (
            <Chip
              size="small"
              label={`Status: ${invoice.status}`}
              sx={{ mr: 1, mt: 1 }}
            />
          )}
          {invoice?.total_amount && (
            <Chip
              size="small"
              label={`Amount: ${invoice.total_amount} ${
                invoice.currency || ''
              }`}
              sx={{ mr: 1, mt: 1 }}
            />
          )}
        </>
      );
    }

    if (event.type.startsWith('payable.')) {
      return (
        <Chip
          size="small"
          label={`Payable ID: ${event.payload.id}`}
          sx={{ mr: 1, mt: 1 }}
        />
      );
    }

    if (event.type.startsWith('counterpart.')) {
      return (
        <Chip
          size="small"
          label={`Counterpart ID: ${event.payload.id}`}
          sx={{ mr: 1, mt: 1 }}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          maxHeight: isExpanded ? '500px' : 'auto',
          overflow: isExpanded ? 'auto' : 'hidden',
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 500,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isExpanded ? 2 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Monite Events Log</Typography>
            {!isExpanded && unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isExpanded && (
              <IconButton onClick={handleClearEvents} title="Clear all events">
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton
              onClick={handleToggleExpand}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              label="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={selectedEventType}
                label="Event Type"
                onChange={(e) => setSelectedEventType(e.target.value)}
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="invoice">Invoice</MenuItem>
                <MenuItem value="payable">Payable</MenuItem>
                <MenuItem value="counterpart">Counterpart</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {filteredEvents.length === 0 ? (
            <Typography color="text.secondary">
              No events received yet. Try creating an invoice.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {filteredEvents.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    p: 1,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="subtitle2" color="primary">
                    {formatEventType(event.type)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Event ID: {event.id}
                  </Typography>
                  <Typography variant="body2">
                    Payload ID: {event.payload.id}
                  </Typography>
                  {getEventDetails(event)}
                </Box>
              ))}
            </Stack>
          )}
        </Collapse>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: '100%' }}
        >
          {latestEvent && (
            <>
              Event: <strong>{formatEventType(latestEvent.type)}</strong> - ID:{' '}
              {latestEvent.payload.id}
            </>
          )}
        </Alert>
      </Snackbar>
    </>
  );
};
