import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import DefaultInput from "../components/DefaultInput";
import ErrorMessage from "../components/ErrorMessage";
import { userService } from "../services/User.service";
import { errorMessages } from "../constants/errorMessages";

export default function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenIsVisible, setScreenIsVisible] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tipoExitAnimation, setTipoExitAnimation] = useState("normal");

  useEffect(() => {
    setLoading(true);
    const verificarSessao = async () => {
      const response = await userService.validarSessao();
      if (response.status == "AUTORIZADO") {
        setLoading(false);
        navigate("/inicio");
      }
      setLoading(false);
    };
    verificarSessao();
  }, []);

  const fazerLogin = async () => {
    if (!email || !senha) {
      return mostrarErro("Preencha os campos corretamente");
    }

    const user = { email, senha };
    const response = await userService.logarUsuario(user);

    if (response.status == "ERRO") {
      switch (response.tipo) {
        case "NAO_ENCONTRADO":
          return mostrarErro(errorMessages.userNotFound);
        case "INVALIDO":
          return mostrarErro(errorMessages.invalidData);
      }
    } else if (response.status == "SUCESSO") {
      localStorage.setItem("token", response.token);
      localStorage.setItem("dadosDeSessao", JSON.stringify(response.dadosDeSessao));
      setTipoExitAnimation("login");
      setScreenIsVisible(false);
      setTimeout(() => {
        navigate("/inicio");
      }, 1050);
    }
  };

  const mostrarErro = (mensagem) => {
    setErrorMessage(mensagem);
    setShowError(true);
  };

  const ocultarErro = () => {
    setShowError(false);
  };

  const exitAnimation =
    tipoExitAnimation == "normal"
      ? { opacity: 0, scale: 0.8, x: -1000 }
      : { opacity: 0, scale: 5 };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: colors.page }}>
      <AnimatePresence mode="wait">
        {screenIsVisible && (
          <motion.div
            key="login"
            className="flex flex-col items-center flex-1"
            initial={{ opacity: 0, scale: 0.8, x: -1000 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={exitAnimation}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-center mt-20 relative">
              {showError && (
                <ErrorMessage
                  timeout={3000}
                  message={errorMessage}
                  color={colors.grey}
                  ocultarErro={ocultarErro}
                />
              )}
              <img
                src="/assets/logo_mentor_ai.png"
                alt="Logo Mentor IA"
                className="w-[269px] h-[78px]"
              />
              <p
                className="font-poppins-bold text-lg mt-2"
                style={{ color: colors.blue }}
              >
                Faca seu login para entrar na plataforma
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 mt-[50px]">
              <DefaultInput
                label="E-mail:"
                placeholder="Digite aqui seu e-mail"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <DefaultInput
                label="Senha:"
                placeholder="Digite aqui sua senha"
                value={senha}
                onChangeText={(text) => setSenha(text)}
                secureTextEntry={true}
              />
            </div>

            <div className="flex flex-col items-center mt-20">
              <button
                className="w-[250px] h-[38px] rounded-lg border-none cursor-pointer font-poppins-bold text-base"
                style={{ backgroundColor: colors.orange, color: "white" }}
                onClick={fazerLogin}
              >
                Entrar
              </button>
              <button
                className="bg-transparent border-none cursor-pointer mt-[15px] font-poppins-bold"
                style={{ color: colors.blue }}
                onClick={() => {
                  setScreenIsVisible(false);
                  setTimeout(() => navigate("/cadastro"), 1000);
                }}
              >
                Criar conta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
