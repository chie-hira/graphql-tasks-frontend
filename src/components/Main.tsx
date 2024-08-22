import {jwtDecode} from "jwt-decode";
import Header from "./Header";
import TaskTable from "./TaskTable";
import {Payload} from "../types/payload";
import {useQuery} from "@apollo/client";
import {Task} from "../types/task";
import {GET_TASK} from "../queries/taskQueries";

const Main = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode<Payload>(token!);
    const userId = decodedToken.sub;

    const { loading, error, data } = useQuery<{ getTasks: Task[] }>(GET_TASK, {
        variables: { userId: userId },
    });
    console.log(data);
    
    return (
        <>
            <Header />
            <TaskTable />
        </>
    );
};

export default Main;
