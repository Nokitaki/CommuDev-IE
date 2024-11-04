import React, { useEffect, useState } from 'react';
import Resourcehubitem from './Resourcehubitem';
import '../styles/Resourcehub.css'; // Import the CSS file

const ResourceHub = () => {
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({
        resource_title: '',
        resource_description: '',
        resource_category: '',
        heart_count: 0,
    });

    const fetchResources = async () => {
        const response = await fetch('http://localhost:8080/api/resource/getAllResourceDetails');
        const data = await response.json();
        setResources(data);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleAddResource = async () => {
        const currentDate = new Date().toISOString(); // Get the current date in ISO format
        const resourceToAdd = {
            ...newResource,
            upload_date: currentDate, // Add the upload date
        };

        const response = await fetch('http://localhost:8080/api/resource/addResourceDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resourceToAdd),
        });

        if (response.ok) {
            // Reset the newResource state
            setNewResource({ resource_title: '', resource_description: '', resource_category: '', heart_count: 0 });
            fetchResources(); // Refresh the resource list
        }
    };

    const handleUpdateResource = async (resource_id, updatedResource) => {
        const response = await fetch('http://localhost:8080/api/resource/updateResourceDetails', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedResource),
        });

        if (response.ok) {
            fetchResources(); // Refresh the resource list
        }
    };

    const handleDeleteResource = async (resource_id) => {
        const response = await fetch(`http://localhost:8080/api/resource/deleteResource/${resource_id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchResources(); // Refresh the resource list
        }
    };

    return (
        <div className="resource-hub">
            <h1>Resource Hub</h1>
            <form>
                <input
                    type="text"
                    placeholder="Resource Title"
                    value={newResource.resource_title}
                    onChange={(e) => setNewResource({ ...newResource, resource_title: e.target.value })}
                />
                <textarea
                    placeholder="Resource Description"
                    value={newResource.resource_description}
                    onChange={(e) => setNewResource({ ...newResource, resource_description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newResource.resource_category}
                    onChange={(e) => setNewResource({ ...newResource, resource_category: e.target.value })}
                />
                <button type="button" onClick={handleAddResource}>Add Resource</button>
            </form>

            {resources.map(resource => (
                <Resourcehubitem
                    key={resource.resource_id}
                    resource={resource}
                    onDelete={handleDeleteResource}
                    onUpdate={handleUpdateResource}
                />
            ))}
        </div>
    );
};

export default ResourceHub;
