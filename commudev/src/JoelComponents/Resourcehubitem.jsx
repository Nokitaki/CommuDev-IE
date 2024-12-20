//Resourcehub.jsx
import React, { useState } from 'react';
import "../styles/Resourcehubitem.css";

const ResourceHubItem = ({ resource, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(resource.resource_title);
    const [description, setDescription] = useState(resource.resource_description);
    const [heartCount, setHeartCount] = useState(resource.heart_count);

    const handleUpdate = () => {
        onUpdate(resource.resource_id, {
            ...resource,
            resource_title: title,
            resource_description: description,
            heart_count: heartCount,
        });
        setIsEditing(false);
    };

    const handleHeartClick = async () => {
        const updatedHeartCount = heartCount + 1; 
        setHeartCount(updatedHeartCount); 
    
        console.log('Trying to update heart count:', updatedHeartCount);
    
        try {
            
            const response = await fetch(`http://localhost:8080/api/resource/likeResource/${resource.resource_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Successfully updated heart count:', responseData);
               
            } else {
                console.error('Failed to update heart count:', response.statusText);
                
                setHeartCount(heartCount);
            }
        } catch (error) {
            console.error('Error updating heart count:', error);
           
            setHeartCount(heartCount);
        }
    };

    return (
        <div className="resource-hub-item">
            <h3>
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                ) : (
                    title
                )}
            </h3>

            {isEditing ? (
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            ) : (
                <p>{description}</p>
            )}

            <p>Category: {resource.resource_category}</p>
            <p>Uploaded on: {new Date(resource.upload_date).toLocaleString()}</p>

            
            <button className="heart-button" onClick={handleHeartClick}>
                ❤️ {heartCount}
            </button>

            {isEditing ? (
                <button onClick={handleUpdate}>Save</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
            <button onClick={() => onDelete(resource.resource_id)}>Delete</button>
            {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
        </div>
    );
};

export default ResourceHubItem;
