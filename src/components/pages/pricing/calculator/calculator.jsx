'use client';

import * as Slider from '@radix-ui/react-slider';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';
import ArrowRight from 'icons/arrow-right-thin.inline.svg';
import CheckIcon from 'icons/check.inline.svg';
import infoHoveredIcon from 'icons/tooltip-hovered.svg';
import infoIcon from 'icons/tooltip.svg';
import lines from 'images/pages/pricing/yellow-lines.svg';

const COMPUTE_TIME_PRICE = 0.102;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;
const DATA_TRANSFER_PRICE = 0.09;
const WRITTEN_DATA_PRICE = 0.096;
const PERCENTAGE_OF_MONTHLY_COST = 0.1;
const AVERAGE_DAYS_IN_MONTH = 30.416666;
const CUSTOM_THRESHOLD = 416;

const COMPUTE_UNITS_VALUES = {
  min: 0.25,
  max: 2.25,
  step: 0.25,
  default: 0.75,
};

const COMPUTE_TIME_VALUES = {
  min: 0.5,
  max: 24,
  step: 1,
  default: 10,
};

const STORAGE_VALUES = {
  min: 1,
  max: 200,
  default: 50,
};

const COMPUTE_UNITS_RANGES = {
  0.25: '1/4',
  0.5: '1/2',
  0.75: '1',
  1: '2',
  1.25: '3',
  1.5: '4',
  1.75: '5',
  2: '6',
  2.25: '7',
};

const calculateComputeCost = (computeUnits, activeTime) =>
  computeUnits * activeTime * COMPUTE_TIME_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateStorageCost = (storageValue) =>
  storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateDataTransferCost = (dataTransferValue) => dataTransferValue * DATA_TRANSFER_PRICE;

const calculateWrittenDataCost = (writtenDataValue) => writtenDataValue * WRITTEN_DATA_PRICE;

const Calculator = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [computeUnits, setComputeUnits] = useState(1);
  const [activeTime, setActiveTime] = useState(COMPUTE_TIME_VALUES.default);
  const [storageValue, setStorageValue] = useState(STORAGE_VALUES.default);
  const [dataTransferValue, setDataTransferValue] = useState(10);
  const [writtenDataValue, setWrittenDataValue] = useState(10);
  const [writtenAndTransferDataCost, setWrittenAndTransferDataCost] = useState(0);

  const computeTimeCost = useMemo(
    () => calculateComputeCost(computeUnits, activeTime),
    [computeUnits, activeTime]
  );

  const storageCost = useMemo(() => calculateStorageCost(storageValue), [storageValue]);

  const dataTransferCost = useMemo(
    () => calculateDataTransferCost(dataTransferValue),
    [dataTransferValue]
  );

  const writtenDataCost = useMemo(
    () => calculateWrittenDataCost(writtenDataValue),
    [writtenDataValue]
  );

  const totalCost = useMemo(
    () => computeTimeCost + storageCost + writtenAndTransferDataCost,
    [computeTimeCost, storageCost, writtenAndTransferDataCost]
  );

  const estimatedPrice = `$${totalCost.toFixed(2)}`;

  useEffect(
    () =>
      isAdvanced
        ? setWrittenAndTransferDataCost(dataTransferCost + writtenDataCost)
        : setWrittenAndTransferDataCost(totalCost * PERCENTAGE_OF_MONTHLY_COST),
    [dataTransferCost, isAdvanced, totalCost, writtenDataCost]
  );

  return (
    <section className="faq safe-paddings mb-40 mt-[17.25rem] xl:mt-40 xl:mb-36 lg:mt-32 lg:mb-24 md:mt-24 md:mb-20">
      <Container size="mdDoc">
        <div className="mx-auto flex max-w-[972px] flex-col items-center">
          <Heading
            className="text-center xl:mx-auto xl:max-w-2xl lg:inline"
            badge="Pricing Calculator"
            tag="h2"
            size="2sm"
          >
            Calculate your monthly bill based <wbr /> on compute time and storage
          </Heading>
        </div>
        <div className="mx-auto mt-16 grid max-w-[968px] grid-cols-[1fr_298px] gap-x-[40px] gap-y-[20px] xl:mt-11 xl:gap-x-[20px] lg:mt-10 lg:grid-cols-[1fr_224px] md:mt-9 md:grid-cols-1 md:gap-y-[15px]">
          <div className="row-span-1 flex rounded-[10px] bg-pricing-gray-10 md:flex-col">
            <div className="grow p-5 xl:px-6 xl:py-5 md:px-5">
              <h3 className="text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Compute time
              </h3>
              <div className="mt-5 grid grid-cols-2 items-center gap-3 md:mt-5">
                <h4 className="inline-flex items-center text-sm leading-none tracking-tight text-pricing-gray-9">
                  <span>Compute size</span>
                  <Tooltip
                    id="compute"
                    content="Compute size is measured in Compute Units (CU). In Neon, a CU has 1 vCPU and 4 GB of RAM. The number of CUs defines the processing power of your Neon compute."
                  />
                </h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[COMPUTE_UNITS_VALUES.default]}
                  min={COMPUTE_UNITS_VALUES.min}
                  max={COMPUTE_UNITS_VALUES.max}
                  step={COMPUTE_UNITS_VALUES.step}
                  aria-label="Compute units"
                  onValueChange={(value) => {
                    let computeUnitsValue = value[0];

                    if (value[0] >= 0.75)
                      computeUnitsValue = Number(COMPUTE_UNITS_RANGES[value[0]]);

                    setComputeUnits(computeUnitsValue);
                  }}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb className="flex cursor-pointer items-center justify-center rounded-full before:absolute before:top-1/2 before:left-1/2 before:h-6 before:w-6 before:-translate-y-1/2 before:-translate-x-1/2 focus:outline-none focus-visible:ring focus-visible:ring-pricing-primary-4 focus-visible:ring-opacity-75">
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight text-pricing-gray-9">
                  <span className="after:mx-2 after:inline-block after:h-[4px] after:w-[4px] after:rounded-full after:bg-pricing-primary-1 after:align-middle">
                    {computeUnits <= 0.5 ? COMPUTE_UNITS_RANGES[computeUnits] : computeUnits}vCPU
                  </span>
                  <span>{computeUnits * 4}GB RAM</span>
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 items-center gap-3 xl:mt-6 lg:mt-6">
                <h4 className="inline-flex items-center text-sm leading-none tracking-tight text-pricing-gray-9">
                  Active time
                  <Tooltip
                    id="activeTime"
                    content="The number of hours per day that your compute resources are active, on average."
                  />
                </h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[COMPUTE_TIME_VALUES.default]}
                  min={COMPUTE_TIME_VALUES.min}
                  max={COMPUTE_TIME_VALUES.max}
                  step={COMPUTE_TIME_VALUES.step}
                  aria-label="Active time"
                  onValueChange={(value) => setActiveTime(value[0])}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb className="flex cursor-pointer items-center justify-center rounded-full before:absolute before:top-1/2 before:left-1/2 before:h-6 before:w-6 before:-translate-y-1/2 before:-translate-x-1/2 focus:outline-none focus-visible:ring focus-visible:ring-pricing-primary-4 focus-visible:ring-opacity-75">
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight">
                  {activeTime} hour{activeTime <= 1 ? '' : 's'}{' '}
                  <span className="text-pricing-gray-7">per day</span>
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-dashed border-pricing-gray-2 pt-5 text-pricing-gray-94 ">
                <p className="whitespace-nowrap text-sm font-medium leading-none">
                  <span className="uppercase">Subtotal: </span>
                  <span className="text-pricing-primary-1">${computeTimeCost.toFixed(2)} </span>
                  <span className="font-normal text-pricing-gray-7">per month</span>
                </p>
                <p className="text-right text-sm leading-none">
                  ${COMPUTE_TIME_PRICE} <span className="text-pricing-gray-7">per hour</span>
                </p>
              </div>
            </div>
          </div>

          <div className="row-span-1 flex rounded-[10px] bg-pricing-gray-10 md:flex-col">
            <div className="grow p-5 xl:px-6 xl:py-5 md:px-5">
              <h3 className="text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Project storage
              </h3>
              <div className="mt-5 grid grid-cols-2 items-center gap-3 md:mt-5">
                <h4 className="text-sm leading-none tracking-tight text-pricing-gray-9">Data</h4>
                <Slider.Root
                  className="relative col-span-2 row-start-2 flex h-1 w-full grow touch-none items-center"
                  defaultValue={[STORAGE_VALUES.default]}
                  min={STORAGE_VALUES.min}
                  max={STORAGE_VALUES.max}
                  aria-label="Compute units"
                  onValueChange={(value) => setStorageValue(value[0])}
                >
                  <Slider.Track className="relative h-[2px] w-full grow rounded-[10px] bg-pricing-gray-3">
                    <Slider.Range className="absolute h-full rounded-full bg-pricing-primary-1" />
                  </Slider.Track>
                  <Slider.Thumb className="flex cursor-pointer items-center justify-center rounded-full before:absolute before:top-1/2 before:left-1/2 before:h-6 before:w-6 before:-translate-y-1/2 before:-translate-x-1/2 focus:outline-none focus-visible:ring focus-visible:ring-pricing-primary-4 focus-visible:ring-opacity-75">
                    <span className="h-2.5 w-1 rounded-[1px] bg-pricing-primary-1" />
                  </Slider.Thumb>
                </Slider.Root>
                <p className="text-right text-sm leading-none tracking-tight text-pricing-gray-9">
                  {storageValue} GiB
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 border-t border-dashed border-pricing-gray-2 pt-5 text-pricing-gray-94">
                <p className="whitespace-nowrap text-sm font-medium leading-none">
                  <span className="uppercase">Subtotal: </span>
                  <span className="text-pricing-primary-1">${storageCost.toFixed(2)} </span>
                  <span className="font-normal text-pricing-gray-7">per month</span>
                </p>
                <p className="text-right text-sm leading-none text-pricing-gray-7">
                  <span className="text-pricing-gray-94">${COMPUTE_TIME_PRICE}</span> per hour
                </p>
              </div>
            </div>
          </div>

          <div className="row-span-1 rounded-[10px] bg-pricing-gray-10 p-5 xl:px-6 xl:py-5 md:flex-col md:p-0">
            <div className="min-h-[202px] md:px-5 md:py-5 [@media(min-width:428px)]:min-h-[151px] [@media(min-width:606px)]:min-h-[auto]">
              <h3 className="flex items-center text-sm font-medium uppercase leading-none tracking-wider text-pricing-secondary-9">
                Data transfer and Written data
                <Tooltip
                  id="data"
                  content="Written data is the amount of data written from compute to storage. Data transfer is the amount of data transferred out of Neon."
                />
              </h3>
              <LazyMotion features={domAnimation}>
                <AnimatePresence initial={false} mode="wait">
                  {isAdvanced ? (
                    <m.ul
                      className="mb-4 mt-5 flex items-center gap-x-8 text-[15px] tracking-tight text-pricing-gray-9 xl:mb-5 xl:flex-wrap xl:gap-x-7 sm:gap-4"
                      initial={{
                        opacity: 0,
                        translateY: 10,
                      }}
                      animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{ ease: [0.25, 0.1, 0, 1] }}
                    >
                      <li className="flex">
                        <label htmlFor="dataTransfer">Data transfer</label>
                        <input
                          id="dataTransfer"
                          className="ml-2 w-12 rounded-l-sm border-r border-pricing-gray-2 bg-[#242628] pl-2 pr-1 text-[15px] tracking-tight xl:ml-2"
                          name="data-transfer"
                          type="number"
                          min={0}
                          max={1000}
                          placeholder="10"
                          value={dataTransferValue}
                          onChange={(event) => {
                            if (event?.target?.value > 1000) return false;
                            return setDataTransferValue(event?.target?.value);
                          }}
                        />
                        <span className="rounded-r-sm bg-[#242628] px-2 pt-[3px] align-middle text-[11px] font-medium tracking-tight text-pricing-gray-6">
                          GiB
                        </span>
                      </li>
                      <li className="flex">
                        <label htmlFor="writtenData">Written data</label>
                        <input
                          id="writtenData"
                          className="ml-2 w-12 rounded-l-sm border-r border-pricing-gray-2 bg-[#242628] pl-2 pr-1 text-[15px] tracking-tight xl:ml-2"
                          name="written-data"
                          type="number"
                          min={0}
                          max={1000}
                          placeholder="10"
                          value={writtenDataValue}
                          onChange={(event) => {
                            if (event?.target?.value > 1000) return false;
                            return setWrittenDataValue(event?.target?.value);
                          }}
                        />
                        <span className="rounded-r-sm bg-[#242628] px-2 pt-[3px] align-middle text-[11px] font-medium tracking-tight text-pricing-gray-6">
                          GiB
                        </span>
                      </li>
                      <li>
                        <button
                          className="relative mx-0 inline-flex items-center text-pricing-primary-1 transition-colors duration-200 hover:text-[#00ffaa]"
                          type="button"
                          onClick={() => setIsAdvanced(false)}
                        >
                          Use average percentage
                        </button>
                      </li>
                    </m.ul>
                  ) : (
                    <m.p
                      className="mb-4 mt-5 text-[15px] tracking-tight text-pricing-gray-9 xl:mb-5"
                      initial={{
                        opacity: 0,
                        translateY: 10,
                      }}
                      animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{ ease: [0.25, 0.1, 0, 1] }}
                    >
                      Accounts for 10% of your monthly cost, on average.
                      <button
                        className="group relative mx-2 inline-flex items-center text-pricing-primary-1 transition-colors duration-200 hover:text-[#00ffaa]"
                        type="button"
                        onClick={() => setIsAdvanced(true)}
                      >
                        Enter your own values
                        <ArrowRight
                          className="ml-1 transition duration-200 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </button>
                    </m.p>
                  )}
                </AnimatePresence>
              </LazyMotion>
            </div>
            <div className="flex justify-between border-t border-dashed border-pricing-gray-2 pt-5 text-pricing-gray-94 md:px-5 md:py-5">
              <p className="text-sm font-medium leading-none">
                <span className="uppercase">Subtotal: </span>
                <span className="text-pricing-primary-1">
                  ${writtenAndTransferDataCost.toFixed(2)}{' '}
                </span>
                <span className="font-normal text-pricing-gray-7">per month</span>
              </p>
            </div>
          </div>

          <div className="col-start-2 row-span-3 row-start-1 flex flex-col self-auto rounded-[10px] border border-secondary-2 px-6 py-7 lg:px-5 md:col-start-1 md:row-span-1 md:grid md:grid-cols-2 md:gap-x-32 sm:grid-cols-1 sm:gap-x-0">
            <h3 className="text-lg leading-none tracking-tight text-white md:col-start-2 sm:col-start-1">
              Estimated price
            </h3>
            <p className="mt-6 flex items-end gap-2 leading-none text-white xl:mt-7 lg:mt-5 md:col-start-2 sm:col-start-1">
              <span className="text-[56px] font-light tracking-[-0.06em] text-secondary-2 lg:text-[44px]">
                {estimatedPrice}
              </span>
              <span className="mb-1 block text-[26px] tracking-normal lg:text-[24px]">/mo</span>
            </p>
            <p className="relative mb-7 mt-11 xl:mt-10 xl:mb-8 lg:my-8 md:col-start-2 sm:col-start-1">
              <Button
                className="relative z-20 w-full max-w-[260px] !bg-secondary-2 !py-[17px] !text-lg font-medium md:w-full md:max-w-[340px]"
                theme="primary"
                to={totalCost >= CUSTOM_THRESHOLD ? LINKS.contactSales : LINKS.dashboard}
                size="sm"
              >
                {totalCost >= CUSTOM_THRESHOLD ? 'Get Custom Quote' : 'Get Started'}
              </Button>
              <img
                className="pointer-events-none absolute left-1/2 -top-8 z-10 min-w-[120%] -translate-x-1/2 lg:-top-4 md:hidden"
                src={lines}
                width={296}
                height={134}
                loading="lazy"
                alt=""
              />
            </p>
            <ul className="md: my-9 flex w-full flex-col space-y-7 text-lg leading-none tracking-tight text-pricing-black xl:mt-12 lg:mt-4 lg:space-y-6 md:col-span-1 md:row-span-3 md:row-start-1 md:my-0 md:self-start sm:row-span-1 sm:my-2">
              <li className="relative flex items-center text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] md:pl-0 sm:pl-0">
                <CheckIcon className="mr-2 w-4 text-secondary-2" aria-hidden />
                <span className="mr-1">{computeUnits}</span>
                <span>compute units</span>
              </li>
              <li className="relative flex items-center text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] md:pl-0 sm:pl-0">
                <CheckIcon className="mr-2 w-4 text-secondary-2" aria-hidden />
                <span className="mr-1">{storageValue} GiB</span>
                <span>storage</span>
              </li>
              <li className="relative flex items-center text-base leading-tight tracking-tight text-white after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:bg-black after:opacity-[0.05] md:pl-0 sm:pl-0">
                <CheckIcon className="mr-2 w-4 text-secondary-2" aria-hidden />
                {isAdvanced && <span className="mr-1">{writtenDataValue} GiB</span>}
                <span>written data</span>
              </li>
              <li className="relative flex items-center text-base leading-tight tracking-tight text-white md:pl-0 sm:pl-0">
                <CheckIcon className="mr-2 w-4 text-secondary-2" aria-hidden />
                {isAdvanced && <span className="mr-1">{dataTransferValue} GiB</span>}
                <span>data transfer</span>
              </li>
            </ul>
            <span className="mt-6 block text-base font-light tracking-tight text-pricing-gray-7 xl:mt-auto lg:text-[14px] md:mt-8">
              Based on the US East (Ohio) region
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Tooltip = ({ content, id }) => (
  <span className="relative ml-[6px] inline-flex text-left align-middle normal-case lg:hidden">
    <span className="group peer cursor-pointer" data-tooltip-id={id} data-tooltip-content={content}>
      <img
        className="group-hover:hidden"
        src={infoIcon}
        width={14}
        height={14}
        loading="lazy"
        alt=""
      />
      <img
        className="hidden group-hover:block"
        src={infoHoveredIcon}
        width={14}
        height={14}
        loading="lazy"
        alt=""
      />
    </span>
    <span className="pointer-events-none absolute	left-[calc(100%+12px)] top-1/2 z-50 w-[14rem] -translate-y-1/2 rounded-[4px] bg-pricing-gray-2 px-3 py-[10px] text-[12px] font-normal leading-dense tracking-wide text-pricing-gray-9 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 lg:static lg:mt-1.5 lg:hidden lg:translate-y-0 lg:bg-transparent lg:p-0">
      {content}
    </span>
    <span className="absolute left-[calc(100%+8px)] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded bg-pricing-gray-2 opacity-0 transition-opacity duration-200 peer-hover:opacity-100 lg:hidden" />
  </span>
);

Tooltip.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
};

export default Calculator;