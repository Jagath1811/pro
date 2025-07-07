import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Bedtime,
  TrendingUp,
  CheckCircle,
  Schedule,
  LocalFireDepartment,
  MonitorWeight
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return 'warning';
    if (bmi < 25) return 'success';
    if (bmi < 30) return 'warning';
    return 'error';
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Welcome back, {dashboardData.user?.name}!
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonitorWeight sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">BMI</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.bodyMetrics?.bmi || 'N/A'}
              </Typography>
              <Chip 
                label={dashboardData.bodyMetrics?.bmiCategory || 'N/A'} 
                color={getBMIColor(dashboardData.bodyMetrics?.bmi)}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFireDepartment sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6">Calories Burned</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {dashboardData.bodyMetrics?.caloriesBurned || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {dashboardData.progress?.completionRate || 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={dashboardData.progress?.completionRate || 0}
                color={getProgressColor(dashboardData.progress?.completionRate)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Bedtime sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Sleep Quality</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {dashboardData.sleep?.averageDuration || 0}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average per night
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Workouts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 1 }} />
                Recent Workouts
              </Typography>
              {dashboardData.recentWorkouts?.length > 0 ? (
                <List>
                  {dashboardData.recentWorkouts.map((workout) => (
                    <ListItem key={workout.id} divider>
                      <ListItemIcon>
                        <FitnessCenter color={workout.completed ? 'success' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={workout.name}
                        secondary={`${workout.day} at ${workout.time} • ${workout.caloriesBurned} cal`}
                      />
                      <Chip 
                        label={workout.type} 
                        size="small" 
                        color={workout.completed ? 'success' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent workouts. Start your fitness journey!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Schedule */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} />
                Weekly Schedule
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(dashboardData.weeklySchedule || {}).map(([day, count]) => (
                  <Grid item xs={12} key={day}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{day}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {count > 0 && (
                          <Chip 
                            label={`${count} workout${count > 1 ? 's' : ''}`} 
                            size="small" 
                            color="primary"
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        {dashboardData.recommendations?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  Recommendations
                </Typography>
                <Grid container spacing={1}>
                  {dashboardData.recommendations.map((recommendation, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Alert severity="info" sx={{ mb: 1 }}>
                        {recommendation}
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Active Diet Plan */}
        {dashboardData.activeDietPlan && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Restaurant sx={{ mr: 1 }} />
                  Active Diet Plan
                </Typography>
                <Box>
                  <Typography variant="h6" color="primary">
                    {dashboardData.activeDietPlan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dashboardData.activeDietPlan.type} • {dashboardData.activeDietPlan.goal}
                  </Typography>
                  <Chip 
                    label={`${dashboardData.activeDietPlan.dailyCalories} cal/day`} 
                    color="secondary"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Progress Summary */}
        {dashboardData.progress?.weightProgress && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Weight Progress
                </Typography>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardData.progress.weightProgress.current} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Target: {dashboardData.progress.weightProgress.target} kg
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.abs(dashboardData.progress.weightProgress.percentage)}
                    color={dashboardData.progress.weightProgress.percentage > 0 ? 'error' : 'success'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {Math.abs(dashboardData.progress.weightProgress.difference).toFixed(1)} kg to go
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard; 