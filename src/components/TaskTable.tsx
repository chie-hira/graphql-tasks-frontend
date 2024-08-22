import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
    name: string,
    dueDate: string,
    status: string,
) {
    return { name, dueDate, status };
}

const rows = [
    createData('task1', '2022-02-02', 'not started'),
    createData('task2', '2022-02-02', 'not started'),
    createData('task3', '2022-02-02', 'not started'),
    createData('task4', '2022-02-02', 'not started'),
    createData('task5', '2022-02-02', 'not started'),
    createData('task6', '2022-02-02', 'not started'),
];

export default function TaskTable() {
    return (
        <TableContainer component={Paper} sx={{ width: '80%', m: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Task Name</TableCell>
                        <TableCell align="right">Due date</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.dueDate}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
