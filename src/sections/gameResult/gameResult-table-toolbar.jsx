import Stack from '@mui/material/Stack';
// import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
// import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';
// import InputLabel from '@mui/material/InputLabel';
// import IconButton from '@mui/material/IconButton';
// import FormControl from '@mui/material/FormControl';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';

import dayjs from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function GameResultTableToolbar({ filters, options, onResetPage, date, setDate }) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker']}>
            <DatePicker
              disabled={!(filters?.state?.status === 'manual')}
              disableFuture
              label="By Date"
              value={date?.fDate}
              onChange={(newValue) =>
                setDate((pre) => ({
                  ...pre,
                  fDate: dayjs(newValue),
                }))
              }
            />
            {/* <DatePicker
              disabled={!(filters?.state?.status === 'manual')}
              disableFuture
              label="Last Date"
              value={date?.lDate}
              onChange={(newValue) =>
                setDate((pre) => ({
                  ...pre,
                  lDate: dayjs(newValue),
                }))
              }
              minDate={date?.fDate || null}
            /> */}
          </DemoContainer>
        </LocalizationProvider>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
