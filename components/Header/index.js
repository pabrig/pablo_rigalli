import { Stack, Divider } from "@chakra-ui/react";

import ColorModeSwitcher from "../ColorModeSwitcher"

const Header = () => {

    return (
        <>
            <Stack
                justifyContent="center"
                align="center"
                marginBottom={5}>
                <ColorModeSwitcher />
            </Stack>
        </>
    );

};
export default Header;