import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useMutation} from "@apollo/client";
import {Task} from "../types/task";
import {CREATE_TASK} from "../mutations/taskMutations";
import {GET_TASKS} from "../queries/taskQueries";
import {useNavigate} from "react-router-dom";

export default function AddTask({ userId }: { userId: number }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [isInvalidName, setIsInvalidName] = useState(false); // チェック用のフィールド
    const [isInvalidDueDate, setIsInvalidDueDate] = useState(false); // チェック用のフィールド
    const navigate = useNavigate();
    const [createTask] = useMutation<{ createTask: Task[] }>(CREATE_TASK);

    const resetState = () => {
        setName('');
        setDueDate('');
        setDescription('');
        setIsInvalidName(false);
        setIsInvalidDueDate(false);
    }

    const handleAddTask = async () => {
        setIsInvalidName(false);
        setIsInvalidDueDate(false);
        
        if (name.length === 0) {
            setIsInvalidName(true);
        }

        if (!Date.parse(dueDate)) {
            setIsInvalidDueDate(true);
        }

        if (name.length === 0 || !Date.parse(dueDate)) {
            return;
        }

        const createTaskInput = { name, dueDate, description, userId };
        
        try {
            await createTask({
                variables: { createTaskInput },
                refetchQueries: [{ query: GET_TASKS, variables: { userId: userId } }], // クエリを再実行 一覧を取得
            });
            resetState(); // 入力値をリセット
            setOpen(false); // ダイアログを閉じる
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'Unauthorized') {
                localStorage.removeItem('token');
                alert('Session expired. Please log in again.');
                navigate('/signin');
                return;
            }
            alert('Failed to add task');
        }
    }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        resetState();
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" sx={{ widows: '270px' }} onClick={handleClickOpen}>
                Add Task
            </Button>
            <Dialog fullWidth={true} maxWidth='sm' open={open} onClose={handleClose}>
                <DialogTitle>Add Task</DialogTitle>
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
                    <Button onClick={handleAddTask}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
