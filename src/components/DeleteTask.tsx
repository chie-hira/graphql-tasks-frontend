import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation } from '@apollo/client'
import { DELETE_TASK } from '../mutations/taskMutations'
import { GET_TASKS } from '../queries/taskQueries'
import { useNavigate } from 'react-router-dom'

const DeleteTask = ({ id, userId }: { id: number; userId: number }) => {
  const navigate = useNavigate()
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK)

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      })
      alert('Task deleted successfully')
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        localStorage.removeItem('token')
        alert('Session expired. Please log in again.')
        navigate('/signin')
        return
      }
      alert('Failed to delete task')
    }
  }

  return (
    <div>
      <Tooltip title="削除">
        <IconButton onClick={handleDeleteTask}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default DeleteTask
