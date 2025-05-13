import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import ImageButton from '@mui/material/Button';
import ImageSrc from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';

export default function ExpandableImage(url, title) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button focusRipple key={title} onClick={handleOpen}>Cac
      </Button>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <img src={url}/>
      </Backdrop>
    </div>
  );
}