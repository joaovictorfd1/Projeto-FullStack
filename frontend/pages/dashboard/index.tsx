import * as React from 'react';
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
import { getAllProducts } from '../../api/products';
import { IProduct } from '../../interfaces/IProduct';
import { Button, Pagination, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField } from '@mui/material';
import { ProductImage } from '../../components/Img/Img';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductModal from '../../components/Modal/Modal';

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

interface IResponseProducts {
  total: number
  skip: number
  limit: number
  products: IProduct[]
}

export default function Dashboard() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [filter, setFilter] = React.useState<string>('')
  const [productsObjects, setProductsObjects] = React.useState<IResponseProducts>({} as IResponseProducts)
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const createHandleMenuClick = () => {
    localStorage.removeItem('token')
    return router.push('/login')
  };

  const getAllProduct = async (skip: number, filter: string) => {
    const response = await getAllProducts(skip, filter)
    if (response) {
      return setProductsObjects(response)
    }
    return setProductsObjects({} as IResponseProducts)
  }

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
  };

  const numberOfPages = () => {
    return productsObjects.total / 15;
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    console.log(value)

    setFilter(value);
  };


  React.useEffect(() => {
    getAllProduct((currentPage - 1) * 15, filter)
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
                Listagem de Produtos
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
              <Box component={'div'} display={'flex'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Box component={'div'} display={'flex'}>
                  <TextField
                    type="text"
                    value={filter}
                    onChange={handleFilter}
                    label="Buscar por nome"
                    size="small"
                  />
                </Box>
                <Box component={'div'} display={'flex'}>
                  <Button
                    type='button'
                    variant="contained"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Novo Produto
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align='left' />
                      <TableCell align='left'>Nome</TableCell>
                      <TableCell align='left'>Marca</TableCell>
                      <TableCell align="left">Descrição</TableCell>
                      <TableCell align="left">Preço</TableCell>
                      <TableCell align="left">Desconto (%)</TableCell>
                      <TableCell align="left">Estoque</TableCell>
                      <TableCell align="left">Categoria</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsObjects && productsObjects.products?.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <ProductImage src={product.images[0]} alt={product.title} />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {product.title}
                        </TableCell>
                        <TableCell align="left">{product.brand}</TableCell>
                        <TableCell align="left">{product.description}</TableCell>
                        <TableCell align="left">{product.price}</TableCell>
                        <TableCell align="left">{product.discountPercentage}</TableCell>
                        <TableCell align="left">{product.stock}</TableCell>
                        <TableCell align="left">{product.category}</TableCell>
                        <TableCell align="left">
                          <Box component={'div'} display={'flex'} gap={'8px'}>
                            <EditIcon sx={{ cursor: 'pointer' }} />
                            <DeleteIcon sx={{ cursor: 'pointer' }} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
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
        <ProductModal
          handleClose={() => setCreateModalOpen(false)}
          open={createModalOpen}
          product={null}
        />
      </ThemeProvider>
    </AuthGuard>
  );
}