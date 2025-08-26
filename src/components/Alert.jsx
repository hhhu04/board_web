import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from "react";

export const Alert = (param) => {

    const {message, type, callback, showPop, setShowPop} = param;


    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={showPop}>
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>

                <Modal.Footer>
                    {
                        type === 'confirm'?
                            <>
                                <Button variant="secondary" onClick={setShowPop}>취소</Button>
                                <Button variant="primary" onClick={callback}>확인</Button>
                            </>
                            :
                            <>
                                {
                                    callback !== null ?
                                        <Button variant="primary" onClick={callback}>확인</Button>
                                        :
                                        <Button variant="primary" onClick={setShowPop}>확인</Button>
                                }
                            </>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Alert;