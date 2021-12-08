import { Stack, Divider, Text, Link } from "@chakra-ui/react";

const Footer = () => {

    return (
        <>
            <Stack>
                <Divider marginY={4} />
                <Text textAlign="center">
                    © Copyright {new Date().getFullYear()}. Made by{" "}
                    <Link
                        isExternal
                        href="https://github.com/pabrig">
                        Pablo Rigalli
                    </Link>
                    .
                </Text>
            </Stack>
        </>
    );

};

export default Footer;
