import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [totalMembros, setTotalMembros] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [ultimosMembros, setUltimosMembros] = useState([]);
  const [dadosFinanceiros, setDadosFinanceiros] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar total de membros
      const { count } = await supabase
        .from('rnvv_membros')
        .select('*', { count: 'exact', head: true })
        .eq('igreja_ref', user.id);
      setTotalMembros(count || 0);

      // Buscar saldo total
      const { data: financeiro } = await supabase
        .from('rnvv_financeiro')
        .select('tipo, valor')
        .eq('igreja_ref', user.id);
      const saldo = financeiro?.reduce((acc, item) => {
        return item.tipo === 'entrada' ? acc + item.valor : acc - item.valor;
      }, 0);
      setSaldoTotal(saldo || 0);

      // Buscar últimos membros adicionados
      const { data: membros } = await supabase
        .from('rnvv_membros')
        .select('nome, data_nascimento')
        .eq('igreja_ref', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setUltimosMembros(membros || []);

      // Buscar dados financeiros para o gráfico
      const { data: dadosGrafico } = await supabase
        .from('rnvv_financeiro')
        .select('tipo, valor, data')
        .eq('igreja_ref', user.id)
        .order('data', { ascending: false })
        .limit(10);
      setDadosFinanceiros(dadosGrafico?.reverse() || []);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{totalMembros}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              R$ {saldoTotal.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Últimos Membros Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ultimosMembros.map((membro: any, index) => (
                <li key={index} className="text-sm">{membro.nome}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Movimentação Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosFinanceiros}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;