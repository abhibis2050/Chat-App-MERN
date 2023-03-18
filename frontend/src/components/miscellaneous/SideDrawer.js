import {
  Box,
  Button,
  Menu,
  Text,
  Tooltip,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { BellIcon,ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";


const SideDrawer = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user} = ChatState();

  const logoutHandler = ()=>{
      localStorage.removeItem("userInfo");
      navigate("/");
  }
  return (    
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User To Chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                <MenuItem > My Profile </MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}> Logout </MenuItem>
              </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
      >
        <DrawerOverlay/> 

      </Drawer>
    </>
  );
};

export default SideDrawer;
