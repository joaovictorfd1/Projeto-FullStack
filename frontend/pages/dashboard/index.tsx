import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import { mainListItems } from '../../components/List/ListItems';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '../../components/Menu/MenuButton';
import { Listbox } from '../../components/List/ListBox';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '../../components/Menu/MenuItens';
import AuthGuard from '../../components/Auth/AuthGuard';
import { Copyright } from '../../components/Copyright/Copyright';
import { getAllCourses, deleteCourse } from '../../api/courses';
import { ICourse } from '../../interfaces/ICourse';
import { Button, Grid, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { CourseImage } from '../../components/Img/Img';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CourseModal from '../../components/Modal/Modal';
import { IFilter } from '../../interfaces/IFilter';
import ConfirmationModal from '../../components/Modal/ConfirmationModal/ConfirmationModal';
import { options } from '../../utils/mocks/options';
import { Alert } from '../../components/Alert/Alert';
import { categories } from '../../utils/mocks/category';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface IResponseCourses {
  total: number
  skip: number
  limit: number
  courses: ICourse[]
}

export default function Dashboard() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0)
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filter, setFilter] = useState<IFilter>({} as IFilter)
  const [courseSelected, setCoursedSelected] = useState<ICourse | null>(null)
  const [coursesObjects, setCoursesObjects] = useState<IResponseCourses>({} as IResponseCourses)
  const toggleDrawer = () => {
    setOpen(!open);
  };


  const createHandleMenuClick = () => {
    localStorage.removeItem('token')
    return router.push('/login')
  };

  const getAllCourse = async (skip: number, filter: IFilter) => {
    const response = await getAllCourses(skip, filter)
    if (response) {
      return setCoursesObjects(response)
    }
    return setCoursesObjects({} as IResponseCourses)
  }

  const handleDeleteCourse = async () => {
    const response = await deleteCourse(id)
    if (response && response.message) {
      Alert('success', response.message)
      getAllCourse((currentPage - 1) * 15, filter)
      return setDeleteModalOpen(false)
    }
    Alert('error', response.details)
  }

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
  };

  const numberOfPages = () => {
    return coursesObjects.total / 15;
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilter({
      ...filter,
      search: value,
    });
  };


  useEffect(() => {
    getAllCourse((currentPage - 1) * 15, filter)
  }, [currentPage, filter])

  return (
    <AuthGuard>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Listagem de Cursos
              </Typography>
              <Dropdown>
                <MenuButton><PersonIcon /></MenuButton>
                <Menu slots={{ listbox: Listbox }}>
                  <MenuItem onClick={createHandleMenuClick}>Log out</MenuItem>
                </Menu>
              </Dropdown>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
            </List>
          </Drawer>
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
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Grid container alignItems={'center'} mb={'8px'}>
                <Grid item xs={6}>
                  <Box component={'div'} display={'flex'} gap={'16px'}>
                  <TextField
                    type="text"
                    value={filter.search}
                    onChange={handleFilter}
                    label="Buscar por nome ou marca"
                    size="small"
                  />

                  <TextField
                    select
                    type="text"
                    label="Ordernar por:"
                    size="small"
                    SelectProps={{
                      native: true,
                    }}
                    onChange={(e) => setFilter({
                      ...filter,
                      sort: e.target.value
                    })}
                    sx={{ minWidth: '150px' }}
                  >
                    {options.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </TextField>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box component={'div'} display={'flex'} justifyContent={'flex-end'}>
                    <Button
                      type='button'
                      variant="contained"
                      onClick={() => setCreateModalOpen(true)}
                    >
                      Novo Curso
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align='left' />
                      <TableCell align='left'>Nome</TableCell>
                      <TableCell align='left'>Marca</TableCell>
                      <TableCell align="left">Descrição</TableCell>
                      <TableCell align="left">Categoria</TableCell>
                      <TableCell align="left">Preço</TableCell>
                      <TableCell align="left">Desconto (%)</TableCell>
                      <TableCell align="left">Estoque</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coursesObjects && coursesObjects.courses?.map((course) => {
                      const modifiedCategories = course.category.map((item, index, array) => {
                        return index === array.length - 1 ? item : item + ', ';
                      });
                      return (
                        <TableRow
                          key={course.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>
                            <CourseImage src={course.images[0]} alt={course.title} />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {course.title}
                          </TableCell>
                          <TableCell align="left">{course.brand}</TableCell>
                          <TableCell align="left">{course.description}</TableCell>
                          <TableCell align="left">{modifiedCategories}</TableCell>
                          <TableCell align="left">{`R$ ${course.price}`}</TableCell>
                          <TableCell align="left">{course.discountPercentage > 0 ? `${course.discountPercentage}%` : ''}</TableCell>
                          <TableCell align="left">{course.stock}</TableCell>
                          <TableCell align="left">
                            <Box component={'div'} display={'flex'} gap={'8px'}>
                              <Box component={'div'} display={'flex'} onClick={() => {
                                setCreateModalOpen(true)
                                setCoursedSelected(course)
                              }}>
                                <EditIcon sx={{ cursor: 'pointer', color: '#1976d2' }} />
                              </Box>
                              <Box component={'div'} display={'flex'} onClick={() => {
                                setDeleteModalOpen(true)
                                setId(course.id)
                              }}>
                                <DeleteIcon sx={{ cursor: 'pointer', color: 'red' }} />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Copyright sx={{ pt: 4 }} />
            </Container>
            {Math.floor(numberOfPages()) > 0 && (
              <Pagination
                count={Math.floor(numberOfPages())}
                page={currentPage}
                onChange={handlePaginationChange}
              />
            )}
          </Box>
        </Box>
        <CourseModal
          handleClose={() => setCreateModalOpen(false)}
          open={createModalOpen}
          courseId={courseSelected?.id}
          getAllCourse={getAllCourse}
        />
        <ConfirmationModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          confirmAction={() => handleDeleteCourse()}
          cancelAction={() => setDeleteModalOpen(false)} />
      </ThemeProvider>
    </AuthGuard>
  );
}