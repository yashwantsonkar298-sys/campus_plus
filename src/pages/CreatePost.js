import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostEditor from '../components/PostEditor';

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = useBlog();

  const handlePublish = (postData) => {
    const newId = addPost(postData);
    navigate(`/post/${newId}`);
  };

  return <PostEditor mode="create" onSubmit={handlePublish} onCancel={() => navigate(-1)} />;
};

export default CreatePost;
