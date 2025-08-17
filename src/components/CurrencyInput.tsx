"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { useQueryClient } from "@tanstack/react-query";

export const CurrencyInput = () => {
  const [value, setValue] = useState<number>(1);
  const [transfered, setTransfered] = useState<number>(1);
  const [dropdown1, setDropdown1] = useState<"" | "hidden">("hidden");
  const [dropdown2, setDropdown2] = useState<"" | "hidden">("hidden");
  type CurrencyType = "IRR" | "USD";
  const [currencyfrom, setCurrencyfrom] = useState<CurrencyType>("IRR");
  const [currencyto, setCurrencyto] = useState<CurrencyType>("USD");
  //   const [refresh, setRefresh] = useState<number>(0);
  const queryClient = useQueryClient();
  const {
    data: unit,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: () => axios.get("/api/convert"),
    select: (data) => {
      return data.data.value;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 h, once per day
  });
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  //   console.log(unit);

  useEffect(() => {
    if (isLoading || !unit?.value) return;

    const rates: Record<string, number> = { USD: 1, IRR: +unit.value };
    if (!rates[currencyfrom] || !rates[currencyto]) return;

    if (activeInput === "from") {
      const converted = (value / rates[currencyfrom]) * rates[currencyto];

      setTransfered(Number(converted.toFixed(8)));
    } else {
      const converted = (transfered / rates[currencyto]) * rates[currencyfrom];

      setValue(Number(converted.toFixed(8)));
    }
  }, [
    isLoading,
    currencyfrom,
    currencyto,
    value,
    transfered,
    activeInput,
    unit,
  ]);
  console.log("unit", unit);

  return (
    <div className="">
      {isLoading ? (
        <p className="text-center text-gray-500 animate-pulse">
          در حال بارگذاری...
        </p>
      ) : (
        <div className="  flex flex-col gap-3">
          <form className=" flex w-full mx-auto ">
            <div className=" relative mx-auto w-full flex max-w-[550px]">
              <button
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdown1(dropdown1 === "hidden" ? "" : "hidden");
                }}
              >
                {currencyfrom}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                className={` ${dropdown1} z-20 top-full absolute  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-80 dark:bg-gray-700`}
              >
                <ul className="p-2 text-sm flex flex-col gap-3 text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      className="flex w-full justify-between px-4  items-center hover:bg-gray-200 rounded-lg p-1 "
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrencyfrom("IRR");
                        setDropdown1("hidden");
                      }}
                    >
                      <p>IRR</p>
                      <div className="flex items-center gap-3 ">
                        <img
                          src="./iranflag.png"
                          alt=""
                          width={"40px"}
                          height={"40px"}
                          className="rounded-full h-[40px]  "
                        />
                        <p>تومان</p>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full justify-between px-4  items-center hover:bg-gray-200 rounded-lg p-1 "
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrencyfrom("USD");
                        setDropdown1("hidden");
                      }}
                    >
                      <p>USD</p>
                      <div className="flex items-center gap-3 ">
                        <img
                          src="./usaflag.png"
                          alt=""
                          width={"full"}
                          height={"40px"}
                          className="rounded-full h-[40px]  "
                        />

                        <p>دلار آمریکا</p>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="relative w-full rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:bg-neutral-400 focus:border-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-gray-50 ">
                <input
                  type="text"
                  className="block absolute left-7 p-2.5 w-full z-20 text-sm text-gray-900  "
                  placeholder={`${value}`}
                  value={`${value} `}
                  onChange={(e) => {
                    setActiveInput("from");
                    setValue(+e.target.value);
                  }}
                />
                <div className="absolute top-1/2 z-0 -translate-y-1/2 left-1">
                  {currencyfrom === "IRR" ? "تومان" : "$"}
                </div>
                <div className="flex flex-col absolute top-1/2 -translate-y-1/2 right-2">
                  <button
                    type="button"
                    className=" px-2"
                    onClick={() => setValue((v) => v + 1)}
                  >
                    <CiSquarePlus className="m-0 p-0 w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className=" px-2"
                    onClick={() => setValue((v) => (v > 0 ? v - 1 : v))}
                  >
                    <CiSquareMinus className="m-0 p-0 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <form className=" flex w-full mx-auto ">
            <div className=" relative mx-auto w-full flex max-w-[550px]">
              <button
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdown2(dropdown2 === "hidden" ? "" : "hidden");
                }}
              >
                {currencyto}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                className={` ${dropdown2} z-10 top-full absolute  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-80 dark:bg-gray-700`}
              >
                <ul className="p-2 text-sm flex flex-col gap-3 text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      className="flex w-full justify-between px-4  items-center hover:bg-gray-200 rounded-lg p-1 "
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrencyto("IRR");
                        setDropdown2("hidden");
                      }}
                    >
                      <p>IRR</p>
                      <div className="flex items-center gap-3 ">
                        <img
                          src="./iranflag.png"
                          alt=""
                          width={"40px"}
                          height={"40px"}
                          className="rounded-full h-[40px]  "
                        />
                        <p>تومان</p>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full justify-between px-4  items-center hover:bg-gray-200 rounded-lg p-1 "
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrencyto("USD");
                        setDropdown2("hidden");
                      }}
                    >
                      <p>USD</p>
                      <div className="flex items-center gap-3 ">
                        <img
                          src="./usaflag.png"
                          alt=""
                          width={"full"}
                          height={"40px"}
                          className="rounded-full h-[40px]  "
                        />

                        <p>دلار آمریکا</p>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="relative w-full rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:bg-neutral-400 focus:border-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-gray-50 ">
                <input
                  type="text"
                  className="block z-10 absolute left-7 p-2.5 w-full  text-sm text-gray-900  "
                  placeholder={`${transfered}`}
                  value={`${transfered}`}
                  onChange={(e) => {
                    setActiveInput("to");
                    setTransfered(+e.target.value);
                  }}
                />
                <div className="absolute top-1/2 z-0 -translate-y-1/2 left-1">
                  {currencyto === "IRR" ? "تومان" : "  $"}
                </div>
                <div className="flex flex-col absolute top-1/2 -translate-y-1/2 right-2">
                  <button
                    type="button"
                    className=" px-2"
                    onClick={() => setTransfered((v) => v + 1)}
                  >
                    <CiSquarePlus className="m-0 p-0 w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className=" px-2"
                    onClick={() => setTransfered((v) => (v > 0 ? v - 1 : v))}
                  >
                    <CiSquareMinus className="m-0 p-0 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="flex flex-col justify-center items-center mt-4 gap-2">
            {!isFetching && <p>آخرین آپدیت قیمت برای {unit.date} میباشد</p>}
            <button
              onClick={(e) => {
                queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
              }}
              className="border rounded-lg w-auto px-4 hover:bg-blue-100 bg-gray-50"
            >
              <p className="p-2">{isFetching ? "..." : "آپدیت نرخ دلار"}</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
