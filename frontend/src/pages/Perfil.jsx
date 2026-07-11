import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import DefaultInput from "../components/DefaultInput";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { authService } from "../services/authService";
import { chatService } from "../services/chatService";

export default function Perfil() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const dados = JSON.parse(localStorage.getItem("dadosDeSessao") || "{}");

  const salvar = async () => {
    if (!senhaAntiga || !senhaNova || !repetirSenha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (senhaNova !== repetirSenha) {
      setErro("Senhas nao conferem");
      return;
    }

    setLoading(true);
    setErro("");
    setSucesso("");

    const res = await authService.alterarSenha(senhaAntiga, senhaNova);

    if (res.status === "SUCESSO") {
      setSucesso("Senha alterada com sucesso!");
      setSenhaAntiga("");
      setSenhaNova("");
      setRepetirSenha("");
    } else {
      setErro(res.mensagem || "Erro ao alterar senha");
    }

    setLoading(false);
  };

  const limparChat = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar todo o historico de conversas? Esta acao nao pode ser desfeita."
    );
    if (!confirmar) return;

    const res = await chatService.limparHistorico();
    if (res.status === "SUCESSO") {
      alert("Historico de conversas apagado com sucesso!");
    } else {
      alert("Erro ao apagar historico.");
    }
  };

  const apagarTodosDados = async () => {
    const confirmar1 = window.confirm(
      "ATENCAO: Isso ira apagar TODOS os seus dados: trilhas, aulas, conversas, avaliacoes e progresso. Esta acao nao pode ser desfeita!"
    );
    if (!confirmar1) return;

    const confirmar2 = window.confirm(
      "Tem ABSOLUTA certeza? Todos os seus dados serao permanentemente excluidos."
    );
    if (!confirmar2) return;

    const res = await authService.apagarDados();
    if (res.status === "SUCESSO") {
      alert("Todos os dados foram excluidos com sucesso!");
      navigate("/inicio");
    } else {
      alert("Erro ao apagar dados.");
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2
            className="font-poppins-bold text-lg pb-4"
            style={{ color: colors.blue, borderBottom: `1px solid ${colors.border}` }}
          >
            ‹ Meu Perfil
          </h2>

          <div className="flex items-center gap-4 py-6">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-poppins-bold text-xl"
                style={{ backgroundColor: colors["light-grey"], color: colors.grey }}
              >
                {dados.nome ? dados.nome.charAt(0).toUpperCase() : "U"}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.blue }}
              >
                <span className="text-white text-xs">✎</span>
              </div>
            </div>
            <p className="font-poppins text-sm" style={{ color: colors.grey }}>
              {dados.email || "email@exemplo.com"}
            </p>
          </div>

          <div style={{ borderBottom: `1px solid ${colors.border}` }} />

          {erro && (
            <p className="font-poppins text-sm text-red-500 mt-4">{erro}</p>
          )}
          {sucesso && (
            <p className="font-poppins text-sm text-green-600 mt-4">{sucesso}</p>
          )}

          <div className="pt-6">
            <h3 className="font-poppins-bold text-base pb-4" style={{ color: colors.blue }}>
              Editar Senha
            </h3>

            <DefaultInput
              label="Senha antiga"
              placeholder="Digite sua senha atual"
              value={senhaAntiga}
              onChangeText={setSenhaAntiga}
              secureTextEntry={true}
            />

            <div className="mt-4">
              <DefaultInput
                label="Senha nova"
                placeholder="Digite a nova senha"
                value={senhaNova}
                onChangeText={setSenhaNova}
                secureTextEntry={true}
              />
            </div>

            <div className="mt-4">
              <DefaultInput
                label="Repetir senha"
                placeholder="Repita a nova senha"
                value={repetirSenha}
                onChangeText={setRepetirSenha}
                secureTextEntry={true}
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer"
                style={{
                  border: `1px solid ${colors.blue}`,
                  color: colors.blue,
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  setSenhaAntiga("");
                  setSenhaNova("");
                  setRepetirSenha("");
                  setErro("");
                  setSucesso("");
                }}
              >
                Cancelar
              </button>
              <button
                className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
                style={{ backgroundColor: colors.orange, color: "white" }}
                onClick={salvar}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          <div className="mt-8" style={{ borderBottom: `1px solid ${colors.border}` }} />

          <div className="pt-6">
            <h3 className="font-poppins-bold text-base pb-2" style={{ color: colors.blue }}>
              Gerenciar Dados
            </h3>
            <p className="font-poppins text-sm mb-4" style={{ color: colors.grey }}>
              Exclua seus dados permanentemente. Esta acao nao pode ser desfeita.
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="py-2 px-4 rounded-lg font-poppins-bold text-sm cursor-pointer text-left"
                style={{
                  border: `1px solid #dc2626`,
                  color: "#dc2626",
                  backgroundColor: "transparent",
                }}
                onClick={limparChat}
              >
                Apagar todas as conversas do chat
              </button>

              <button
                className="py-2 px-4 rounded-lg font-poppins-bold text-sm cursor-pointer border-none text-left"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                }}
                onClick={apagarTodosDados}
              >
                Apagar todos os dados do app
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
