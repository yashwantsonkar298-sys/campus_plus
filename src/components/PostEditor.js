import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiClock, FiFileText, FiImage, FiInfo, FiSave, FiSend, FiTag, FiTrash2 } from 'react-icons/fi';
import { categories } from '../data/blogData';
import { getReadingTime } from '../utils/postUtils';
import './PostEditor.css';

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=675&fit=crop',
];

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'Technology',
  tags: '',
  coverImage: '',
};

const toFormData = (post) => post ? {
  title: post.title || '',
  excerpt: post.excerpt || '',
  content: post.content || '',
  author: post.author || '',
  category: post.category || 'Technology',
  tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
  coverImage: post.coverImage || '',
} : EMPTY_FORM;

const readDraft = (key) => {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : null;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const PostEditor = ({ initialPost, mode = 'create', onSubmit, onCancel }) => {
  const baseForm = useMemo(() => toFormData(initialPost), [initialPost]);
  const draftKey = initialPost ? `blog-draft-edit-${initialPost.id}` : 'blog-draft-create';
  const [formData, setFormData] = useState(baseForm);
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState('');

  useEffect(() => {
    const draft = readDraft(draftKey);
    setFormData(draft ? { ...baseForm, ...draft } : baseForm);
    setErrors({});
    setIsReady(true);
  }, [baseForm, draftKey]);

  useEffect(() => {
    if (!isReady) return undefined;
    const hasContent = Object.values(formData).some((value) => String(value).trim());
    if (!hasContent) return undefined;

    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setDraftStatus('Draft saved locally');
      } catch {
        setDraftStatus('Draft storage is unavailable in this browser');
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [draftKey, formData, isReady]);

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
  const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const readingTime = getReadingTime(formData.content);
  const isEditing = mode === 'edit';

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = 'Add a clear headline.';
    if (!formData.author.trim()) nextErrors.author = 'Add the writer name.';
    if (!formData.excerpt.trim()) nextErrors.excerpt = 'Add a concise summary.';
    if (!formData.content.trim()) nextErrors.content = 'Write the body of your story.';
    if (!formData.coverImage.trim()) nextErrors.coverImage = 'Choose a cover image or paste an image URL.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      localStorage.removeItem(draftKey);
    } catch {
      // A saved draft is an enhancement; publishing should not be blocked by storage.
    }

    onSubmit({
      ...formData,
      tags,
      readTime: readingTime,
    });
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Nothing else is required if storage is unavailable.
    }
    setFormData(baseForm);
    setErrors({});
    setDraftStatus('Saved draft discarded');
  };

  const checklist = [
    { label: 'A memorable headline', done: Boolean(formData.title.trim()) },
    { label: 'A reader-focused summary', done: Boolean(formData.excerpt.trim()) },
    { label: 'A cover image', done: Boolean(formData.coverImage.trim()) },
    { label: 'A complete story', done: wordCount >= 20 },
  ];

  return (
    <motion.div
      className="editor-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="editor-heading">
        <div>
          <p className="editor-kicker">{isEditing ? 'Refine your work' : 'Share something useful'}</p>
          <h1>{isEditing ? 'Edit your story' : 'Create a new story'}</h1>
          <p>{isEditing ? 'Polish every detail before readers return to it.' : 'Turn a useful idea into a thoughtful read.'}</p>
        </div>
        <div className="draft-status" aria-live="polite"><FiSave aria-hidden="true" /> {draftStatus || 'Drafts save automatically'}</div>
      </div>

      <div className="editor-layout">
        <form className="editor-form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <div className="form-section-heading"><FiFileText aria-hidden="true" /><div><h2>The essentials</h2><p>Make the first impression count.</p></div></div>

            <div className="form-group">
              <label className="form-label" htmlFor="post-title">Title <span aria-hidden="true">*</span></label>
              <input id="post-title" type="text" value={formData.title} onChange={(event) => setField('title', event.target.value)} placeholder="A clear, specific headline" className={`form-input ${errors.title ? 'error' : ''}`} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />
              {errors.title && <span id="title-error" className="error-text" role="alert">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="post-author">Author <span aria-hidden="true">*</span></label>
                <input id="post-author" type="text" value={formData.author} onChange={(event) => setField('author', event.target.value)} placeholder="Your name" className={`form-input ${errors.author ? 'error' : ''}`} aria-invalid={Boolean(errors.author)} aria-describedby={errors.author ? 'author-error' : undefined} />
                {errors.author && <span id="author-error" className="error-text" role="alert">{errors.author}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="post-category">Category</label>
                <select id="post-category" value={formData.category} onChange={(event) => setField('category', event.target.value)} className="form-select">
                  {categories.filter((category) => category !== 'All').map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="post-excerpt">Short summary <span aria-hidden="true">*</span></label>
              <textarea id="post-excerpt" value={formData.excerpt} onChange={(event) => setField('excerpt', event.target.value)} placeholder="What will a reader gain from this story?" className={`form-textarea form-excerpt ${errors.excerpt ? 'error' : ''}`} rows="3" aria-invalid={Boolean(errors.excerpt)} aria-describedby={errors.excerpt ? 'excerpt-error' : 'excerpt-hint'} />
              <span id="excerpt-hint" className="field-hint">Keep it clear and useful—this appears on article cards.</span>
              {errors.excerpt && <span id="excerpt-error" className="error-text" role="alert">{errors.excerpt}</span>}
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-heading"><FiImage aria-hidden="true" /><div><h2>Cover image</h2><p>Choose a visual that earns the click.</p></div></div>
            <div className="cover-image-grid" role="group" aria-label="Choose a cover image">
              {COVER_IMAGES.map((image, index) => (
                <motion.button type="button" key={image} className={`cover-option ${formData.coverImage === image ? 'selected' : ''}`} onClick={() => setField('coverImage', image)} whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }} aria-label={`Use cover image ${index + 1}`} aria-pressed={formData.coverImage === image}>
                  <img src={image} alt="" />
                  {formData.coverImage === image && <span className="cover-selected-badge"><FiCheck aria-hidden="true" /></span>}
                </motion.button>
              ))}
            </div>
            <div className="form-group custom-image-field">
              <label className="form-label" htmlFor="post-cover-url">Or use your image URL</label>
              <input id="post-cover-url" type="url" value={formData.coverImage} onChange={(event) => setField('coverImage', event.target.value)} placeholder="https://images.example.com/story.jpg" className={`form-input ${errors.coverImage ? 'error' : ''}`} aria-invalid={Boolean(errors.coverImage)} aria-describedby={errors.coverImage ? 'cover-error' : undefined} />
              {errors.coverImage && <span id="cover-error" className="error-text" role="alert">{errors.coverImage}</span>}
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-heading"><FiTag aria-hidden="true" /><div><h2>Story details</h2><p>Use simple markdown: ## headings, - lists, and **bold** text.</p></div></div>
            <div className="form-group">
              <label className="form-label" htmlFor="post-tags">Tags</label>
              <input id="post-tags" type="text" value={formData.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="React, JavaScript, Web development" className="form-input" />
              <span className="field-hint">Separate tags with commas. {tags.length > 0 ? `${tags.length} tag${tags.length === 1 ? '' : 's'} added.` : 'Tags make discovery easier.'}</span>
            </div>
            <div className="form-group">
              <div className="content-label-row"><label className="form-label" htmlFor="post-content">Story <span aria-hidden="true">*</span></label><span className="writing-metrics"><FiClock aria-hidden="true" /> {wordCount} words · {readingTime}</span></div>
              <textarea id="post-content" value={formData.content} onChange={(event) => setField('content', event.target.value)} placeholder="Start with the idea your reader needs to hear..." className={`form-textarea content-area ${errors.content ? 'error' : ''}`} rows="16" aria-invalid={Boolean(errors.content)} aria-describedby={errors.content ? 'content-error' : undefined} />
              {errors.content && <span id="content-error" className="error-text" role="alert">{errors.content}</span>}
            </div>
          </div>

          {Object.keys(errors).length > 0 && <div className="form-alert" role="alert"><FiAlertCircle aria-hidden="true" /> Please complete the highlighted fields before publishing.</div>}

          <div className="form-actions">
            <button type="button" className="discard-draft-btn" onClick={handleDiscardDraft}><FiTrash2 aria-hidden="true" /> Discard saved draft</button>
            <div className="form-actions-main">
              <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
              <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                {isEditing ? <FiSave aria-hidden="true" /> : <FiSend aria-hidden="true" />} {isEditing ? 'Save changes' : 'Publish story'}
              </motion.button>
            </div>
          </div>
        </form>

        <aside className="editor-sidebar">
          <section className="editor-preview" aria-label="Article card preview">
            <p className="preview-label">Live card preview</p>
            <div className="preview-card">
              {formData.coverImage ? <img src={formData.coverImage} alt="Selected cover preview" /> : <div className="preview-placeholder"><FiImage aria-hidden="true" /></div>}
              <div className="preview-card-content">
                <span>{formData.category}</span>
                <h2>{formData.title || 'Your clear headline goes here'}</h2>
                <p>{formData.excerpt || 'A short summary will help readers decide this story is for them.'}</p>
                <div>{tags.slice(0, 3).map((tag) => <small key={tag}>#{tag}</small>)}</div>
              </div>
            </div>
          </section>

          <section className="editor-checklist">
            <p className="preview-label">Ready to publish?</p>
            <h2>A quick quality check</h2>
            <ul>
              {checklist.map((item) => <li key={item.label} className={item.done ? 'done' : ''}><FiCheck aria-hidden="true" /> {item.label}</li>)}
            </ul>
            <p><FiInfo aria-hidden="true" /> Your post is saved in this browser so you can keep refining it.</p>
          </section>
        </aside>
      </div>
    </motion.div>
  );
};

export default PostEditor;
