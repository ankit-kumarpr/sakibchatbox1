import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaPlus, FaTrash, FaUserPlus, FaUserMinus, FaCheck, FaComments } from 'react-icons/fa';
import Base_url from '../config';
import '../Admin/ViewGroups.css';

const Groups = () => {
    const token = sessionStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: '',
        discription: ''
    });
    const [actionType, setActionType] = useState('add'); // 'add' or 'remove'

    useEffect(() => {
        Getgroups();
        GetAllUsers();
    }, []);

    const Getgroups = async () => {
        try {
            setLoading(true);
            const url = `${Base_url}/groups/getgroup`;
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(url, { headers });
            setGroups(response.data.groups || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const GetAllUsers = async () => {
        try {
            const url = `${Base_url}/auth/getusers`;
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(url, { headers });
            setAllUsers(response.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const CreateGroup = async () => {
        try {
            const url = `${Base_url}/groups/create`;
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            await axios.post(url, newGroup, { headers });
            setShowCreateModal(false);
            setNewGroup({ name: '', discription: '' });
            Getgroups();
        } catch (error) {
            console.log(error);
        }
    };

    const AddUsersToGroup = async () => {
        try {
            const url = `${Base_url}/groups/add-users`;
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            const requestBody = {
                groupId: currentGroup._id,
                userIds: selectedUsers
            };
            await axios.post(url, requestBody, { headers });
            setShowUserManagement(false);
            setSelectedUsers([]);
            Getgroups();
        } catch (error) {
            console.log(error);
        }
    };

    const RemoveUsersFromGroup = async () => {
        try {
            const url = `${Base_url}/groups/remove-users`;
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            const requestBody = {
                groupId: currentGroup._id,
                userIds: selectedUsers
            };
            await axios.post(url, requestBody, { headers });
            setShowUserManagement(false);
            setSelectedUsers([]);
            Getgroups();
        } catch (error) {
            console.log(error);
        }
    };

    const toggleGroupExpand = (groupId) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId);
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    const openAddUsersModal = (group) => {
        setCurrentGroup(group);
        setActionType('add');
        setSelectedUsers([]);
        setShowUserManagement(true);
    };

    const openRemoveUsersModal = (group) => {
        setCurrentGroup(group);
        setActionType('remove');
        setSelectedUsers([]);
        setShowUserManagement(true);
    };

    const handleJoinChat = (groupId) => {
        console.log("Joining group chat with ID:", groupId);
        navigate(`/group-chat/${groupId}`);
    };

    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filter users based on action type (add/remove)
    const getFilteredUsers = () => {
        if (actionType === 'add') {
            // Show users not already in the group
            return allUsers.filter(user => 
                !currentGroup?.users?.some(u => u._id === user._id)
            );
        } else {
            // Show only users in the group
            return allUsers.filter(user => 
                currentGroup?.users?.some(u => u._id === user._id)
            );
        }
    };

    return (
        <div className="groups-container">
            {/* Header */}
            <div className="groups-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                </button>
                <h2>Group Management</h2>
                <button 
                    className="add-group-button"
                    onClick={() => setShowCreateModal(true)}
                >
                    <FaPlus size={20} />
                </button>
            </div>

            {/* Search */}
            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <FaTimes 
                        className="clear-search" 
                        onClick={() => setSearchTerm('')} 
                    />
                )}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="groups-list">
                    <h3>All Groups ({filteredGroups.length})</h3>
                    {filteredGroups.length > 0 ? (
                        <ul>
                            {filteredGroups.map((group) => (
                                <li key={group._id} className="group-item">
                                    <div 
                                        className="group-summary"
                                        onClick={() => toggleGroupExpand(group._id)}
                                    >
                                        <div className="group-avatar">
                                            <FaUsers size={20} />
                                        </div>
                                        <div className="group-info">
                                            <div className="group-name-row">
                                                <span className="group-name">{group.name}</span>
                                                <span className="member-count">
                                                    {group.users?.length || 0} members
                                                    {expandedGroup === group._id ? (
                                                        <FaChevronUp className="expand-icon" />
                                                    ) : (
                                                        <FaChevronDown className="expand-icon" />
                                                    )}
                                                </span>
                                            </div>
                                            <div className="group-meta">
                                                <span className="created-date">Created: {formatDate(group.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedGroup === group._id && (
                                        <div className="group-members">
                                            <div className="member-actions">
                                                <button 
                                                    className="chat-btn"
                                                    onClick={() => handleJoinChat(group._id)}
                                                >
                                                    <FaComments /> Join Chat
                                                </button>
                                                <button 
                                                    className="action-btn add"
                                                    onClick={() => openAddUsersModal(group)}
                                                >
                                                    <FaUserPlus /> Add Users
                                                </button>
                                                {group.users?.length > 0 && (
                                                    <button 
                                                        className="action-btn remove"
                                                        onClick={() => openRemoveUsersModal(group)}
                                                    >
                                                        <FaUserMinus /> Remove Users
                                                    </button>
                                                )}
                                            </div>
                                            <h4>Members</h4>
                                            <ul className="members-list">
                                                {group.users?.map((user) => (
                                                    <li key={user._id} className="member-item">
                                                        <div className="member-avatar">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="member-info">
                                                            <span className="member-name">{user.name}</span>
                                                            <span className="member-id">{user.specialId || 'No ID'}</span>
                                                        </div>
                                                        <div className="member-role">
                                                            {user.role}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-groups">
                            <FaUsers size={40} />
                            <p>No groups found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Group</h3>
                        <div className="form-group">
                            <label>Group Name</label>
                            <input
                                type="text"
                                value={newGroup.name}
                                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                placeholder="Enter group name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <input
                                type="text"
                                value={newGroup.discription}
                                onChange={(e) => setNewGroup({...newGroup, discription: e.target.value})}
                                placeholder="Enter description"
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button className="create-btn" onClick={CreateGroup}>
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Management Modal */}
            {showUserManagement && (
                <div className="modal-overlay">
                    <div className="modal-content user-management">
                        <h3>{actionType === 'add' ? 'Add Users to' : 'Remove Users from'} {currentGroup?.name}</h3>
                        
                        <div className="user-list-container">
                            <ul className="user-list-scroll">
                                {getFilteredUsers().map(user => (
                                    <li 
                                        key={user._id} 
                                        className={`user-select-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                                        onClick={() => toggleUserSelection(user._id)}
                                    >
                                        <div className="user-avatar">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-id">{user.specialId || 'No ID'}</span>
                                        </div>
                                        {selectedUsers.includes(user._id) && (
                                            <div className="check-mark">
                                                <FaCheck />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="selected-count">
                            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowUserManagement(false)}>
                                Cancel
                            </button>
                            <button 
                                className={actionType === 'add' ? 'add-btn' : 'remove-btn'} 
                                onClick={actionType === 'add' ? AddUsersToGroup : RemoveUsersFromGroup}
                                disabled={selectedUsers.length === 0}
                            >
                                {actionType === 'add' ? (
                                    <><FaUserPlus /> Add Selected</>
                                ) : (
                                    <><FaTrash /> Remove Selected</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;