// react
import React, { useState, useContext, useEffect } from "react";

// context
import { UserContext } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";

// components
import ConfigurationSection from "./ConfigurationSection";

const CreatePage = ({ roomCode, ownerName, joineeName }) => {
  const { userList, setUserList } = useContext(UserContext);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [finalOwner, setFinalOwner] = useState("");
  const [currentJoineeName, setCurrentJoineeName] = useState("");

  const handleTextMessage = (e) => {
    if (e.target.value.trim() !== "") {
      setTextMessage(e.target.value.trim());
      // console.log(e.target.value.trim());
    }
  };

  const handleEnterSubmit = (e) => {
    if (e.key === "Enter" && textMessage !== "") {
      // console.log(currentJoineeName);
      setTextMessage("");
      socket.emit("getMessage", currentJoineeName, roomCode, textMessage);
    }
  };

  const handleClickSubmit = () => {
    // console.log(currentJoineeName);
    setTextMessage("");
    socket.emit("getMessage", currentJoineeName, roomCode, textMessage);
  };

  const socket = useSocket();

  useEffect(() => {
    // console.log(userList.filter((u) => u["memberRoom"].includes(roomCode)));
    setDisplayUsers(userList.filter((u) => u["memberRoom"].includes(roomCode)));
  }, [userList]);

  useEffect(() => {
    socket.on("roomJoined", (result) => {
      const {
        roomCode: joinedRoomCode,
        userList: resultUserList,
        joineeName,
      } = result;
      if (joinedRoomCode === roomCode) {
        setUserList([...resultUserList]);
        setNotifs((prevNotifs) => [
          ...prevNotifs,
          {
            notifId:
              prevNotifs.length > 0
                ? prevNotifs[prevNotifs.length - 1].notifId + 1
                : 1,
            notifType: "joined",
            notifData: `${joineeName} has joined the room`,
          },
        ]);
      }
    });

    socket.on("roomLeft", (userId, userName) => {
      setNotifs((prevNotifs) => [
        ...prevNotifs,
        {
          notifId:
            prevNotifs.length > 0
              ? prevNotifs[prevNotifs.length - 1].notifId + 1
              : 1,
          notifType: "left",
          notifData: `${userName} has left the room`,
        },
      ]);

      setDisplayUsers((prev) => {
        console.log(prev);
        return prev.filter((u) => u.userId !== userId);
      });
    });

    socket.on("sendMessage", (result) => {
      const { senderRoomCode, message, senderName } = result;

      // console.log("got message");
      // console.log(senderRoomCode);
      // console.log(roomCode);

      if (senderRoomCode === roomCode) {
        setNotifs((prevNotifs) => [
          ...prevNotifs,
          {
            notifId:
              prevNotifs.length > 0
                ? prevNotifs[prevNotifs.length - 1].notifId + 1
                : 1,
            notifType: "message",
            notifData: {
              message,
              senderName,
            },
          },
        ]);
      }
    });

    // set owner name
    if (ownerName.trim() !== "") {
      setFinalOwner(ownerName);
      setCurrentJoineeName(ownerName);
    } else {
      setCurrentJoineeName(joineeName);
    }

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("roomJoined");
      socket.off("roomLeft");
      socket.off("sendMessage");
    };
  }, []);

  const sampleList = [
    "the_maverick007Z",
    "vishal",
    "krishnaveni",
    "ankita",
    "senhashis",
    "abbas",
    "karthick",
    "pankaj",
    "varshaa",
    "shloak",
  ];

  return (
    <div className="w-screen min-h-[30rem] border-1 px-4 border-red-500 grid grid-cols-12 md:space-x-3">
      {/* Left Side - Player List */}
      <div className="bg-lightColor1 col-span-12 pt-4 flex flex-col items-center rounded-md md:col-span-2 dark:bg-darkColor2">
        <div className="bg-lightColor2 h-fit w-full mx-4 py-2 text-center dark:bg-darkColor1">
          <h1 className="text-4xl">Players</h1>
        </div>
        <div className="mt-8 w-full">
          {/* {sampleList.map((user) => {
            return (
              <div className="bg-lightColor2 dark:bg-darkColor1 mb-2 py-1 pl-2">
                <h2>{user}</h2>
              </div>
            );
          })} */}
          {displayUsers && displayUsers.length > 0 ? (
            displayUsers.map((userInRoom) => {
              // console.log("inside map");
              // console.log(displayUsers);
              // console.log(userInRoom);
              return (
                <div
                  key={userInRoom.userId}
                  className="bg-lightColor2 dark:bg-darkColor1 mb-2 py-1 pl-2"
                >
                  <h2>{userInRoom.userName}</h2>
                </div>
              );
            })
          ) : (
            <div className="bg-lightColor2 dark:bg-darkColor1 mb-2 py-1 pl-2">
              <h2>{finalOwner}</h2>
            </div>
          )}
        </div>
      </div>
      {/* Middle - Settings/Canvas  */}
      <ConfigurationSection roomCode={roomCode} />
      {/* Right Side - Chatbox */}
      <div className="bg-lightColor1 col-span-12 pt-4 pb-2 flex flex-col rounded-md md:col-span-2 dark:bg-darkColor2">
        <div className="border-1 flex-1">
          {notifs.map((notif) => {
            switch (notif.notifType) {
              case "joined":
              case "left":
                return (
                  <div
                    key={notif.notifId}
                    className="text-blueColor1 mb-2 py-1 pl-2"
                  >
                    <h2>{notif.notifData}</h2>
                  </div>
                );
              case "message":
                return (
                  <div key={notif.notifId} className="mb-2 py-1 pl-2">
                    <h2>
                      <span className="text-blueColor1">
                        {notif.notifData.senderName}:
                      </span>{" "}
                      {notif.notifData.message}
                    </h2>
                  </div>
                );
              default:
                console.log("INVALID NOTIF TYPE");
            }

            return (
              <div
                key={notif.notifId}
                className="text-blueColor1 mb-2 py-1 pl-2"
              >
                <h2>{notif.notifData}</h2>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between px-1">
          <div className="w-5/6 border-1 border-red-600">
            <input
              value={textMessage}
              onKeyDown={(e) => handleEnterSubmit(e)}
              onChange={(e) => handleTextMessage(e)}
              placeholder="Enter your guess here"
              className="bg-lightColor2 rounded w-full outline-none outline-offset-0 focus:outline-1 focus:outline-blueColor1 placeholder:text-sm pl-2 dark:bg-darkColor1"
              type="text"
            />
          </div>
          <button
            onClick={handleClickSubmit}
            className="bg-lightColor2 hover:bg-lightColor1 border-1 px-1 border-green-500 rounded dark:bg-darkColor1 dark:hover:bg-darkColor2"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
