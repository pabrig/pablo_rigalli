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

import { FaArrowRight } from "react-icons/fa";


import { FrontData } from '../../utils/constants';




export default function FrontSide() {

    const data = FrontData;
    return (


        <Stack
            width={{ base: 320, sm: 510 }}
            height={{ base: 280, sm: 350 }}
            margin="auto"
            justifyContent="center"
            alignItems="center"
            bg={colorMode("gray.200", "gray.700")}
            rounded="xl"
            p={10}
            mt={{ base: 30, sm: 10 }}
            mb={{ base: 40, sm: 20 }}
            boxShadow="dark-lg"
            cursor="pointer"


        >
            <Image
                src="https://img.icons8.com/external-soft-fill-juicy-fish/50/000000/external-developer-web-developer-soft-fill-soft-fill-juicy-fish.png"
                alt="tech"
                mt={5} />

            <Text
                fontSize="xl"
                fontWeight="bold">
                Pablo Rigalli
            </Text>
            <Text
                fontSize="lg"
                fontWeight="300"

            >
                Front End Developer
            </Text>
            <Divider />
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center">
                {
                    data && data.map(front => (
                        <Fade key={front.id} delay={front.delay}>
                            <Link href={front.href}>
                                <a target="_blank">
                                    <Image src={front.image} alt={front.alt} />
                                </a>
                            </Link>
                        </Fade>
                    )

                    )
                }
            </Stack>
            <Stack pt={{ bae: 2, sm: 5 }} pl={{ base: 250, sm: 350 }}>
                <Link href="/backside">
                    <a>
                        <Tooltip label="Clicked for more info" aria-label='A tooltip'>
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
