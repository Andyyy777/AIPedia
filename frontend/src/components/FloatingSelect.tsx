import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import ImageIcon from "@mui/icons-material/Image";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import NavigationIcon from "@mui/icons-material/Navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./FloatingSelect.css";
import { Fab, Menu } from "@mui/material";
import { useAnchorStore } from "../store/store";
import { useShallow } from "zustand/shallow";

// Not sure whether we should put in bottom right or upper ForkLeft, so I keep both in code
const FloatingSelect = () => {
  const [anchorEl, setAnchorEl] = useAnchorStore(
    useShallow((state) => [state.anchor, state.setAnchor])
  );
  const [selectedOption, setSelectedOption] = useAnchorStore(
    useShallow((state) => [state.selectedOption, state.setSelectedOption])
  );
  let open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const handleCloseOption = (event: React.MouseEvent<HTMLLIElement>) => {
    setSelectedOption(event.currentTarget.textContent);
    setAnchorEl(null);
  };

  return (
    <div className="FloatingSelect">
      <Fab
        color="secondary"
        variant="extended"
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <ExpandMoreIcon />
        {selectedOption ? String(selectedOption) : null}
      </Fab>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleCloseOption} disableRipple>
          <ImageIcon sx={{ paddingRight: "5px" }} />
          Image only
        </MenuItem>
        <MenuItem onClick={handleCloseOption} disableRipple>
          <FileCopyIcon sx={{ paddingRight: "5px" }} />
          Image + Text
        </MenuItem>
        <MenuItem onClick={handleCloseOption} disableRipple>
          <SpatialAudioOffIcon sx={{ paddingRight: "5px" }} />
          Image + Text + Audio
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FloatingSelect;
