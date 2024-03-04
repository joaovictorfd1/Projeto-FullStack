import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ILogin } from '../../interfaces/ILogin';
import { SignInSchema } from '../../utils/validators/schemas';
import { login } from '../../api/login';
import { Alert } from '../../components/Alert/Alert';
import { Copyright } from '../../components/Copyright/Copyright';
import { useRouter } from 'next/navigation';
import { authMe } from '../../api/auth';
import Logo from '../../assets/img/logo_beta.png'
import Image from 'next/image';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const initialValues: ILogin = {
  email: "",
  password: "",
};

export default function SignIn() {
  const router = useRouter()
  const onSubmit = async (body: ILogin) => {
    const user = await login(body);
    if (user && !user?.response?.data) {
      const autorization = await authMe(user.token)
      if (autorization.userId) {
        localStorage.setItem('token', user.token)
        Alert('success', 'Login efetuado com sucesso')
        router.push('/dashboard')
        return;
      }
    }
    return Alert('error', user?.response?.data.error)
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: SignInSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (localStorage && localStorage.getItem('token')) {
      return router.push('/dashboard')
    }
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image src={Logo} width={50} height={50} alt='logo' style={{ margin: '0 0 10px 0'}} />
          <Typography component="h1" variant="h5">
            Acessar
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              id="email"
              label="Email"
              name="email"
              margin="normal"
              placeholder='Email'
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.email)}
              required
              fullWidth
            />
            <TextField
              type='password'
              id="password"
              label="Senha"
              name="password"
              margin="normal"
              placeholder='Senha'
              autoFocus
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.password)}
              required
              fullWidth
            />
            <Button
              data-testid="loginButton"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formik.isValid || !formik.dirty}
            >
              Login
            </Button>
            <Grid container sx={{ justifyContent: 'center' }}>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Não tem uma conta? Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}