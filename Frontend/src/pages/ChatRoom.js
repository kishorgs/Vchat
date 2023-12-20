

import React, { useState, useEffect, useContext } from "react";
import "../css/ChatRoom.css";
import {
  FaUserAlt,
  FaMicrophone,
  FaVideo,
  FaVideoSlash,
  FaCopy,
} from "react-icons/fa";
import { MdCallEnd, MdMessage } from "react-icons/md";
import { FaMicrophoneSlash } from "react-icons/fa6";
import Message from "../components/Message";
import Users from "../components/Users";
import MessageBox from "../components/MessageBox";
import { useSocket } from "../context/SocketProvider";
import chatContext from "../context/context";
import VideoPlayer from "../components/VideoPlayer";
import Alert from "../components/Alert";

function ChatRoom() {

  const Socket = useSocket();

  let roomname;

  const [muted, setMuted] = useState(true);
  const [video, setVideo] = useState(true);

  const context = useContext(chatContext);
  const { setRecivedMessage, recivedMessage, roomId } = context;

  const [user, setUsers] = useState([{ username: "", stream: "" }]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("data", data);
      setRecivedMessage((prevMessages) => [
        ...prevMessages,
        {
          username: data.name,
          message: data.message,
          type: "recived-msg",
        },
      ]);
    };

    const handleNewUser = (data) => {
      console.log("New User Joined", data);
      setUsers((prevUsers) => [
        ...prevUsers,
        { username: data.username, stream: data.stream },
      ]);
    };

    const handleOtherUsers = (data) => {
      setUsers(data);

      data.forEach((element) => {
        createConnection(element.socketId);
        console.log(element.socketId);
      });
    };

    Socket.on("reciveMessage", handleReceiveMessage);
    Socket.on("newuser", handleNewUser);
    Socket.on("otheruserslist", handleOtherUsers);

    return () => {
      Socket.off("reciveMessage", handleReceiveMessage);
      Socket.off("newuser", handleNewUser);
      Socket.off("otheruserslist", handleOtherUsers);
    };
  }, [Socket, setRecivedMessage]);

  const iceConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
  };

  const updateMediaSenders = (track, rtpSenders) => {
    for (var conId in userConnection) {
      var connection = userConnection[conId];
      if (
        connection &&
        (connection.connectionState === "new" ||
          connection.connectionState === "connecting" ||
          connection.connectionState === "connected")
      ) {
        if (rtpSenders[conId] && rtpSenders[conId].track) {
          rtpSenders[conId].replaceTrack(track);
        } else {
          rtpSenders[conId] = userConnection[conId].addTrack(track);
        }
      }
    }
  };

  const sdpExchange = (data, connectionId) => {
    Socket.emit("sdpExchange", {
      data: data,
      connectionId: connectionId,
    });
  };

  Socket.on("sdpExchange", async (data) => {
    const message = JSON.parse(data.data);

    if (message.answer) {
      await userConnection[data.fromConnId].setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    } else if (message.offer) {
      if (!userConnection[data.fromConnId]) {
        await createConnection(data.fromConnId);
      }

      await userConnection[data.fromConnId].setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );
      var answer = await userConnection[data.fromConnId].createAnswer();

      await userConnection[data.fromConnId].setLocalDescription(answer);
      sdpExchange(
        JSON.stringify({
          answer: answer,
        }),
        data.fromConnId
      );
    } else if (message.iceCandidate) {
      if (!userConnection[data.fromConnId]) {
        await createConnection(data.fromConnId);
      }
      try {
        await userConnection[data.fromConnId].addIceCandidate(
          message.iceCandidate
        );
      } catch (error) {
        console.log(error);
      }
    }
  });

  const remoteStream = [];
  const audioStream = [];

  const userConnectionId = [];
  const userConnection = [];

  const rtpVideoSender = [];

  const createOffer = async (connId) => {
    const connection = userConnection[connId];
    const offer = await connection.createOffer();

    connection.setLocalDescription(offer);

    sdpExchange(
      JSON.stringify({
        offer: connection.localDescription,
      }),
      connId
    );
  };

  const createConnection = async (connectionId) => {
    var connect = new RTCPeerConnection(iceConfiguration);

    connect.onicecandidate = (event) => {
      if (event.candidate) {
        sdpExchange(
          JSON.stringify({
            iceCandidate: event.candidate,
          }),
          connectionId
        );
      }
    };

    connect.onnegotiationneeded = async (event) => {
      await createOffer(connectionId);
    };

    connect.ontrack = (event) => {
      if (!remoteStream[connectionId]) {
        remoteStream[connectionId] = new MediaStream();
      }

      if (!audioStream[connectionId]) {
        audioStream[connectionId] = new MediaStream();
      }

      if (event.track.kind === "video") {
        remoteStream[connectionId].getTracks().forEach((element) => {
          remoteStream[connectionId].removeTrack(element);
        });
        remoteStream[connectionId].addTrack(event.track);
        var remotevideo = document.getElementById(connectionId);
        remotevideo.srcObject = null;
        remotevideo.srcObject = remoteStream[connectionId];
        remotevideo.load();
      }
    };

    userConnectionId[connectionId] = connectionId;
    userConnection[connectionId] = connect;
    updateMediaSenders(mediaStream, rtpVideoSender);

    return connect;
  };

  useEffect(() => {
    Socket.emit("otherusers", { roomId: roomId, socketId: Socket.id });

    return () => {
      Socket.off("otherusers");
    };
  }, [Socket, roomId]);

  var mediaStream;
  let localstream = document.getElementById("localstream");
  const getMedia = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: muted,
      });
      localstream.srcObject = mediaStream;
      updateMediaSenders(mediaStream, rtpVideoSender);
    } catch (error) {
      console.log(error);
    }
  };

  getMedia();

  const [msgClick, setMsgClick] = useState(false);
  const [userClick, setUserClick] = useState(false);
  const [videoClick, setVideoClick] = useState(true);
  const [audioClick, setAudioClick] = useState(true);

  const msgHandleClick = (e) => {
    setMsgClick(!msgClick);
    setUserClick(false);
  };

  const userHandleClick = (e) => {
    setUserClick(!userClick);
    setMsgClick(false);
  };

  const videoHandleClick = (e) => {
    setVideoClick(!videoClick);
    document.getElementById("cam").classList.toggle("active");
    setVideo(!video);
  };

  const audioHandleClick = (e) => {
    setAudioClick(!audioClick);
    document.getElementById("mic").classList.toggle("active");
    setMuted(!muted);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(roomId);
    showAlert("Room Id copied to clipboard !!!", "info");
  };

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };


  console.log("Audio :",muted,"\n","Video:",video)

  return (
    <div className="chat-screen">
      <div className="user-screen">
        <div className="video-screen">
          
          <VideoPlayer username="you" user_id="localstream" className="video-layout"/>
          </div>
          {user.map((data) =>
            data.username !== "" && data.stream !== "" ? (
              <VideoPlayer username={data.username} />
            ) : null
          )}

        <div className="video-footer">
          <div className="details">
            <h2>Room Name : {roomname}</h2>
            <h2>
              Room Id : {roomId}{" "}
              <span onClick={handleCopy} className="copy-icon">
                <FaCopy />
              </span>
            </h2>
          </div>

          <div className="btn-grp">
            <button className="end-btn">
              <MdCallEnd />
            </button>
            <button onClick={userHandleClick} className="user-btn">
              <FaUserAlt />
            </button>
            <button onClick={msgHandleClick} className="msg-btn">
              <MdMessage />
            </button>
            <button onClick={audioHandleClick} id="mic" className="msg-btn">
              {audioClick ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button onClick={videoHandleClick} id="cam" className="msg-btn">
              {videoClick ? <FaVideo /> : <FaVideoSlash />}
            </button>
          </div>
        </div>
      </div>
      <div id="chat-box" className="chat-box">
        <div className="chat-body">
          {userClick && <Users />}
          {msgClick &&
            recivedMessage.map((data, index) => {
              return (
                <MessageBox
                  key={index}
                  username={data.username}
                  message={data.message}
                  type={data.type}
                />
              );
            })}
        </div>
        <div className="chat-bottom">{msgClick && <Message />}</div>
      </div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => {
            setAlert(null);
          }}
        />
      )}
    </div>
  );
}

export default ChatRoom;
