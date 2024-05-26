import React, { useState } from 'react';
import { List, Checkbox, Input, Button, Icon } from 'semantic-ui-react';
import { styles } from '../../stylesComponents.js'

export const RowItem = ({ task, toggleTask, confirmRemove, updatedTask  }) => {

    const [tasksEditing, setTasksEditing] = useState(task.description);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <List.Item key={task.id} style={styles.item}>
            <div style={styles.task}>
                <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} style={styles.checkbox} />
                <div className='description-date'>
                    {isEditing ? (
                        <Input
                            value={tasksEditing}
                            onChange={(e) => setTasksEditing(e.target.value)}
                            onKeyPress={(e) => {
                                if(e.key === 'Enter' && tasksEditing.trim().length > 0){
                                    updatedTask(task.id, tasksEditing.trim());
                                    setIsEditing(false);
                                }
                            }}
                            action={<Button style={styles.save} onClick={() => {
                                if(tasksEditing.trim().length > 0) {
                                    updatedTask(task.id, tasksEditing.trim());
                                    setIsEditing(false);
                                }
                            } }>Save</Button>}
                        />
                    ) : (
                        <>
                            <label className={task.completed ? 'completed-task' : ''}>{task.description}</label>
                            <label className='date'>{task.date}</label>
                        </>
                    )}
                </div>
            </div>
            <div style={styles.icons}>
                <Icon onClick={() => { setIsEditing(!isEditing); }} name='edit outline' style={styles.itemIcon} />
                <Icon onClick={() => confirmRemove(task.id)} name='trash alternate outline' style={styles.itemIcon} />
            </div>
        </List.Item>
    );
};

