import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useImproveText() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      if (!text || text.trim().length === 0) {
        throw new Error("Texto vazio");
      }

      const response = await fetch("/api/improve-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao melhorar texto");
      }

      const data = await response.json();
      return data.text;
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível melhorar o texto",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
