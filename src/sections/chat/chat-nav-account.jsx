import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
// import { svgIconClasses } from '@mui/material/SvgIcon';
import Badge
//  { badgeClasses }
  from '@mui/material/Badge';

// import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ChatNavAccount() {
  const { user } = useMockedUser();

  const popover = usePopover();

  const [status, setStatus] = useState('online');

  return (
    <>
      <Badge variant={status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Avatar
          src={user?.photoURL}
          alt={user?.displayName}
          onClick={popover.onOpen}
          sx={{ cursor: 'pointer', width: 48, height: 48 }}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: { sx: { p: 0 } },
          arrow: { placement: 'top-left' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ p:2 }}>
          <ListItemText
            primary={user?.displayName}
            secondary={user?.email}
            secondaryTypographyProps={{ component: 'span' }}
          />
        </Stack>
      </CustomPopover>
    </>
  );
}
