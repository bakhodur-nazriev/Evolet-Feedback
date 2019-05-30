import React, { useState, useEffect } from 'react'
import withStyles from 'react-jss';
import axios from 'axios';

import Card from '../components/Card';
import Comments from '../components/Comments/Comments';

const styles = {
    info: {
        color: '#707070'
    },
    file: {
        width: '100%',
        borderRadius: '5px'
    },
}

function Feedback({ classes, match }) {

    const [feedback, setFeedback] = useState();
    const [comments, setComments] = useState();

    const feedbackId = match.params.id;

    useEffect(() => {
        axios
            .get('/api/feedbacks/' + feedbackId)
            .then(({ data }) => setFeedback(data))
            .catch((e) => console.log(e));

        getComments();
    }, [])

    const getComments = () => {
        axios
            .get('/api/comments?feedback_id=' + feedbackId)
            .then(({ data }) => setComments(data))
            .catch((e) => console.log(e));
    };

    const addComment = (commentBody, parentId = null) => {
        const newComment = {
            body: commentBody,
            employee_id: 1,
            feedback_id: feedback.id,
        };

        if(parentId) 
            newComment['parent_id'] = parentId;
        
        axios
            .post('/api/comments', newComment)
            .then(() => {
                getComments();
            })
            .catch((e) => console.log(e));
    }

    return feedback
        ? (
            <div className='row'>
                <div className="col-8">
                    <Card title='Описание'>
                        {feedback.description}
                    </Card>
                    <Card title='Файлы' className='mt-5'>
                        <div className="row">
                            {
                                feedback.files.map((file, i) => (
                                    <div className="col-3" key={i}>
                                        <div className="row align-items-center">
                                            <div className="col-4">
                                                <img src={file.url} alt={file.name} className={classes.file} />
                                            </div>
                                            <div className="col pl-0">
                                                {file.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </Card>
                    <Comments comments={comments} addCallback={addComment}/>
                </div>
                <div className="col-4 pr-5">
                    <Card title='Информация'>
                        <div className={classes.info}>
                            <p>{'Отправитель: ' + feedback.customer.user.full_name}</p>
                            <p>{'ПК: ' + feedback.customer.pc.name}</p>
                            <p>{'Дата: ' + feedback.created_at}</p>
                            <p style={{ color: feedback.status.color }}>{'Статус: ' + feedback.status.name}</p>
                        </div>
                    </Card>
                </div>
            </div>
        )
        :
        ('Загрузка...');
}

export default withStyles(styles)(Feedback);
