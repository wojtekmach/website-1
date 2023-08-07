import Image from 'next/image';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import illustration from './images/cta-elephant.jpg';

const CTA = () => (
  <section className="safe-paddings mt-[180px] overflow-hidden bg-black-new 2xl:mt-40 xl:mt-[125px] lg:mt-16">
    <Container
      size="medium"
      className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4 md:grid-cols-1"
    >
      <div className="relative z-10 col-span-4 col-start-2 flex flex-col pb-[164px] pt-16 2xl:col-span-5 2xl:col-start-2 2xl:pb-36 xl:pb-[78px] xl:pt-20 lg:col-span-6 lg:pb-[54px] md:col-span-full md:text-center">
        <Heading
          className="max-w-[500px] xl:max-w-[400px] lg:max-w-[350px] md:mx-auto"
          tag="h2"
          size="2sm"
        >
          Build your next AI app now with Neon
        </Heading>
        <p className="mt-3 text-lg font-light leading-snug xl:text-base lg:max-w-lg md:mx-auto md:max-w-md">
          Neon offers flexible usage and volume-based plans. Contact our Sales team to learn more.
        </p>
        <div className="mt-9 flex items-center gap-x-8 xl:mt-7 lg:gap-x-4 md:justify-center sm:mt-6 sm:flex-col sm:gap-y-5">
          <AnimatedButton
            className="inline-flex px-14 py-5 text-lg tracking-extra-tight hover:bg-[#00FFAA] xl:px-10 xl:py-[17px] lg:px-9 lg:text-base sm:px-14 sm:text-lg"
            spreadClassName="sm:h-[105px]"
            theme="primary"
            to={LINKS.contactSales}
            animationSize="sm"
            animationClassName="w-[126%]"
            spread={3}
            isAnimated
          >
            Contact Sales
          </AnimatedButton>
          <Link
            className="tracking-extra-tight underline-offset-[5px]"
            theme="green-underlined"
            to="https://github.com/neondatabase/pg_embedding"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            Learn more on GitHub
          </Link>
        </div>
      </div>
      <div className="relative col-span-7 col-start-6 2xl:col-span-6 2xl:col-start-7 md:z-20 md:col-span-full md:flex md:justify-center">
        <Image
          className="absolute bottom-0 left-0 w-[842px] max-w-none 2xl:w-[750px] xl:-left-20 xl:w-[652px] lg:-left-28 lg:w-[553px] md:static md:w-[591px]"
          src={illustration}
          width={842}
          height={482}
          alt=""
        />
      </div>
    </Container>
  </section>
);

export default CTA;