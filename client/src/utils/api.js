import { supabase } from '../lib/supabaseClient';

// Auth API - Now handled by Supabase Auth
export const authAPI = {
  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
        },
      },
    });
    if (error) throw error;
    return { data };
  },
  
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return { data };
  },
  
  getMe: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: user };
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

// Prompts API - Using Supabase Database
export const promptsAPI = {
  getAll: async (params = {}) => {
    let query = supabase
      .from('prompts')
      .select('*', { count: 'exact' });

    // Search functionality
    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,prompt.ilike.%${params.q}%,tags.cs.{${params.q}}`);
    }

    // Filter by tag
    if (params.tag) {
      query = query.contains('tags', [params.tag]);
    }

    // Filter by category
    if (params.category) {
      query = query.eq('category', params.category);
    }

    // Sorting
    if (params.sortBy === 'likes') {
      query = query.order('likes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    
    console.log('Supabase query result:', { data, error, count });
    
    if (error) throw error;

    return {
      data: {
        prompts: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    };
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data };
  },

  create: async (promptData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          ...promptData,
          user_id: user.id,
          author: user.user_metadata?.username || user.email,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  update: async (id, promptData) => {
    const { data, error } = await supabase
      .from('prompts')
      .update(promptData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: { message: 'Prompt deleted successfully' } };
  },

  like: async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current prompt
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('likes, liked_by')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const likedBy = prompt.liked_by || [];
    const hasLiked = likedBy.includes(user.id);

    let newLikes;
    let newLikedBy;

    if (hasLiked) {
      // Unlike
      newLikes = Math.max(0, prompt.likes - 1);
      newLikedBy = likedBy.filter((uid) => uid !== user.id);
    } else {
      // Like
      newLikes = prompt.likes + 1;
      newLikedBy = [...likedBy, user.id];
    }

    const { data, error } = await supabase
      .from('prompts')
      .update({ likes: newLikes, liked_by: newLikedBy })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: { likes: newLikes, isLiked: !hasLiked } };
  },

  getAvailableCategories: async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))].sort();
    return { data: categories };
  },
};
