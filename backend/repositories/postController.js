const db = require('../utils');

exports.getAllPosts = async (req, res) => {
  try {
    const postsResult = await db.query('SELECT * FROM post');
    return res.status(200).json(postsResult.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.getAllPostsWithComments = async (req, res) => {
  try {
    // Fetch all posts
    const postsResult = await db.query(`
      SELECT
        p.*,
        au.id AS author_id,
        au.first_name AS f_name,
        au.last_name AS l_name
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
    `);

    const posts = postsResult.rows;

    // Fetch comments for all posts
    const commentsResult = await db.query(`
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.modified_at,
        au.id,
        au.first_name,
        au.last_name,
        c.post_id
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
    `);

    const comments = commentsResult.rows;

    // Group comments by post_id
    const commentsByPostId = {};
    comments.forEach((comment) => {
      if (!commentsByPostId[comment.post_id]) {
        commentsByPostId[comment.post_id] = [];
      }
      commentsByPostId[comment.post_id].push(comment);
    });

    // Combine posts and comments
    const response = posts.map((post) => ({
      ...post,
      comments: commentsByPostId[post.id] || [],
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts and comments' });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch the post data
    const postResult = await db.query(
      `
      SELECT
        p.*,
        au.id,
        au.first_name,
        au.last_name
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      WHERE p.id = $1
    `,
      [postId]
    );
    const post = postResult.rows[0];

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch the comments for the post
    const commentsResult = await db.query(
      `
      SELECT
        c.*,
        au.first_name,
        au.last_name
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
      WHERE c.post_id = $1
    `,
      [postId]
    );

    const comments = commentsResult.rows;

    // Combine the post and comments
    const response = {
      ...post,
      comments,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post and comments' });
  }
};

exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch posts created by user
    const postsResult = await db.query(
      `
      SELECT
        p.*,
        au.id AS author_id,
        au.first_name,
        au.last_name
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      WHERE p.app_user_id = $1
    `,
      [userId]
    );

    const posts = postsResult.rows;

    // Fetch comments for the posts
    const postIds = posts.map((post) => post.id);
    console.log('postIds', postIds);
    const commentsResult = await db.query(
      `
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.modified_at,
        au.id,
        au.first_name,
        au.last_name,
        c.post_id
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
      WHERE c.post_id = ANY($1)
    `,
      [postIds]
    );

    const comments = commentsResult.rows;

    // Group comments by post_id
    const commentsByPostId = {};
    comments.forEach((comment) => {
      if (!commentsByPostId[comment.post_id]) {
        commentsByPostId[comment.post_id] = [];
      }
      commentsByPostId[comment.post_id].push(comment);
    });

    // Combine posts and comments
    const response = posts.map((post) => ({
      ...post,
      comments: commentsByPostId[post.id] || [],
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts and comments' });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  console.log('postId', postId);

  try {
    await db.query('BEGIN');

    const deleteCommentsResult = await db.query(
      'DELETE FROM comment WHERE post_id = $1',
      [postId]
    );
    if (deleteCommentsResult.rowCount === 0) {
      throw new Error('No comments found for this post');
    }

    const deletePostResult = await db.query('DELETE FROM post WHERE id = $1', [
      postId,
    ]);
    if (deletePostResult.rowCount === 0) {
      throw new Error('Post not found');
    }

    await db.query('COMMIT');

    res.status(204).send(`post and comments för id: ${postId} deleted`);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// controllers/postController.js

// ... (other functions: getPostData, getCommentsForPost, createPost, createComment, etc.)

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Delete the comment from the database
    const result = await db.query(
      `
      DELETE FROM comment
      WHERE id = $1;
    `,
      [commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, app_user_id } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO post (title, content, app_user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [title, content, app_user_id]
    );

    const newPost = result.rows[0];

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.createComment = async (req, res) => {
  const { content, app_user_id, post_id } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO comment (content, app_user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [content, app_user_id, post_id]
    );

    const newComment = result.rows[0];

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};