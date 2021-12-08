import { useColorMode as ColorToggle, useColorModeValue as ColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ColorModeSwitcher = () => {

    const { toggleColorMode } = ColorToggle();
    const SwitchIcon = ColorMode(FaMoon, FaSun);

    return (
        <IconButton
            size="lg"
            fontSize="lg"
            variant="ghost"
            borderColor="#ccd0d5"
            margin={4}
            onClick={toggleColorMode}
            icon={<SwitchIcon />}

        />
    );

};

export default ColorModeSwitcher;
