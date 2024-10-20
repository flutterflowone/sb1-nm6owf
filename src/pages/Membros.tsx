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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

const Membros = () => {
  const [membros, setMembros] = useState([]);
  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    instagram: '',
    casado: false,
    filhos: false,
    batizado: false,
    conjuge: '',
    filhos_nome: '',
    batismo_idade: '',
    data_nascimento: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('rnvv_membros')
      .select('*')
      .eq('igreja_ref', user.id)
      .order('nome');

    if (error) {
      toast({
        title: "Erro ao carregar membros",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMembros(data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoMembro({
      ...novoMembro,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('rnvv_membros')
      .insert({
        ...novoMembro,
        igreja_ref: user.id,
      });

    if (error) {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Membro adicionado com sucesso",
        variant: "default",
      });
      fetchMembros();
      setNovoMembro({
        nome: '',
        endereco: '',
        telefone: '',
        email: '',
        instagram: '',
        casado: false,
        filhos: false,
        batizado: false,
        conjuge: '',
        filhos_nome: '',
        batismo_idade: '',
        data_nascimento: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Membros</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Membro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="nome"
                placeholder="Nome"
                value={novoMembro.nome}
                onChange={handleInputChange}
              />
              <Input
                name="endereco"
                placeholder="Endereço"
                value={novoMembro.endereco}
                onChange={handleInputChange}
              />
              <Input
                name="telefone"
                placeholder="Telefone"
                value={novoMembro.telefone}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={novoMembro.email}
                onChange={handleInputChange}
              />
              <Input
                name="instagram"
                placeholder="Instagram"
                value={novoMembro.instagram}
                onChange={handleInputChange}
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="casado"
                    name="casado"
                    checked={novoMembro.casado}
                    onCheckedChange={(checked) => setNovoMembro({ ...novoMembro, casado: checked })}
                  />
                  <Label htmlFor="casado">Casado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filhos"
                    name="filhos"
                    checked={novoMembro.filhos}
                    onCheckedChange={(checked) => setNovoMembro({ ...novoMembro, filhos: checked })}
                  />
                  <Label htmlFor="filhos">Filhos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batizado"
                    name="batizado"
                    checked={novoMembro.batizado}
                    onCheckedChange={(checked) => setNovoMembro({ ...novoMembro, batizado: checked })}
                  />
                  <Label htmlFor="batizado">Batizado</Label>
                </div>
              </div>
              <Input
                name="conjuge"
                placeholder="Nome do Cônjuge"
                value={novoMembro.conjuge}
                onChange={handleInputChange}
              />
              <Input
                name="filhos_nome"
                placeholder="Nome dos Filhos"
                value={novoMembro.filhos_nome}
                onChange={handleInputChange}
              />
              <Input
                name="batismo_idade"
                placeholder="Idade de Batismo"
                value={novoMembro.batismo_idade}
                onChange={handleInputChange}
              />
              <Input
                name="data_nascimento"
                type="date"
                value={novoMembro.data_nascimento}
                onChange={handleInputChange}
              />
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Casado</TableHead>
            <TableHead>Filhos</TableHead>
            <TableHead>Batizado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membros.map((membro) => (
            <TableRow key={membro.id}>
              <TableCell>{membro.nome}</TableCell>
              <TableCell>{membro.telefone}</TableCell>
              <TableCell>{membro.email}</TableCell>
              <TableCell>{membro.casado ? 'Sim' : 'Não'}</TableCell>
              <TableCell>{membro.filhos ? 'Sim' : 'Não'}</TableCell>
              <TableCell>{membro.batizado ? 'Sim' : 'Não'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Membros;