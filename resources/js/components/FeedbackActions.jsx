import React, { useState, useEffect } from "react";
import withStyles from "react-jss";
import { Modal } from "react-bootstrap";
import axios from "axios";

import Card from "./Card";
import { ApiRoutes } from "../routes";
import Loading from "./Loading";

const styles = {
    actionButton: {
        borderRadius: "50px",
        padding: ".5em",
        color: "white",
        display: "block",
        width: "100%",
        cursor: "pointer",
        "&:hover": {
            color: "white"
        }
    },
    acceptActionButton: {
        background: "#30D92A",
        borderColor: "#30D92A",
        "&:focus": {
            boxShadow: "0 0 0 0.2rem #30da2a4a"
        }
    },
    denyActionButton: {
        background: "#EB552F",
        borderColor: "#EB552F",
        "&:focus": {
            boxShadow: "0 0 0 0.2rem #eb542f4a"
        }
    }
};

const PENDING_STATUS_ID = 1;
const ACCEPT_STATUS_ID = 2;
const DENY_STATUS_ID = 3;

function FeedbackActions({ classes, feedback, reloadFeedbackCallBack }) {
    const {
        feedbackResponses: responseRoute,
        feedbacks: feedbacksRoute
    } = ApiRoutes;

    const [modal, setModal] = useState({ show: false, status: null });
    const [message, setMessage] = useState();
    const [feedbackResponse, setFeedbackResponse] = useState();
    const [sendingData, setSendingData] = useState(false);

    const getFeedbackResponse = () => {
        axios
            .get(`${responseRoute}?feedback_id=${feedback.id}`)
            .then(({ data }) => setFeedbackResponse(data[0]))
            .catch(e => console.log(e));
    };

    useEffect(() => {
        getFeedbackResponse();
    }, []);

    const { id: statusId } = feedback.status;

    const hideModal = () => {
        setMessage("");
        setModal({ show: false, status: modal.status });
    };

    const getModalActionClasses = (modalStatus = null) => {
        let jssClass = classes.actionButton;

        switch (modalStatus) {
            case ACCEPT_STATUS_ID:
                jssClass += ` ${classes.acceptActionButton} `;
                break;
            case DENY_STATUS_ID:
                jssClass += ` ${classes.denyActionButton} `;
        }

        return jssClass;
    };
    const getModalActionText = (modalStatus = null) => {
        let text = "Отмена";

        switch (modalStatus) {
            case ACCEPT_STATUS_ID:
                text = "Принять";
                break;
            case DENY_STATUS_ID:
                text = "Отклонить";
                break;
        }
        return text;
    };
    const updateFeedbackStatus = statusId => {
        const newStatus = { status_id: statusId };
        const newResponse = {
            body: message,
            feedback_id: feedback.id
        };

        setSendingData(true);

        axios.put(`${feedbacksRoute}/${feedback.id}`, newStatus).then(() => {
            axios.post(responseRoute, newResponse).then(() => {
                setSendingData(false);

                reloadFeedbackCallBack();
                getFeedbackResponse();
                hideModal();
            });
        });
    };

    const onResponseFormSubmit = e => {
        e.preventDefault();
        updateFeedbackStatus(modal.status);
    };

    const feedbackStatusInfo = feedbackResponse ? (
        <div
            className={`alert ${
                statusId === ACCEPT_STATUS_ID ? "alert-success" : "alert-danger"
            } `}
            role="alert"
        >
            {"Статус фидбека был изменен сотрудником: "}
            <b>{feedbackResponse.employee.user.full_name}</b>
            {" в "}
            <b>{feedbackResponse.updated_at}</b>
        </div>
    ) : null;

    return (
        <React.Fragment>
            {statusId === PENDING_STATUS_ID ? (
                <div className="row justify-content-center mb-4">
                    <div className="col-xs-6 col-xl-5 mb-2">
                        <button
                            className={`btn ${getModalActionClasses(
                                ACCEPT_STATUS_ID
                            )}`}
                            onClick={() =>
                                setModal({
                                    show: true,
                                    status: ACCEPT_STATUS_ID
                                })
                            }
                        >
                            {getModalActionText(ACCEPT_STATUS_ID)}
                        </button>
                    </div>
                    <div className="col-xs-6 col-xl-5 mb-2">
                        <button
                            className={`btn ${getModalActionClasses(
                                DENY_STATUS_ID
                            )}`}
                            onClick={() =>
                                setModal({ show: true, status: DENY_STATUS_ID })
                            }
                        >
                            {getModalActionText(DENY_STATUS_ID)}
                        </button>
                    </div>
                </div>
            ) : feedbackResponse ? (
                feedbackStatusInfo
            ) : null}
            <Modal show={modal.show} onHide={() => hideModal()} centered>
                <Card title="Сообщение отправителю" noMargin>
                    <div>
                        <form
                            onSubmit={onResponseFormSubmit}
                        >
                            <div className="mb-3">
                                {!sendingData ? (
                                    <textarea
                                        className="form-control mb-3"
                                        rows={4}
                                        placeholder="Сообщение"
                                        required
                                        value={message}
                                        onChange={({ target }) =>
                                            setMessage(target.value)
                                        }
                                    />
                                ) : (
                                    <Loading />
                                )}
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-7">
                                    <div className="row">
                                        <div className="col-6 mb-2 mb-xl-0">
                                            <button
                                                type="button"
                                                className={`btn btn-primary ${getModalActionClasses()}`}
                                                onClick={() => hideModal()}
                                            >
                                                {getModalActionText()}
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                type="submit"
                                                className={`btn ${
                                                    classes.actionButton
                                                } ${getModalActionClasses(
                                                    modal.status
                                                )}`}
                                            >
                                                {getModalActionText(
                                                    modal.status
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Card>
            </Modal>
        </React.Fragment>
    );
}
export default withStyles(styles)(FeedbackActions);
