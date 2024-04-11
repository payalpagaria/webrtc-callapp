import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useSocket } from '../../providers/SocketProvider';
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
    const [email,setEmail]=useState()
    const [roomId,setRoomId]=useState()
    const socket=useSocket()
    const navigate=useNavigate()
    const handlJoinRoom=useCallback((data)=>{
       const {email,roomId}=data
       navigate(`/meetingroom/${roomId}`)
    },[])
    const handlSubmit=useCallback((e)=>{
        e.preventDefault()
        socket.emit("join-room",{email,roomId})
    },
[email,roomId,socket])
useEffect(()=>{
    socket.on("join-room",handlJoinRoom)
    return()=>{
        socket.off("join-room",handlJoinRoom)
    }
},[socket,handlJoinRoom])
    return (
        <Container style={{ height: '100vh' }} >
            <Row className="justify-content-center align-items-center" style={{ height: '100%' }}>
                <Col md={5}>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label >Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e)=> setEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="formJoinRoom">
                            <Form.Label>Join Room</Form.Label>
                            <Form.Control type="text" placeholder="Enter room code"  onChange={(e)=> setRoomId(e.target.value)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mt-5" onClick={handlSubmit}>
                            Join Room
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default JoinRoom;
