import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import EmptyState from '../components/EmptyState';
import PostEditor from '../components/PostEditor';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, updatePost } = useBlog();
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return (
      <div className="editor-page">
        <EmptyState
          icon="📄"
          title="Post not found"
          message="The post you are trying to edit does not exist."
          action={<Link to="/" className="empty-action-btn">Back to home</Link>}
        />
      </div>
    );
  }

  const handleSave = (postData) => {
    updatePost(id, postData);
    navigate(`/post/${id}`);
  };

  return <PostEditor initialPost={post} mode="edit" onSubmit={handleSave} onCancel={() => navigate(-1)} />;
};

export default EditPost;
