// Validation utilities for Supabase data

export const validateProfileUpdate = (data: any) => {
  const errors: string[] = [];
  const cleanData: any = {};

  // Validate nickname
  if (data.preferred_nickname) {
    if (typeof data.preferred_nickname !== 'string') {
      errors.push('Nickname must be a string');
    } else if (data.preferred_nickname.length > 50) {
      errors.push('Nickname must be less than 50 characters');
    } else {
      cleanData.preferred_nickname = data.preferred_nickname.trim();
    }
  }

  // Validate avatar emoji
  if (data.avatar_emoji) {
    if (typeof data.avatar_emoji !== 'string') {
      errors.push('Avatar emoji must be a string');
    } else if (data.avatar_emoji.length > 10) {
      errors.push('Avatar emoji must be less than 10 characters');
    } else {
      cleanData.avatar_emoji = data.avatar_emoji;
    }
  }

  // Validate onboarding goals
  if (data.onboarding_goals) {
    if (!Array.isArray(data.onboarding_goals)) {
      errors.push('Onboarding goals must be an array');
    } else if (data.onboarding_goals.length > 10) {
      errors.push('Maximum 10 goals allowed');
    } else {
      // Validate each goal
      const validGoals = data.onboarding_goals.filter((goal: any) => {
        return typeof goal === 'string' && goal.length > 0 && goal.length <= 100;
      });
      cleanData.onboarding_goals = validGoals;
    }
  }

  // Validate boolean fields
  if (data.onboarding_completed !== undefined) {
    cleanData.onboarding_completed = Boolean(data.onboarding_completed);
  }

  // Validate timestamp
  if (data.onboarding_completed_at) {
    const date = new Date(data.onboarding_completed_at);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else {
      cleanData.onboarding_completed_at = date.toISOString();
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData
  };
};

export const validatePostData = (data: any) => {
  const errors: string[] = [];
  const cleanData: any = {};

  // Validate caption
  if (!data.caption || typeof data.caption !== 'string') {
    errors.push('Caption is required and must be a string');
  } else if (data.caption.length > 1000) {
    errors.push('Caption must be less than 1000 characters');
  } else {
    cleanData.caption = data.caption.trim();
  }

  // Validate category
  const validCategories = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push('Category must be one of: ' + validCategories.join(', '));
  } else {
    cleanData.category = data.category;
  }

  // Validate image URL (optional)
  if (data.image_url) {
    if (typeof data.image_url !== 'string') {
      errors.push('Image URL must be a string');
    } else {
      try {
        new URL(data.image_url);
        cleanData.image_url = data.image_url;
      } catch {
        errors.push('Invalid image URL format');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData
  };
};