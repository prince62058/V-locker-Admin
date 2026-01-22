// import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useState, useEffect } from 'react';

import {
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  CircularProgress,
} from '@mui/material';

import {
  useGetAllUsersQuery,
  useCreateLeadboardMutation,
  useUpdateLeadboardMutation,
} from 'src/redux/rtk/api';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function LeaderboardQuickEditForm({ currentUser, open, onClose, update, leadoardId }) {
  const [user, setUser] = useState('');
  const [point, setPoint] = useState('');
  const [formData, setFormData] = useState([]);

  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: userList, isLoading } = useGetAllUsersQuery({
    type: 'USER',
    status: 'false',
    page,
    search: '',
  });

  const handleAdd = () => {
    if (!user) return;

    // Check if the user is already in the formData
    const isUserExists = formData.some((item) => item?.userId._id === user?._id);

    if (isUserExists) {
      toast.error('User is already added');
      return;
    }
    setFormData((pre) => [
      ...pre,
      {
        userId: user,
        points: point,
      },
    ]);
    setUser('');
    setPoint('');
  };

  const handleSub = (i) => {
    const newData = [...formData];
    newData.splice(i, 1);
    setFormData(newData);
  };

  useEffect(() => {
    if (userList?.data) {
      setUserData((prev) =>
        page === 1 ? userList?.data ?? [] : [...prev, ...(userList?.data ?? [])]
      );
    }
  }, [userList, page]);

  const loadMorePages = () => {
    if (loading || (userList && userList?.currentPage >= userList?.page)) return;
    setLoading(true);
    setPage((prev) => prev + 1);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const [createLeadboard] = useCreateLeadboardMutation();
  const [updateLeadboard] = useUpdateLeadboardMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (update) {
        const newArr = formData?.map((ele) => ({
          userId: ele?.userId?._id,
          points: ele?.points,
        }));
        const res = await updateLeadboard({
          data: {
            leaderId: leadoardId,
            user: newArr,
          },
        });
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
        setFormData([]);
      } else {
        const newArr = formData?.map((ele) => ({
          userId: ele?.userId?._id,
          points: ele?.points,
        }));
        const res = await createLeadboard({
          data: {
            user: newArr,
          },
        });
        onClose();
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.error?.data?.message);
        }
        setFormData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form onSubmit={onSubmit}>
        <DialogTitle>Quick {update ? 'Update' : 'Create'}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            <FormControl fullWidth>
              <Select
                value={user?.userId?.userName}
                onChange={(e) => setUser(e.target.value)}
                displayEmpty
                renderValue={(selected) => (selected ? selected?.userName || '-' : 'Select User')}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 200 },
                    onScroll: (event) => {
                      const bottom =
                        event.target.scrollHeight - event.target.scrollTop <=
                        event.target.clientHeight + 5;
                      if (bottom) loadMorePages();
                    },
                  },
                }}
              >
                {userData &&
                  userData?.length > 0 &&
                  userData?.map((ele, i) => (
                    <MenuItem key={i} value={ele}>
                      {ele?.userName || '-'}
                    </MenuItem>
                  ))}
                {loading && (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              id="outlined-required"
              label="Point"
              defaultValue="Hello World"
              type="number"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
            />
          </Box>
          <Box
            rowGap={1}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
            {formData?.map((ele, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  my: 1,
                }}
              >
                <Typography>{`${ele?.userId?.userName || '-'} ${ele?.points}`}</Typography>
                <Button sx={{ mx: 1 }} onClick={() => handleSub(i)}>
                  X
                </Button>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleAdd} disabled={point === ''}>
            Add
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" disabled={!(formData?.length > 0)}>
            Quick {update ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
