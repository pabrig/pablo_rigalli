import {
    Stack,
    useColorModeValue as colorMode,
    Text,
    Image,
    Tooltip,
    Divider,
    IconButton
} from '@chakra-ui/react';
import Link from 'next/link';
import Fade from 'react-reveal/Fade';
import { FaHome } from "react-icons/fa";


import { StackData } from '../../utils/constants';


export default function MyStack() {
    const data = StackData;

    return (

        <Stack
            width={{ base: 320, sm: 510 }}
            height={{ base: 360, sm: 350 }}
            margin="auto"
            alignItems="center"
            bg={colorMode("gray.200", "gray.700")}
            rounded="xl"
            _hover={{ boxShadow: "dark-lg", transition: "0.8s" }}


            mt={{ base: 0, sm: 10 }}
            mb={{ base: 55, sm: 20 }}

        >
            <Image
                src="https://img.icons8.com/clouds/70/000000/technology.png"
                alt="tech"
                mt={{ base: 5, sm: 10 }} />
            <Text
                fontSize="xl"
                fontWeight="bold"
            >
                My stack
            </Text>


            <Stack
                direction="row"
                p={5}
            >{
                    data && data.map(back => (
                        <Fade key={back.id} delay={back.delay}>
                            <Image src={back.image} alt={back.alt} />
                        </Fade>
                    ))
                }

            </Stack>
            <Stack pt={{ base: 10 }}>
                <Link href="/" >
                    <a>
                        <Tooltip label="Click for Home" aria-label='A tooltip'>
                            <IconButton
                                icon={<FaHome />}
                            >
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>
            </Stack>
        </Stack>

    )
}