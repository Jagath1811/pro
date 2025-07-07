import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Box, Grid, Alert, CircularProgress, Card, CardContent, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, MonitorWeight, LocalFireDepartment, Bedtime, CheckCircle } from '@mui/icons-material';

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashRes, scoreRes] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/analytics/health-score')
      ]);
      setDashboard(dashRes.data);
      setHealthScore(scoreRes.data);
    } catch (e) {
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!dashboard || !healthScore) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Analytics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <MonitorWeight sx={{ mr: 1 }} /> BMI
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{dashboard.bodyMetrics?.bmi || 'N/A'}</Typography>
                <Chip label={dashboard.bodyMetrics?.bmiCategory || 'N/A'} color="primary" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocalFireDepartment sx={{ mr: 1 }} /> Calories Burned
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{dashboard.bodyMetrics?.caloriesBurned || 0}</Typography>
                <Typography variant="body2" color="text.secondary">Total this week</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Bedtime sx={{ mr: 1 }} /> Sleep
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{dashboard.sleep?.averageDuration || 0}h</Typography>
                <Typography variant="body2" color="text.secondary">Average per night</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ mr: 1 }} /> Completion Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{dashboard.progress?.completionRate || 0}%</Typography>
                <LinearProgress variant="determinate" value={dashboard.progress?.completionRate || 0} sx={{ height: 8, borderRadius: 4 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} /> Recommendations
                </Typography>
                <Grid container spacing={1}>
                  {dashboard.recommendations?.map((rec, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Alert severity="info" sx={{ mb: 1 }}>{rec}</Alert>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Health Score</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{healthScore.score} / {healthScore.maxScore}</Typography>
                <Chip label={healthScore.overallStatus} color="secondary" sx={{ mb: 2 }} />
                <Box sx={{ mt: 2 }}>
                  {Object.entries(healthScore.breakdown).map(([key, val]) => (
                    <Box key={key} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{key.charAt(0).toUpperCase() + key.slice(1)}: {val.status} ({val.score}/{val.max})</Typography>
                    </Box>
                  ))}
                </Box>
                {healthScore.recommendations?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Recommendations:</Typography>
                    {healthScore.recommendations.map((rec, idx) => (
                      <Alert severity="info" sx={{ mb: 1 }} key={idx}>{rec}</Alert>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Analytics; 