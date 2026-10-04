import { Resource, ResourceProps, resourceTypeNames, resourceTypes } from "@/lib/curriculum"
import CurriculumVideoResource from "./resources/video";
import CurriculumSlideshowResource from "./resources/slideshow";
import { Modal } from "../modal";
import { closeModal, openModal } from "@/lib/modal";
import { useState } from "react";
import Dropdown from "../dropdown";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const resourceElements = {
    video: CurriculumVideoResource,
    slideshow: CurriculumSlideshowResource
};

export default function CurriculumResource({
    resource
}: ResourceProps) {
    const [resourceType, setResourceType] = useState(String(resource.type ?? 'video'));
    const ResourceEle = (resourceElements as Record<string, any>)[resourceType] ?? 'div';
    const _modalId = `${resource.id}-resource-modal`;
    const viewModalId = `view-${_modalId}`;
    const editModalId = `edit-${_modalId}`;
    const resourceTypeId = `${resource.id}-resource-type`;

    return (
        <div className="resource-container">
            {/* <ResourceEle resource={resource} /> */}
            <div className='resource-top'>
                <h2 className='resource-title font-medium'>{resource.name}</h2>
                <button 
                    className="pww-button button-green button-small"
                    onClick={(e) => openModal(editModalId)}
                >Edit</button>
                <button 
                    className="pww-button button-blue button-small"
                    onClick={(e) => openModal(viewModalId)}
                >View</button>
            </div>
            <div className='resource-desc'>{resource?.description}</div>
            <Modal modalId={viewModalId}>
                <ResourceEle resource={resource} />
                <a
                    className="go-resource link-button"
                    target="_blank"
                    href={resource.link}
                >Open in new tab ↗</a>
            </Modal>
            <Modal modalId={editModalId}>
                <div className="edit-resource-container">
                    <h2 className="font-title edit-resource-header">Edit {resource.name}</h2>
                    <form className="edit-resource-form" onSubmit={async (e) => {
                        e.preventDefault();
                        if (!resource.ref) {
                            console.error('No ref attached to resource');
                            alert('An error occured.');
                            return;
                        }
                        // code
                        const resourceName = (document.querySelector('#resourceName') as HTMLInputElement).value;
                        const resourceDesc = (document.querySelector('#resourceDesc') as HTMLInputElement).value;
                        const resourceLink = (document.querySelector('#resourceLink') as HTMLInputElement).value;

                        const newResource: Resource = {
                            id: resource.id,
                            name: resourceName,
                            link: resourceLink,
                            type: resource.type,
                            description: resourceDesc
                        };

                        const rDoc = await getDoc(doc(db, ...resource.ref));
                        const resources: Resource[] = rDoc.data()?.resources;
                        if (!resources) {
                            console.error(`Could't find resources from ref ${resource.ref}.`);
                            return;
                        }

                        const rIndex = resources.findIndex(r => r.id === resource.id);
                        resources[rIndex] = newResource;
                        
                        closeModal();
                        await updateDoc(doc(db, ...resource.ref), { resources });
                    }}>
                        <div>
                            <label htmlFor="resourceName">Resource Name</label>
                            <input 
                                type="text" 
                                id="resourceName" 
                                className="pww-input form-input" 
                                defaultValue={resource.name} 
                            />
                        </div>
                        <div>
                            <label htmlFor="resourceLink">Resource Link</label>
                            <div>
                                <input 
                                    type="text" 
                                    id="resourceLink" 
                                    className="pww-input form-input" 
                                    defaultValue={resource.link} 
                                />
                                <a
                                    className="go-resource link-button"
                                    target="_blank"
                                    href={resource.link}
                                >↗</a>
                            </div>
                        </div>
                        <div>
                            <label htmlFor={resourceTypeId}>Resource Type</label>
                            <Dropdown
                                id={resourceTypeId}
                                name="resourceType"
                                className="pww-select form-select"
                                value={resourceType}
                                onChange={setResourceType}
                                options={resourceTypes.map((type) => ({
                                    value: type,
                                    label: resourceTypeNames[type]
                                }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="resourceDesc">Description</label>
                            <input 
                                type="text" 
                                id="resourceDesc" 
                                className="pww-input form-input" 
                                defaultValue={resource.description} 
                            />
                        </div>
                        <button type="submit" className="pww-button button-green button-small resource-save-button">Save Changes</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}