import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const defaultSleep = {
  date: '',
  sleepTime: '22:00',
  wakeUpTime: '06:00',
  duration: 8,
  quality: 'Good',
  notes: ''
};

const SleepTracker = () => {
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(defaultSleep);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSleep();
  }, []);

  const fetchSleep = async () => {
    try {
      const res = await axios.get('/api/sleep');
      setSleepData(res.data);
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to load sleep data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (entry = defaultSleep) => {
    setForm(entry);
    setEditing(!!entry._id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(defaultSleep);
    setEditing(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', message: '' });
    try {
      if (editing) {
        await axios.put(`/api/sleep/${form._id}`, form);
        setAlert({ type: 'success', message: 'Sleep entry updated!' });
      } else {
        await axios.post('/api/sleep', form);
        setAlert({ type: 'success', message: 'Sleep entry added!' });
      }
      fetchSleep();
      handleCloseDialog();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to save sleep entry.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sleep entry?')) return;
    try {
      await axios.delete(`/api/sleep/${id}`);
      setAlert({ type: 'success', message: 'Sleep entry deleted!' });
      fetchSleep();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to delete sleep entry.' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Sleep Tracker</Typography>
        {alert.message && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Sleep Entry</Button>
        <List>
          {sleepData.map((entry) => (
            <ListItem key={entry._id} divider>
              <ListItemText
                primary={`Date: ${entry.date?.slice(0, 10) || ''} | ${entry.sleepTime} - ${entry.wakeUpTime}`}
                secondary={`Duration: ${entry.duration}h | Quality: ${entry.quality}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpenDialog(entry)}><Edit /></IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(entry._id)}><Delete /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? 'Edit Sleep Entry' : 'Add Sleep Entry'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Date" name="date" type="date" value={form.date?.slice(0, 10) || ''} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Quality</InputLabel>
                    <Select name="quality" value={form.quality} label="Quality" onChange={handleChange}>
                      <MenuItem value="Poor">Poor</MenuItem>
                      <MenuItem value="Fair">Fair</MenuItem>
                      <MenuItem value="Good">Good</MenuItem>
                      <MenuItem value="Excellent">Excellent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Sleep Time" name="sleepTime" type="time" value={form.sleepTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Wake Up Time" name="wakeUpTime" type="time" value={form.wakeUpTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Duration (hours)" name="duration" type="number" value={form.duration} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline rows={2} />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={saving}>
                {saving ? <CircularProgress size={24} /> : (editing ? 'Update' : 'Add')}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SleepTracker; 