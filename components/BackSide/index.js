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
import { FaArrowLeft } from "react-icons/fa";


import { BackData } from '../../utils/constants';


export default function BackSide() {
    const data = BackData;

    return (

        <Stack
            width={{ base: 320, sm: 510 }}
            height={{ base: 280, sm: 350 }}
            margin="auto"
            alignItems="center"
            bg={colorMode("gray.200", "gray.700")}
            rounded="xl"
            boxShadow="dark-lg"
            cursor="pointer"

            mt={{ base: 30, sm: 10 }}
            mb={{ base: 40, sm: 20 }}

        >
            <Image
                src="https://img.icons8.com/clouds/70/000000/technology.png"
                alt="tech"
                mt={5} />
            <Text
                fontSize="2xl"
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
            <Stack pt={{ bae: 2, sm: 5 }} pr={{ base: 250, sm: 350 }}>
                <Link href="/">
                    <a>
                        <Tooltip label="Clicked for Home" aria-label='A tooltip'>
                            <IconButton
                                icon={<FaArrowLeft />}
                            >
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>
            </Stack>
        </Stack>

    )
}