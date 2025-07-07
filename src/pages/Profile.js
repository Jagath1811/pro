import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput
} from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      setProfile(res.data);
      setForm(res.data);
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWorkoutDaysChange = (event) => {
    const value = event.target.value;
    setForm({ ...form, workoutDays: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', message: '' });
    try {
      const res = await axios.put('/api/profile', form);
      setProfile(res.data);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  const workoutDayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Profile</Typography>
        {alert.message && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" value={form.name || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" value={form.email || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Profession</InputLabel>
                <Select name="profession" value={form.profession || ''} label="Profession" onChange={handleChange}>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Office Worker">Office Worker</MenuItem>
                  <MenuItem value="Freelancer">Freelancer</MenuItem>
                  <MenuItem value="Athlete">Athlete</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Body Structure</InputLabel>
                <Select name="bodyStructure" value={form.bodyStructure || ''} label="Body Structure" onChange={handleChange}>
                  <MenuItem value="Thin">Thin</MenuItem>
                  <MenuItem value="Muscular">Muscular</MenuItem>
                  <MenuItem value="Fatty">Fatty</MenuItem>
                  <MenuItem value="Average">Average</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Height (cm)" name="height" type="number" value={form.height || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Weight (kg)" name="weight" type="number" value={form.weight || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Goal</InputLabel>
                <Select name="goal" value={form.goal || ''} label="Goal" onChange={handleChange}>
                  <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                  <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="General Fitness">General Fitness</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Target Weight (kg)" name="targetWeight" type="number" value={form.targetWeight || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Wake Up Time" name="wakeUpTime" type="time" value={form.wakeUpTime || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Sleep Time" name="sleepTime" type="time" value={form.sleepTime || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Diet Type</InputLabel>
                <Select name="dietType" value={form.dietType || ''} label="Diet Type" onChange={handleChange}>
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                  <MenuItem value="Vegan">Vegan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Diet Plan Type</InputLabel>
                <Select name="dietPlanType" value={form.dietPlanType || ''} label="Diet Plan Type" onChange={handleChange}>
                  <MenuItem value="Predefined">Predefined</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Activity Level</InputLabel>
                <Select name="activityLevel" value={form.activityLevel || ''} label="Activity Level" onChange={handleChange}>
                  <MenuItem value="Sedentary">Sedentary</MenuItem>
                  <MenuItem value="Lightly Active">Lightly Active</MenuItem>
                  <MenuItem value="Moderately Active">Moderately Active</MenuItem>
                  <MenuItem value="Very Active">Very Active</MenuItem>
                  <MenuItem value="Extremely Active">Extremely Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Workout Days</InputLabel>
                <Select
                  multiple
                  name="workoutDays"
                  value={form.workoutDays || []}
                  onChange={handleWorkoutDaysChange}
                  input={<OutlinedInput label="Workout Days" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {workoutDayOptions.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Workout Duration (minutes)" name="workoutDuration" type="number" value={form.workoutDuration || ''} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 