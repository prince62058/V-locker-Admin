import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Pagination } from '@mui/material';
// import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [20],
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      /> */}
      <Box sx={{ float: 'right', my: 2, mr: 2 }}>
        <Pagination shape="circular" variant="text" {...other} />
      </Box>
      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch name="dense" checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )}
    </Box>
  );
}
