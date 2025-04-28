
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Payment } from '@/services/googleSheetsService';

// Create a type that matches our database schema for inserts
type PaymentInsert = {
  tenantid: string;
  propertyid: string;
  amount: number;
  duedate: string;
  ispaid: boolean;
  month: number;
  year: number;
  paiddate?: string | null;
};

// Create a type for our frontend Payment format (for mutation)
type PaymentInput = {
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  month: string;
  year: number;
};

export const useSupabasePayments = () => {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*');

      if (error) {
        toast.error('Erro ao carregar pagamentos');
        throw error;
      }

      // Mapear os dados do Supabase para o formato esperado pelo restante da aplicação
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenantid,
        propertyId: item.propertyid,
        amount: item.amount,
        dueDate: item.duedate,
        status: item.ispaid ? 'Pago' : 'Não Pago',
        paymentDate: item.paiddate,
        month: item.month.toString(), // Convert to string to match existing type
        year: item.year
      })) || [];
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ paymentId, status, paymentDate }: { paymentId: string; status: string; paymentDate: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update({
          ispaid: status === 'Pago',
          paiddate: status === 'Pago' ? paymentDate : null
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar status do pagamento');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Status do pagamento atualizado com sucesso!');
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (payment: PaymentInput) => {
      // Convert property names to match the database schema
      const paymentData: PaymentInsert = {
        tenantid: payment.tenantId,
        propertyid: payment.propertyId,
        amount: payment.amount,
        duedate: payment.dueDate,
        ispaid: false,
        month: parseInt(payment.month),
        year: payment.year
      };

      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select('*');

      if (error) {
        toast.error('Erro ao adicionar pagamento');
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pagamento adicionado com sucesso!');
    },
  });

  return {
    payments,
    isLoading,
    updatePaymentStatus: updatePaymentStatusMutation.mutate,
    addPayment: addPaymentMutation.mutate,
  };
};
