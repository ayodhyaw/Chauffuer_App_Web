import { CSSProperties } from '@mui/styles';

export const vehicleConfig: Record<string, CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    boxSizing: 'border-box',
    '& > *': {
      marginBottom: '20px',
    },
  },
};
