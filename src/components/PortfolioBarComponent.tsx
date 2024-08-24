import React from "react";
import BurgerIcon from '../assets/burger.svg';
import { HashLink } from 'react-router-hash-link';
import {
  Box,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { HomeOutlined, ConstructionOutlined, VolunteerActivismOutlined, WorkHistoryOutlined, InfoOutlined  } from "@mui/icons-material";


const PortfolioBarComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Toolbar disableGutters>
      <Box display="flex" gap="5px" alignItems="center">
        <IconButton 
          id="portfolio-menu-button"
          aria-controls={open ? 'portfolio-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          size="small" 
          color="primary" 
          onClick={handleClick}>
            <img src={BurgerIcon} width="50px" alt="Farhad Nowzari burger menu" />
        </IconButton>
        <Menu 
          id="portfolio-menu"
          disableScrollLock={true}
          MenuListProps={{
            'aria-labelledby': 'portfolio-menu-button',
          }}
          anchorEl={anchorEl}
          
          onClose={handleClose} open={open}
          TransitionComponent={Grow}>
          <MenuItem component={HashLink} smooth to="/#">
            <HomeOutlined sx={{ fontSize: "30px" }} />
            Home
          </MenuItem>
          <MenuItem component={HashLink} smooth to="/#skills">
            <ConstructionOutlined sx={{ fontSize: "30px" }} />
            Skills
          </MenuItem>
          <MenuItem component={HashLink} smooth to="/#contributions">
            <VolunteerActivismOutlined sx={{ fontSize: "30px" }} />
            Contributions
          </MenuItem>
          <MenuItem component={HashLink} smooth to="/#experiences">
            <WorkHistoryOutlined sx={{ fontSize: "30px" }} />
            Experiences
          </MenuItem>
          <MenuItem component={HashLink} smooth to="/#about-me">
            <InfoOutlined sx={{ fontSize: "30px" }} />
            About Me
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};

export default PortfolioBarComponent;
