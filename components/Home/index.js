import {
  Stack,
  useColorModeValue as colorMode,
  Text,
  Image,
  Tooltip,
  Divider,
  IconButton
} from "@chakra-ui/react";
import Link from "next/link";
import Fade from "react-reveal/Fade";

import { FaArrowRight } from "react-icons/fa";

import { HomeData } from "../../utils/constants";

export default function Home() {
  const data = HomeData;
  return (
    <Stack
      width={{ base: 320, sm: 510 }}
      height={{ base: 360, sm: 350 }}
      margin="auto"
      justifyContent="center"
      alignItems="center"
      bg={colorMode("gray.200", "gray.700")}
      rounded="xl"
      p={10}
      mt={{ base: 0, sm: 10 }}
      mb={{ base: 55, sm: 20 }}
      _hover={{ boxShadow: "dark-lg", transition: "0.8s" }}
    >
      <Image src="../assets/programming.png" alt="tech" mt={5} width={10} />

      <Text fontSize="xl" fontWeight="bold">
        Pablo Rigalli
      </Text>
      <Text fontSize="lg" fontWeight="300">
        Software Developer
      </Text>
      <Divider />
      <Stack direction="row" justifyContent="center" alignItems="center">
        {data &&
          data.map((front) => (
            <Fade key={front.id} delay={front.delay}>
              <Link href={front.href}>
                <a target="_blank">
                  <Tooltip label={front.alt} aria-label={front.alt}>
                    <Image
                      src={front.image}
                      alt={front.alt}
                      hover={{ transform: "scale(0.9" }}
                    />
                  </Tooltip>
                </a>
              </Link>
            </Fade>
          ))}
      </Stack>
      <Stack pl={{ base: 250, sm: 350 }} pt={{ base: 5 }}>
        <Link href="/about">
          <a>
            <Tooltip label="more info" aria-label="A tooltip">
              <IconButton icon={<FaArrowRight />}></IconButton>
            </Tooltip>
          </a>
        </Link>
      </Stack>
    </Stack>
  );
}
