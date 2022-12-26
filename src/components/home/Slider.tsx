import React from "react";
import { useKeenSlider } from "keen-slider/react";
import { Box, Flex } from "@chakra-ui/react";
import "keen-slider/keen-slider.min.css";
import { prompts } from "@/core/utils/prompts";
import Image from "next/image";
import Link from "next/link";

const Slider = () => {
  const [sliderRef] = useKeenSlider(
    {
      slides: {
        perView: 3,
        spacing: 5,
      },
      breakpoints: {
        "(min-width: 500px)": {
          slides: { perView: 4, spacing: 5 },
        },
        "(min-width: 800px)": {
          slides: { perView: 6, spacing: 5 },
        },
        "(min-width: 1000px)": {
          slides: { perView: 10, spacing: 5 },
        },
      },
      loop: true,
      renderMode: "performance",
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });

          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <Flex overflowX="hidden" my={5} ref={sliderRef}>
      {prompts.map((prompt) =>
        ["romy", "sacha"].map((name) => (
          <Box
            transition="200ms all"
            _hover={{ filter: "contrast(140%)" }}
            key={`${prompt.slug}-${name}`}
            className="keen-slider__slide"
          >
            <Link href={`/prompts/dreambooth/${prompt.slug}`}>
              <Image
                style={{ borderRadius: 10 }}
                src={`/prompts/${name}/${prompt.slug}.png`}
                alt={prompt.label}
                width="400"
                height="400"
              />
            </Link>
          </Box>
        ))
      )}
    </Flex>
  );
};

export default Slider;
