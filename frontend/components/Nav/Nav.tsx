import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import PersonIcon from '@mui/icons-material/Person';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '../../components/Menu/MenuButton';
import { Listbox } from '../../components/List/ListBox';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '../../components/Menu/MenuItens';
import Logo from '../../assets/img/logo_beta.png'
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container, Typography } from '@mui/material';



const AppBar = styled(MuiAppBar)(({ theme }) => ({
  background: '#CF2020',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


export default function Nav({ children }) {
  const router = useRouter();
  const params = useParams()

  const createHandleMenuClick = () => {
    localStorage.removeItem('token')
    return router.push('/login')
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Box component={'div'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} padding={'8px'} alignItems={'center'}>
            <Image src={Logo} width={50} height={50} alt='logo' style={{ margin: '0 10px 0 0' }} />
            <Typography variant='h5' textTransform={'uppercase'}>
                {params && !params.id && 'Listagem de Cursos'}
              </Typography>
            <Dropdown>
              <MenuButton><PersonIcon /></MenuButton>
              <Menu slots={{ listbox: Listbox }}>
                <MenuItem onClick={createHandleMenuClick}>Sair</MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}