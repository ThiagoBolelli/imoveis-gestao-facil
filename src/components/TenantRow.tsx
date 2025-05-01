
import { useState } from 'react';
import { KeyRound, Check, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from '@/lib/utils';
import { Payment, Property } from '@/services/googleSheetsService';

interface TenantRowProps {
  tenant: {
    id: string;
    name: string;
    dueDate: number;
    propertyId: string;
    monthlyRent: number;
  };
  property: Property | undefined;
  payments: Payment[];
  onMarkAsPaid: (paymentId: string) => void;
  onRemoveTenant?: (tenantId: string) => void;
}

const TenantRow = ({ tenant, property, payments, onMarkAsPaid, onRemoveTenant }: TenantRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const currentMonthPayment = payments.find(
    payment => 
      payment.tenantId === tenant.id && 
      payment.month.includes(getCurrentMonth())
  );
  
  const isPaid = currentMonthPayment?.status === 'Pago';

  function getCurrentMonth() {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 
      'Maio', 'Junho', 'Julho', 'Agosto', 
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const date = new Date();
    return months[date.getMonth()];
  }
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="mb-3 md:mb-0">
          <div className="flex items-center space-x-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <h3 className="font-medium">{tenant.name}</h3>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            Vencimento dia {tenant.dueDate}
          </p>
        </div>
        
        <div className="flex flex-col md:items-end">
          <p className="text-sm">
            {property?.address || "Endereço não encontrado"}
          </p>
          
          <div className="flex items-center mt-2">
            <span className="font-semibold mr-4">
              {formatCurrency(tenant.monthlyRent)}
            </span>
            
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isPaid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isPaid ? 'Pago' : 'Não Pago'}
            </span>
            
            {onRemoveTenant && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Finalizar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finalizar Contrato</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja finalizar o contrato com este inquilino? 
                      Esta ação marcará o imóvel como disponível para aluguel novamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveTenant(tenant.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Finalizar Contrato
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Histórico de Pagamentos</DialogTitle>
            <DialogDescription>
              Inquilino: {tenant.name} | Imóvel: {property?.address}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {payments
              .filter(payment => payment.tenantId === tenant.id)
              .map(payment => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">{payment.month}</p>
                      <p className="text-sm text-gray-500">
                        {payment.status === 'Pago' && payment.paymentDate && 
                          `Pago em: ${new Date(payment.paymentDate).toLocaleDateString('pt-BR')}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">
                      {formatCurrency(payment.amount)}
                    </span>
                    
                    {payment.status === 'Pago' ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Pago
                      </span>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsPaid(payment.id);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como Pago
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
          
          {onRemoveTenant && (
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="h-4 w-4 mr-2" />
                    Finalizar Contrato
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finalizar Contrato</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja finalizar o contrato com este inquilino? 
                      Esta ação marcará o imóvel como disponível para aluguel novamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (onRemoveTenant) {
                          onRemoveTenant(tenant.id);
                          setIsModalOpen(false);
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Finalizar Contrato
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TenantRow;
