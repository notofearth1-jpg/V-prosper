import React, { useState } from "react";
import { Link } from "react-router-dom";
import TabNavigation from "../../../components/page-layouts/TabNavigation";
import dataaa from "./Data";
import PaginationFooter from "../../../components/page-layouts/PaginationFooter";
import Sidebarmenu from "../../../components/page-layouts/Sidebarmenu";

const DataList = () => {
  const [data, setData] = useState(dataaa);
  const [rotation, setRotation] = useState(Array(data.length).fill(-90));
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDropdownid, setSelectedDropdownid] = useState();
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverId, SetHoverId] = useState(null);
  const [openDropdownIndices, setOpenDropdownIndices] = useState<number[]>([]);
  const handleImageClick = (index: number, id: number) => {
    const newRotation = [...rotation];
    newRotation[index] = rotation[index] === 0 ? -90 : 0;
    setRotation(newRotation);

    const updatedData = data.map((item, i) =>
      i === index ? { ...item, isClicked: !item.isClicked } : item
    );

    setData(updatedData);

    const tableRow = document.getElementById(`data-row-${index}`);
    const rect: any = tableRow?.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    if (openDropdownIndices.includes(index)) {
      setOpenDropdownIndices(openDropdownIndices.filter((i) => i !== index));
    } else {
      setOpenDropdownIndices([...openDropdownIndices, index]);
    }

    // setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const containerClassName = `${sidebarOpen ? "" : "closed-sidebar "}`;

  const rotationStyle = {
    transform: sidebarOpen ? "rotate(90deg)" : "rotate(-90deg)",
    transition: "transform 0.5s ease", // Add a transition for a smooth rotation effect
  };

  return (
    <div className={`overflow-x-auto`}>
      <div className="min-w-screen min-h-screen flex justify-center font-sans overflow-hidden">
        <div
          className={` py-4  relative border-e-2  border-gray-300 bg-zinc-100 `}
        >
          <div className="px-5">
            <div className="flex items-center ">
              {/* <p id="drawer-navigation-label" className="text-base font-semibold text-black uppercase ">Menu</p> */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-drawer-hide="drawer-form"
                aria-controls="drawer-form"
                className="  px-1 py-1 rounded-full bg-white border shadow-md text-gray-400 bg-transparent  -right-3 top-10 hover:text-gray-900  text-sm  absolute   inline-flex items-center justify-center"
              >
                <img
                  width="13"
                  style={rotationStyle}
                  height="13"
                  src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/000000/external-down-arrows-inkubators-detailed-outline-inkubators-4.png"
                  alt="external-down-arrows-inkubators-detailed-outline-inkubators-4"
                />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <div className={`${containerClassName} open-sidebar`}>
              <Sidebarmenu />
            </div>
          </div>
        </div>
        {/* )} */}
        <div className="w-full ">
          {/*----------------------- Advance search & page title --------------------------------------- */}
          {/* <AdvanceSearch /> */}
          {/*-----------------------  Advance search & page title--------------------------------------- */}

          {/*----------------------- tab navigation--------------------------------------- */}
          <TabNavigation />
          {/*----------------------- tab navigation--------------------------------------- */}
          {/* <div className='row'>
                        <button type='button' onClick={() => setSidebarOpen(!sidebarOpen)} className='flex items-center px-3 py-2 text-xs font-medium text-center text-white  border  border-gray-300   bg-blue-500 rounded focus:ring-1 focus:outline-none focus:ring-blue-300'>Open sidebar </button>
                    </div> */}

          <div id="datatable" className="">
            <table className="">
              <thead>
                <tr className="text-gray-600 uppercase text-sm leading-normal ">
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-center flex justify-center items-center font-semibold "
                  >
                    {/* Details */}
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-left font-semibold"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-left font-semibold"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-start font-semibold"
                  >
                    Users
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-center font-semibold"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-center font-semibold"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-center font-semibold"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-left font-semibold"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-2 lg:px-2 text-center font-semibold"
                  >
                    Country
                  </th>
                  {/* <th scope="col" className="py-3 px-2 lg:px-2 text-center font-semibold">Actions</th> */}
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light overflow-y-auto">
                {data.map((item, index: any) => (
                  <React.Fragment key={index}>
                    <tr
                      id={`data-row-${index}`}
                      className="border lg:border lg:border-l-0 border-gray-200 hover:bg-gray-100 mx-2 rounded-sm"
                      onMouseEnter={() => SetHoverId(index)}
                      onMouseLeave={() => SetHoverId(null)}
                    >
                      <td
                        scope="row"
                        data-label=""
                        className=" items-center justify-center py-1  whitespace-nowrap"
                      >
                        <div className="flex  justify-end lg:justify-center items-center">
                          <img
                            onClick={() => handleImageClick(index, item.id)}
                            style={{
                              transform: `rotate(${rotation[index]}deg)`,
                              transition: "transform 0.3s ease-in-out",
                            }}
                            width="13"
                            height="13"
                            src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/100/000000/external-chevron-arrows-tanah-basah-basic-outline-tanah-basah-4.png"
                            alt="external-chevron-arrows-tanah-basah-basic-outline-tanah-basah-4"
                          />
                        </div>
                      </td>
                      <td
                        data-label="Project"
                        className="py-1 lg:py-1 px-2 lg:px-2 text-left"
                      >
                        <div className="flex justify-end lg:justify-start items-center">
                          <div className="mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="24"
                              height="24"
                              viewBox="0 0 48 48"
                            >
                              <path
                                fill="#80deea"
                                d="M24,34C11.1,34,1,29.6,1,24c0-5.6,10.1-10,23-10c12.9,0,23,4.4,23,10C47,29.6,36.9,34,24,34z M24,16	c-12.6,0-21,4.1-21,8c0,3.9,8.4,8,21,8s21-4.1,21-8C45,20.1,36.6,16,24,16z"
                              ></path>
                              <path
                                fill="#80deea"
                                d="M15.1,44.6c-1,0-1.8-0.2-2.6-0.7C7.6,41.1,8.9,30.2,15.3,19l0,0c3-5.2,6.7-9.6,10.3-12.4c3.9-3,7.4-3.9,9.8-2.5	c2.5,1.4,3.4,4.9,2.8,9.8c-0.6,4.6-2.6,10-5.6,15.2c-3,5.2-6.7,9.6-10.3,12.4C19.7,43.5,17.2,44.6,15.1,44.6z M32.9,5.4	c-1.6,0-3.7,0.9-6,2.7c-3.4,2.7-6.9,6.9-9.8,11.9l0,0c-6.3,10.9-6.9,20.3-3.6,22.2c1.7,1,4.5,0.1,7.6-2.3c3.4-2.7,6.9-6.9,9.8-11.9	c2.9-5,4.8-10.1,5.4-14.4c0.5-4-0.1-6.8-1.8-7.8C34,5.6,33.5,5.4,32.9,5.4z"
                              ></path>
                              <path
                                fill="#80deea"
                                d="M33,44.6c-5,0-12.2-6.1-17.6-15.6C8.9,17.8,7.6,6.9,12.5,4.1l0,0C17.4,1.3,26.2,7.8,32.7,19	c3,5.2,5,10.6,5.6,15.2c0.7,4.9-0.3,8.3-2.8,9.8C34.7,44.4,33.9,44.6,33,44.6z M13.5,5.8c-3.3,1.9-2.7,11.3,3.6,22.2	c6.3,10.9,14.1,16.1,17.4,14.2c1.7-1,2.3-3.8,1.8-7.8c-0.6-4.3-2.5-9.4-5.4-14.4C24.6,9.1,16.8,3.9,13.5,5.8L13.5,5.8z"
                              ></path>
                              <circle
                                cx="24"
                                cy="24"
                                r="4"
                                fill="#80deea"
                              ></circle>
                            </svg>
                          </div>
                          <span className="font-medium">{item.project}</span>
                        </div>
                      </td>
                      <td
                        data-label="Client"
                        className="lg:py-1 px-2 lg:px-2 text-left"
                      >
                        <div className="flex items-center  lg:justify-start justify-end">
                          <div className="mr-2">
                            <img
                              className="w-6 h-6 rounded-full"
                              src={item.client.avatar}
                              alt="Client"
                            />
                          </div>
                          <span>{item.client.name}</span>
                        </div>
                      </td>
                      <td
                        data-label="Users"
                        className="lg:py-1 px-2 lg:px-2 text-center flex "
                      >
                        <div className="flex justify-end  lg:justify-start">
                          <img
                            className="w-6 h-6 rounded-full"
                            src={item.client.avatar}
                            alt="Client"
                          />
                          <img
                            className="w-6 h-6 rounded-full"
                            src={item.client.avatar}
                            alt="Client"
                          />
                          <img
                            className="w-6 h-6 rounded-full"
                            src={item.client.avatar}
                            alt="Client"
                          />
                        </div>
                      </td>
                      <td
                        data-label="Payments"
                        className="py-1 lg:py-1 px-2 lg:px-2 text-center "
                      >
                        <span className="text-dark font-normal">
                          {item.payment}
                        </span>
                      </td>
                      <td
                        data-label="Status"
                        className="py-1 lg:py-1 px-2 lg:px-2 text-center"
                      >
                        <span
                          className={`bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        data-label="City"
                        className="py-1 lg:py-1 px-2 lg:px-2 text-center "
                      >
                        <span className="text-dark font-normal">
                          {item.city}{" "}
                        </span>
                      </td>
                      <td
                        data-label="Number"
                        className="py-1 lg:py-1 px-2 lg:px-2 text-start"
                      >
                        <span className="text-dark font-normal">
                          {item.number}
                        </span>
                      </td>
                      {/* <td data-label="Country" className="py-1 lg:py-1 px-2 w-24 lg:px-2 text-center "> */}
                      {hoverId !== null && hoverId + 1 === item.id ? (
                        <div className="flex  item-center justify-end lg:justify-center bg-gray-300  py-2">
                          <div className="w-5 mr-3 transform hover:text-purple-500 hover:scale-110">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </div>
                          <div className="w-5 mr-3 transform hover:text-purple-500 hover:scale-110">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                          <div className="w-5  transform hover:text-purple-500 hover:scale-110">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <td
                          data-label="Country"
                          className="py-1 lg:py-1 px-2 w-24 lg:px-2 text-center "
                        >
                          <span className="text-dark font-normal">
                            {item.country}
                          </span>
                        </td>
                      )}
                      {/* </td> */}
                      {/* <td data-label="Actions" className="py-1 lg:py-1 px-2 lg:px-2 text-center">
                                                <div className="flex item-center justify-end lg:justify-center">
                                                    <div className="w-5 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="w-5 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </div>
                                                    <div className="w-5  transform hover:text-purple-500 hover:scale-110">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td> */}
                    </tr>

                    {openDropdownIndices.includes(index) && (
                      <tr className="my-1  ">
                        <td className="" colSpan={1}>
                          <div
                            id="Dropdowntable"
                            className="mx-2 me-1 my-2"
                          ></div>
                        </td>
                        <td className="" colSpan={3}>
                          <div id="Dropdowntable" className="mx-2 me-1 my-2">
                            <table className=" ">
                              <thead>
                                <tr>
                                  <th scope="col">Account</th>
                                  <th scope="col">Branch</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Period</th>
                                </tr>
                              </thead>
                              <tbody className="border border-b-0 rounded">
                                <tr>
                                  <td
                                    className="px-2 py-1"
                                    data-label="Account"
                                  >
                                    {item.account} ujjjj
                                  </td>
                                  <td className="px-2 py-1" data-label="Branch">
                                    {item.branch}
                                  </td>
                                  <td className="px-2 py-1" data-label="Amount">
                                    {item.amount}
                                  </td>
                                  <td className="px-2 py-1" data-label="Period">
                                    {item.period}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                        <td className="" colSpan={5}>
                          <div id="Dropdowntable" className=" ms-1 my-2  ">
                            <table className="">
                              <thead>
                                <tr>
                                  <th scope="col">Account</th>
                                  <th scope="col">Due Date</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Period</th>
                                </tr>
                              </thead>
                              <tbody className="border border-b-0 rounded">
                                <tr>
                                  <td
                                    className="px-2 py-1"
                                    data-label="Account"
                                  >
                                    Visa - 3412
                                  </td>
                                  <td
                                    className="px-2 py-1"
                                    data-label="Due Date"
                                  >
                                    04/01/2016
                                  </td>
                                  <td className="px-2 py-1" data-label="Amount">
                                    {item.amount}
                                  </td>
                                  <td className="px-2 py-1" data-label="Period">
                                    {item.period}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER PAGINATION */}
          {/* <PaginationFooter /> */}
        </div>
      </div>
    </div>
  );
};
export default DataList;
