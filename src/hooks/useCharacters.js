import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCharacters = (userId) => {
  return useQuery({
    queryKey: ['characters', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (characterData) => {
      const { data, error } = await supabase
        .from('characters')
        .insert([characterData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['characters', variables.user_id]);
    }
  });
};