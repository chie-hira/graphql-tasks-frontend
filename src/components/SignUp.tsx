import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { User } from "../types/user";
import { useMutation } from "@apollo/client";
import { SIGN_IN, SIGN_UP } from "../mutations/authMutations";
import { SignInResponse } from "../types/signInResponse";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignUp() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [signUp] = useMutation<{ createUser: User }>(SIGN_UP);
    const [signIn] = useMutation<SignInResponse>(SIGN_IN);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const signUpInput = { name, email, password };

        try {
            const signUpResult = await signUp({
                // mutationで定義した引数名とhandleSubmit関数内で定義した変数名が異なるので省略形は使用できない
                variables: { createUserInput: signUpInput },
            });

            if (!signUpResult.data?.createUser) {
                alert("ユーザーの作成に失敗しました");
                return;
            }

            // signInしてMainPageに遷移
            const signInInput = { email, password };
            const signInResult = await signIn({ variables: { signInInput } });
            if (signInResult.data) {
                localStorage.setItem(
                    "token",
                    signInResult.data.signIn.accessToken
                );
            }

            if (localStorage.getItem("token")) {
                navigate("/");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
            alert("ユーザーの作成に失敗しました");
            return;
        }
        console.log({
            name,
            email,
            password,
        });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
