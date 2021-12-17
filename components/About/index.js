import {
    Stack,
    useColorModeValue as colorMode,
    Text,
    Image,
    Tooltip,
    Divider,
    IconButton,
    List, ListItem, ListIcon
} from '@chakra-ui/react';
import Link from 'next/link';
import Fade from 'react-reveal/Fade';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";


import { AboutData } from '../../utils/constants';



export default function Home() {
    const initial = { opacity: 0, rotateY: 0 };
    const animate = { opacity: 1, rotateY: 180 };
    const exit = { opacity: 1, rotateY: 180 };
    const data = AboutData;
    return (

        <Stack
            width={{ base: 320, sm: 510 }}
            height={{ base: 360, sm: 350 }}
            margin="auto"
            justifyContent="center"
            alignItems="center"
            bg={colorMode("gray.200", "gray.700")}
            rounded="xl"
            p={5}
            mt={{ base: 0, sm: 10 }}
            mb={{ base: 55, sm: 20 }}
            _hover={{ boxShadow: "dark-lg", transition: "0.8s" }}
        >
            <Image
                src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/000000/external-hacker-internet-security-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
                alt="tech"
                mt={5} />
            <Text
                fontSize="xl"
                fontWeight="bold">
                About Me
            </Text>
            <List spacing={1} >
                {data && data.map(about => (
                    <Fade key={about.id} delay={about.delay}>
                        <ListItem justifyContent="center" alignItems="center">
                            <Text
                                fontSize="lg"
                                fontWeight="300"
                                textAlign="center"
                            >
                                {about.description}
                            </Text>
                        </ListItem>
                    </Fade>
                ))}
            </List>

            <Stack pl={{ base: 250, sm: 350 }} pb={{ base: 10, sm: 0 }}>
                <Link href="/stack">
                    <a>
                        <Tooltip label="more info" aria-label='A tooltip'>
                            <IconButton
                                icon={<FaArrowRight />}
                            >
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>

            </Stack>
        </Stack>


    )
}
