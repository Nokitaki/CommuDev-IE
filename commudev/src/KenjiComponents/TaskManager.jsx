import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import axios from 'axios';


const TaskFormDialog = ({ open, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    taskDescription: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: '',
    taskType: 'GENERAL',
    reward: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (task?.taskId) {
        response = await axios.put(`http://localhost:8080/tasks/${task.taskId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/tasks/add', formData);
      }
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Description"
              value={formData.taskDescription}
              onChange={handleChange('taskDescription')}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange('status')}
                label="Status"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority"
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange('dueDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Task Type</InputLabel>
              <Select
                value={formData.taskType}
                onChange={handleChange('taskType')}
                label="Task Type"
              >
                <MenuItem value="GENERAL">General</MenuItem>
                <MenuItem value="COMMUNITY_SERVICE">Community Service</MenuItem>
                <MenuItem value="EDUCATION">Education</MenuItem>
                <MenuItem value="ENVIRONMENT">Environment</MenuItem>
                <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reward"
              value={formData.reward}
              onChange={handleChange('reward')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'PENDING': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {task.taskType.replace('_', ' ')}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(task)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(task.taskId)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {task.taskDescription}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<FlagIcon />}
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
          />
          <Chip
            label={task.status.replace('_', ' ')}
            color={getStatusColor(task.status)}
            size="small"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={task.dueDate}
            variant="outlined"
            size="small"
          />
        </Box>

        {task.reward && (
          <Typography variant="body2" color="primary">
            Reward: {task.reward}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};


const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tasks/all');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setOpenDialog(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:8080/tasks/${taskId}`);
        setTasks(tasks.filter(task => task.taskId !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const handleSave = (savedTask) => {
    if (selectedTask) {
      setTasks(tasks.map(task =>
        task.taskId === savedTask.taskId ? savedTask : task
      ));
    } else {
      setTasks([...tasks, savedTask]);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Community Development Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.taskId}>
            <TaskCard
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      <TaskFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        task={selectedTask}
        onSave={handleSave}
      />
    </Box>
  );
};

export default TaskManager;