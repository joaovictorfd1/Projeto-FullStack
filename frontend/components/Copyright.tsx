import { Typography } from "@mui/material";
import Link from '@mui/material/Link';

export const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://linkedin.com/in/joaovictorfd">
        João Delmoni
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
