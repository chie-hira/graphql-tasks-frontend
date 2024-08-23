import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { Task } from '../types/task'
import { TaskStatus } from '../types/taskStatus'
import { useMutation } from '@apollo/client'
import { UPDATE_TASK } from '../mutations/taskMutations'
import { GET_TASKS } from '../queries/taskQueries'
import {useNavigate} from 'react-router-dom'

export default function EditTask({
  task,
  userId,
}: {
  task: Task
  userId: number
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(task.name)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [status, setStatus] = useState(task.status)
  const [description, setDescription] = useState(task.description)
  const [isInvalidName, setIsInvalidName] = useState(false)
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false)
  const navigate = useNavigate()

  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK)

  const resetState = () => {
    setName(task.name)
    setDueDate(task.dueDate)
    setStatus(task.status)
    setDescription(task.description)
    setIsInvalidName(false)
    setIsInvalidDueDate(false)
  }

  const handleEditTask = async () => {
    setIsInvalidName(false)
    setIsInvalidDueDate(false)

    if (name.length === 0) {
      setIsInvalidName(true)
    }

    if (!Date.parse(dueDate)) {
      setIsInvalidDueDate(true)
    }

    if (name.length === 0 || !Date.parse(dueDate)) {
      return
    }

    const updateTaskInput = { id: task.id, name, dueDate, description }

    try {
      await updateTask({
        variables: { updateTaskInput },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: userId } }], // クエリを再実行 一覧を取得
      })
      resetState() // 入力値をリセット
      setOpen(false) // ダイアログを閉じる
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        localStorage.removeItem('token')
        alert('Session expired. Please log in again.')
        navigate('/signin')
        return
      }
      alert('Failed to edit task')
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    resetState()
    setOpen(false)
  }

  return (
    <div>
      <Tooltip title="編集">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName ? 'Task name is required' : ''}
          />
          <TextField
            autoFocus
            margin="normal"
            id="due-date"
            label="Due Date"
            placeholder="YYYY-MM-DD"
            fullWidth
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidDueDate ? 'Invalid date format' : ''}
          />
          <FormControl fullWidth={true} margin="normal">
            <InputLabel id="task-status-label">Status</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value={'NOT_STARTED'}>Not Started</MenuItem>
              <MenuItem value={'IN_PROGRESS'}>In Progress</MenuItem>
              <MenuItem value={'COMPLETED'}>Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
