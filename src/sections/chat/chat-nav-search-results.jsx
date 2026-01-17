import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';

import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export function ChatNavSearchResults({
  query,
  results,
  onClickResult,
  collapseDesktop,
  onCloseMobile,
}) {
  const totalResults = results.length;

  const notFound = !totalResults;

  const renderNotFound = (
    <SearchNotFound
      query={query}
      sx={{
        p: 3,
        mx: 'auto',
        width: `calc(100% - 40px)`,
        bgcolor: 'background.neutral',
      }}
    />
  );

  const renderResults = (
    <nav>
      <Box component="ul">
        {results?.map((result) => (
          <Box key={result?._id} component="li" sx={{ display: 'flex' }}>
            <ListItemButton
              onClick={() => {
                onClickResult(result);
                onCloseMobile();
              }}
              sx={{ gap: 2, py: 1.5, px: 2.5, typography: 'subtitle2' }}
            >
              <Avatar
                alt={result?.userId.userName || 'No Image'}
                src={`${import.meta.env.VITE_APP_BASE_URL}/${result?.userId.image}`}
              />
              {!collapseDesktop && (result?.userId.userName || '-')}
            </ListItemButton>
          </Box>
        ))}
      </Box>
    </nav>
  );

  return <>{notFound ? renderNotFound : renderResults}</>;
}
