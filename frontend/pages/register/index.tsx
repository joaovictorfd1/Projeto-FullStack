'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Copyright } from '../../components/Copyright/Copyright';
import { useFormik } from 'formik';
import { IRegister } from '../../interfaces/IRegister';
import { SingUpSchema } from '../../utils/validators/schemas';
import { register } from '../../api/register';
import { Alert } from '../../components/Alert/Alert';
import { useRouter } from 'next/navigation'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const initialValues: IRegister = {
  email: "",
  password: "",
};

export default function SignUp() {
  const router = useRouter()


  const onSubmit = async (body: IRegister) => {
    const response = await register(body)
    if (response && !response?.response?.data) {
      Alert('success', 'Cadastro efetuado com sucesso')
      return router.push('/login')
    }
    return Alert('error', response?.response?.data?.error)
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: SingUpSchema,
    enableReinitialize: true,
  });

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registre-se
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome"
                  autoFocus
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.firstName)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Sobrenome"
                  name="lastName"
                  autoComplete="family-name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.lastName)}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.email)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.password)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formik.isValid || !formik.dirty}
            >
              Finalizar cadastro
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  Já tem uma conta? Acesse
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}