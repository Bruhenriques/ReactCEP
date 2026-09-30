import { useState } from "react";
import "./App.css";

function App() {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");

    setEndereco(null);
    setErro("");

    if (cepLimpo.length !== 8) {
      setErro("Digite um CEP com 8 números.");
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error("Falha na consulta");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErro("CEP não encontrado.");
      } else {
        setEndereco(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar CEP:", erro);
      setErro("Não foi possível consultar o CEP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Buscar CEP</h1>

      <input
        type="text"
        placeholder="Digite o CEP"
        value={cep}
        onChange={(evento) => setCep(evento.target.value)}
        maxLength={9}
      />

      <button onClick={buscarCep} disabled={loading}>
        Buscar CEP
      </button>

      {loading && <p>Carregando...</p>}

      {erro && <p>{erro}</p>}

      {endereco && !loading && (
        <div>
          <p>CEP: {endereco.cep}</p>
          <p>Rua: {endereco.logradouro}</p>
          <p>Bairro: {endereco.bairro}</p>
          <p>Cidade: {endereco.localidade}</p>
          <p>Estado: {endereco.uf}</p>
        </div>
      )}
    </main>
  );
}

export default App;