import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({
    tipo: 'entrada',
    descricao: '',
    valor: '',
    data: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTransacoes();
  }, []);

  const fetchTransacoes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('rnvv_financeiro')
      .select('*')
      .eq('igreja_ref', user.id)
      .order('data', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransacoes(data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaTransacao({ ...novaTransacao, [name]: value });
  };

  const handleTipoChange = (value) => {
    setNovaTransacao({ ...novaTransacao, tipo: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('rnvv_financeiro')
      .insert({
        ...novaTransacao,
        valor: parseFloat(novaTransacao.valor),
        igreja_ref: user.id,
      });

    if (error) {
      toast({
        title: "Erro ao adicionar transação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Transação adicionada com sucesso",
        variant: "default",
      });
      fetchTransacoes();
      setNovaTransacao({
        tipo: 'entrada',
        descricao: '',
        valor: '',
        data: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financeiro</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Adicionar Transação</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select onValueChange={handleTipoChange} value={novaTransacao.tipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saída">Saída</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="descricao"
              placeholder="Descrição"
              value={novaTransacao.descricao}
              onChange={handleInputChange}
            />
            <Input
              name="valor"
              type="number"
              step="0.01"
              placeholder="Valor"
              value={novaTransacao.valor}
              onChange={handleInputChange}
            />
            <Input
              name="data"
              type="date"
              value={novaTransacao.data}
              onChange={handleInputChange}
            />
            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transacoes.map((transacao) => (
            <TableRow key={transacao.id}>
              <TableCell>{new Date(transacao.data).toLocaleDateString()}</TableCell>
              <TableCell>{transacao.tipo}</TableCell>
              <TableCell>{transacao.descricao}</TableCell>
              <TableCell>R$ {transacao.valor.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Financeiro;