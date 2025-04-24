
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSorteioByCodigo } from '../../../utils/getSorteioByCodigo';
import { getCartelasPorCodigo } from '../../../utils/getCartelasPorCodigo';
import { sortearBolasAutomaticamente } from '../../../utils/sortearBolasAutomaticamente';
import PainelControle from '../../../components/PainelControle';
import CartelasPremiadas from '../../../components/CartelasPremiadas';
import RankingCartelas from '../../../components/RankingCartelas';
import HistoricoBolas from '../../../components/HistoricoBolas';

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;

  const [sorteio, setSorteio] = useState(null);
  const [cartelas, setCartelas] = useState([]);
  const [delay, setDelay] = useState(2000);
  const [emAndamento, setEmAndamento] = useState(false);
  const [reiniciar, setReiniciar] = useState(false);

  useEffect(() => {
    if (codigo) {
      carregarDados();
    }
  }, [codigo]);

  const carregarDados = async () => {
    const dadosSorteio = await getSorteioByCodigo(codigo);
    const dadosCartelas = await getCartelasPorCodigo(codigo);
    setSorteio(dadosSorteio);
    setCartelas(dadosCartelas);
  };

  const iniciarSorteio = () => {
    if (sorteio) {
      setEmAndamento(true);
      sortearBolasAutomaticamente(sorteio, delay, () => {
        setEmAndamento(false);
      });
    }
  };

  const handleReiniciar = () => {
    setReiniciar(true);
    setTimeout(() => setReiniciar(false), 100);
  };

  return (
    <div className="simulador-delay">
      <h1>Simulador com Delay - Código: {codigo}</h1>

      <PainelControle
        delay={delay}
        setDelay={setDelay}
        onIniciar={iniciarSorteio}
        onReiniciar={handleReiniciar}
        emAndamento={emAndamento}
      />

      {sorteio && cartelas.length > 0 && !reiniciar && (
        <>
          <HistoricoBolas codigo={codigo} />
          <RankingCartelas codigo={codigo} />
          <CartelasPremiadas codigo={codigo} />
        </>
      )}
    </div>
  );
}
