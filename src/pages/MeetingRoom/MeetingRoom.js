import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../providers/SocketProvider"
import ReactPlayer from 'react-player'
import peer from '../../service/peer'
const MeetingRoom=()=>{
    const socket =useSocket();
    const [remoteSocketId,setRemoteSocketId]=useState()
    const [mystream,setMyStream]=useState()
    const [remoteStream,setRemoteStream]=useState()
    const handleJoinUser=useCallback(({email,id})=>{
        setRemoteSocketId(id)
    },[])
    const handleNegoneededFinal=useCallback(async({ans})=>{
        await peer.setLocalDescription(ans)
    },[])
    const handleCallUser=useCallback(async()=>{
        const stream= await navigator.mediaDevices.getUserMedia({'video':true,'audio':true})
        const offer=await peer.getOffer()
        console.log("id",remoteSocketId)
        socket.emit("user-call", {remoteSocketId, offer });        
        setMyStream(stream)
    },[remoteSocketId])
    const handleIncoming=useCallback(async({from,offer})=>{
        setRemoteSocketId(from)
        const stream= await navigator.mediaDevices.getUserMedia({'video':true,'audio':true})
        setMyStream(stream)
        console.log(from,offer)
        const ans=await peer.getAnswer(offer)
        socket.emit("call-accepted",{to:from,ans})
    },[socket])
    const sendStreams = useCallback(() => {
        for (const track of mystream.getTracks()) {
            let sender = peer.peer.getSenders().find(sender => sender.track === track);
            if (!sender) {
                peer.peer.addTrack(track, mystream);
        }
    }
      }, [mystream]);
    
    const handleCallAccept=useCallback(({from,ans})=>{
        peer.setLocalDescription(ans)
        console.log("call accepted!!")
        sendStreams()
    },[mystream])
    const handleNegoNeeded=useCallback(async()=>{
        const offer=await peer.getOffer()
        socket.emit("peer-nego-needed",{offer,to:remoteSocketId})
    },
  
    [remoteSocketId,socket])
    const handleNegoIncoming=useCallback(async({from,offer})=>{
        const ans=await peer.getAnswer()
        socket.emit("nego-need-done",({to:from,ans}))

    },[socket])
    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegoNeeded)
        return()=>{
            peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded)
        }
    },[handleNegoNeeded])
    useEffect(()=>{
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream =  ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
          });
    },[])
    useEffect(()=>{
        socket.on("user-joined",handleJoinUser)
        socket.on("incoming-call",handleIncoming)
        socket.on("call-accepted",handleCallAccept)
        socket.on("negotiationneeded",handleNegoIncoming)
        socket.on("peer-nego-final",handleNegoneededFinal)
        return()=>{
            socket.off("user-joined",handleJoinUser)
            socket.off("incoming-call",handleIncoming)
            socket.off("call-accepted",handleCallAccept)
            socket.off("negotiationneeded",handleNegoIncoming)
            socket.off("peer-nego-final",handleNegoneededFinal)

        }

    },[socket,handleJoinUser,handleIncoming,handleCallAccept,handleNegoIncoming,handleNegoneededFinal])
    return(<>
        <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {mystream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {mystream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={mystream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
    </>
    
)
}

export default MeetingRoom