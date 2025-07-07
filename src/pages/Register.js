import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: 'Other',
    height: '',
    weight: '',
    bodyStructure: 'Average',
    goal: 'General Fitness',
    targetWeight: '',
    wakeUpTime: '06:00',
    sleepTime: '22:00',
    dietType: 'Non-Vegetarian',
    dietPlanType: 'Predefined',
    activityLevel: 'Moderately Active',
    workoutDays: [],
    workoutDuration: 60
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const workoutDayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleWorkoutDaysChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      workoutDays: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }
    
    if (formData.targetWeight && (formData.targetWeight < 30 || formData.targetWeight > 300)) {
      newErrors.targetWeight = 'Target weight must be between 30 and 300 kg';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert('');

    try {
      const userData = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
        workoutDuration: parseInt(formData.workoutDuration)
      };
      
      delete userData.confirmPassword;
      
      const result = await register(userData);
      
      if (result.success) {
        navigate('/');
      } else {
        setAlert(result.message);
      }
    } catch (error) {
      setAlert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
              Fitness Tracker
            </Typography>
          </Box>
          
          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
            Create Account
          </Typography>

          {alert && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {alert}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Profession</InputLabel>
                  <Select
                    name="profession"
                    value={formData.profession}
                    label="Profession"
                    onChange={handleChange}
                  >
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
                  <Select
                    name="bodyStructure"
                    value={formData.bodyStructure}
                    label="Body Structure"
                    onChange={handleChange}
                  >
                    <MenuItem value="Thin">Thin</MenuItem>
                    <MenuItem value="Muscular">Muscular</MenuItem>
                    <MenuItem value="Fatty">Fatty</MenuItem>
                    <MenuItem value="Average">Average</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  error={!!errors.height}
                  helperText={errors.height}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Goal</InputLabel>
                  <Select
                    name="goal"
                    value={formData.goal}
                    label="Goal"
                    onChange={handleChange}
                  >
                    <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                    <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="General Fitness">General Fitness</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Weight (kg)"
                  name="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  error={!!errors.targetWeight}
                  helperText={errors.targetWeight}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Wake Up Time"
                  name="wakeUpTime"
                  type="time"
                  value={formData.wakeUpTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sleep Time"
                  name="sleepTime"
                  type="time"
                  value={formData.sleepTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diet Type</InputLabel>
                  <Select
                    name="dietType"
                    value={formData.dietType}
                    label="Diet Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                    <MenuItem value="Vegan">Vegan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    name="activityLevel"
                    value={formData.activityLevel}
                    label="Activity Level"
                    onChange={handleChange}
                  >
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
                    value={formData.workoutDays}
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
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workout Duration (minutes)"
                  name="workoutDuration"
                  type="number"
                  value={formData.workoutDuration}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 