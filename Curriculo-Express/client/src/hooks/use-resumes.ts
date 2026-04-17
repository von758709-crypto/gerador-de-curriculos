import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertResume, type ResumeData } from "@shared/schema";

export function useResumes() {
  return useQuery({
    queryKey: ['/api/resumes'],
    // In a real app this would list all, for now it's just a placeholder as we focus on the generator
    queryFn: async () => {
      return []; 
    }
  });
}

export function useResume(id: number) {
  return useQuery({
    queryKey: [api.resumes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.resumes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch resume');
      return api.resumes.get.responses[200].parse(await res.json());
    },
    enabled: !!id
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertResume) => {
      const res = await fetch(api.resumes.create.path, {
        method: api.resumes.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.resumes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create resume');
      }
      return api.resumes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/resumes'] }),
  });
}
