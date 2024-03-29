import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { UserInfoContext } from "../../App"; // Update the import path based on your project structure
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BlueButton } from "../../components/BlueButton";
import { toast } from "react-toastify";

export default function PrintSetting() {
  // const userInfo = useContext(UserInfoContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("user");
  const token = localStorage.getItem("auth_token");
  const [scpItems, setScpItems] = useState([]);

  const handleAutoSetting = (id) => {
    navigate("auto-setting?id=" + id);
  }

  const handleStop = async (id) => {
    await axios
      .put(
        `http://49.212.185.58:8080/scp-settings/update-item?username=${username}&id=${id}`,
        {
          enabled: false
        }
      )
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        ////console.log(error);
      });
  }

  const handleCSVPrint = async (id) => {
    await axios
      .get(
        `http://49.212.185.58:8080/scp-settings/make-csv?username=${username}&id=${id}`
      )
      .then((response) => response.data)
      .then((data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        console.log(url)
        const link = document.createElement("a");
        link.href = url;
        const fileName = username + "_" + id + "_output.csv"; 
        link.download = fileName || "downloaded-file";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchAll();
  }, [username]);

  async function fetchAll() {
    await axios
      .get("http://49.212.185.58:8080/scp-settings/getall?username=" + username, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setScpItems([...JSON.parse(response.data)]);
        //console.log(scpItems.length);
      })
      .catch((err) => { });
  }

  return (
    <>
      <div className="flex justify-end m-5">
        <Link
          className="bg-gray-800 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-red-700 hover:text-white px-3"
          to={"/"}
        >
          <div className="flex flex-row align-middle">
            <svg
              className="w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p className="ml-2">Prev</p>
          </div>
        </Link>
      </div>
      <div className="m-2 flex items-center justify-center bg-white px-3 md:px-2 z-0">
        <div className="space-y-6 border-l-2 border-dashed flex flex-col w-full">
          {Array.isArray(scpItems) &&
            scpItems.map((item, index) => (
              <div key={index} className="flex flex-row ">
                <div className="w-1/6 flex justify-center items-center">
                  <BlueButton text={item.type == "site" ? "賃貸" : "売買"} />
                </div>
                <div className="flex flex-col w-1/3 justify-center items-center ">
                  <div className="text-left" >{item.mg_title}</div>
                  <div className="text-left">{item.source}</div>
                </div>
                <div className="w-1/6">
                  <BlueButton text={"投稿設定"} onClick={() => handleAutoSetting(scpItems[index]['_id'])} />
                </div>
                <div className="w-1/6">
                  <BlueButton text={"公開停⽌"} onClick={() => handleStop(scpItems[index]['_id'])} />
                </div>
                <div className="w-1/6">
                  <BlueButton text={"CSV出⼒"} onClick={() => handleCSVPrint(scpItems[index]['_id'])} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
