import React, { useState, useEffect } from 'react';
import './index.css'; // Import the adjusted CSS file

const Snackbar = ({ message, durationMilliseconds, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      onClose();
    }, durationMilliseconds);

    return () => clearTimeout(timer);
  }, [durationMilliseconds, onClose]);

  return (
    <div className={`Snackbar ${open ? 'visible' : 'hidden'}`}>
      <span className="Snackbar__message">{message}</span>
    </div>
  );
};

export default Snackbar;