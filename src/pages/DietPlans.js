import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const defaultPlan = {
  name: '',
  type: 'Predefined',
  dietType: 'Non-Vegetarian',
  goal: 'Maintenance',
  dailyCalories: 2000,
  meals: [],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

const DietPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(defaultPlan);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/diet-plans');
      setPlans(res.data);
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to load diet plans.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (plan = defaultPlan) => {
    setForm(plan);
    setEditing(!!plan._id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(defaultPlan);
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
        await axios.put(`/api/diet-plans/${form._id}`, form);
        setAlert({ type: 'success', message: 'Diet plan updated!' });
      } else {
        await axios.post('/api/diet-plans', form);
        setAlert({ type: 'success', message: 'Diet plan added!' });
      }
      fetchPlans();
      handleCloseDialog();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to save diet plan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this diet plan?')) return;
    try {
      await axios.delete(`/api/diet-plans/${id}`);
      setAlert({ type: 'success', message: 'Diet plan deleted!' });
      fetchPlans();
    } catch (e) {
      setAlert({ type: 'error', message: 'Failed to delete diet plan.' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Diet Plans</Typography>
        {alert.message && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>Add Diet Plan</Button>
        <List>
          {plans.map((plan) => (
            <ListItem key={plan._id} divider>
              <ListItemText
                primary={`${plan.name} (${plan.type})`}
                secondary={`${plan.dietType} • ${plan.goal} • ${plan.dailyCalories} cal`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpenDialog(plan)}><Edit /></IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(plan._id)}><Delete /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? 'Edit Diet Plan' : 'Add Diet Plan'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Plan Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select name="type" value={form.type} label="Type" onChange={handleChange}>
                      <MenuItem value="Predefined">Predefined</MenuItem>
                      <MenuItem value="Custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Diet Type</InputLabel>
                    <Select name="dietType" value={form.dietType} label="Diet Type" onChange={handleChange}>
                      <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                      <MenuItem value="Vegan">Vegan</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Goal</InputLabel>
                    <Select name="goal" value={form.goal} label="Goal" onChange={handleChange}>
                      <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                      <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Daily Calories" name="dailyCalories" type="number" value={form.dailyCalories} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Days (comma separated)" name="days" value={form.days} onChange={e => setForm({ ...form, days: e.target.value.split(',').map(d => d.trim()) })} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Meals (JSON)" name="meals" value={JSON.stringify(form.meals)} onChange={e => setForm({ ...form, meals: JSON.parse(e.target.value) })} fullWidth multiline rows={2} />
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

export default DietPlans; 