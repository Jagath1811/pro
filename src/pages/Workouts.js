import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const defaultWorkout = {
  name: '',
  type: 'Cardio',
  day: 'Monday',
  time: '07:00',
  duration: 60,
  exercises: [],
  notes: ''
};

const workoutTypes = ['Cardio', 'Strength', 'Flexibility', 'Mixed', 'Sports'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(defaultWorkout);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/api/workouts');
      setWorkouts(res.data);
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to load workouts.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (workout = defaultWorkout) => {
    setForm(workout);
    setEditing(!!workout._id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(defaultWorkout);
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
        await axios.put(`/api/workouts/${form._id}`, form);
        setAlert({ type: 'success', message: 'Workout updated!' });
      } else {
        await axios.post('/api/workouts', form);
        setAlert({ type: 'success', message: 'Workout added!' });
      }
      fetchWorkouts();
      handleCloseDialog();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to save workout.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await axios.delete(`/api/workouts/${id}`);
      setAlert({ type: 'success', message: 'Workout deleted!' });
      fetchWorkouts();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to delete workout.' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Workouts</Typography>
        {alert.message && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Workout</Button>
        <List>
          {workouts.map((workout) => (
            <ListItem key={workout._id} divider>
              <ListItemText
                primary={`${workout.name} (${workout.type})`}
                secondary={`${workout.day} at ${workout.time} • ${workout.duration} min`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpenDialog(workout)}><Edit /></IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(workout._id)}><Delete /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? 'Edit Workout' : 'Add Workout'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Workout Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select name="type" value={form.type} label="Type" onChange={handleChange}>
                      {workoutTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Day</InputLabel>
                    <Select name="day" value={form.day} label="Day" onChange={handleChange}>
                      {daysOfWeek.map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Duration (min)" name="duration" type="number" value={form.duration} onChange={handleChange} fullWidth required />
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

export default Workouts; 