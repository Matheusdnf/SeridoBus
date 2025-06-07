import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Usando Feather icons
import tw from "twrnc"; // Import twrnc
import { TextInputMask } from "react-native-masked-text";

// Funções de validação diretamente no componente:
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\(?[1-9]{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/;
  return phoneRegex.test(phone);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 3;
};

interface GeneralMessage {
  type: "success" | "danger" | "";
  text: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // States de erro
  const [emailError, setEmailError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);

  // States de edição para mostrar ícones após interação
  const [emailEdited, setEmailEdited] = useState<boolean>(false);
  const [nameEdited, setNameEdited] = useState<boolean>(false);
  const [passwordEdited, setPasswordEdited] = useState<boolean>(false);
  const [phoneEdited, setPhoneEdited] = useState<boolean>(false);

  const [generalMessage, setGeneralMessage] = useState<GeneralMessage>({
    type: "",
    text: "",
  });

  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // Handlers de validação que atualizam os erros
  const handleEmailValidation = (inputEmail: string) => {
    const isValid = validateEmail(inputEmail);
    setEmailError(!isValid);
    return isValid;
  };

  const handleNameValidation = (inputName: string) => {
    const isValid = validateName(inputName);
    setNameError(!isValid);
    return isValid;
  };

  const handlePasswordValidation = (inputPassword: string) => {
    const isValid = validatePassword(inputPassword);
    setPasswordError(!isValid);
    return isValid;
  };

  const handlePhoneValidation = (inputPhone: string) => {
    const isValid = validatePhone(inputPhone);
    setPhoneError(!isValid);
    return isValid;
  };

  const handleLogin = (): void => {
    const isEmailValid = handleEmailValidation(email);
    const isPasswordValid = handlePasswordValidation(password);
    const isNameValid = handleNameValidation(name);
    const isPhoneValid = handlePhoneValidation(phone);

    setEmailEdited(true);
    setPasswordEdited(true);
    setNameEdited(true);
    setPhoneEdited(true);

    if (isEmailValid && isPasswordValid && isNameValid && isPhoneValid) {
      console.log("Attempting login with:", { email, password, name, phone });
      setGeneralMessage({ type: "success", text: "Login bem-sucedido!" });
    } else {
      setGeneralMessage({
        type: "danger",
        text: "Por favor, corrija os erros no formulário.",
      });
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-4`}>
      <View
        style={tw`flex-col rounded-xl shadow-lg max-w-2xl w-full bg-white overflow-hidden`}
      >
        <View style={tw`flex-1 p-6 md:p-8 rounded-xl`}>
          <View style={tw`items-center mb-6`}>
            {imageLoadError ? (
              <View
                style={tw`w-32 h-32 mb-2 bg-gray-300 items-center justify-center rounded-lg`}
              >
                <Text style={tw`text-gray-600 text-2xl font-bold`}>Logo</Text>
              </View>
            ) : (
              <Image
                source={require("../../assets/logo/logo.png")}
                style={tw`w-32 h-32 mb-2 object-contain`}
                resizeMode="contain"
                onError={() => setImageLoadError(true)}
              />
            )}
            <Text style={tw`text-2xl font-bold text-center text-gray-800`}>
              Cadastra-se
            </Text>
          </View>

          {generalMessage.text ? (
            <View
              style={tw`p-3 mb-4 rounded ${
                generalMessage.type === "success"
                  ? "bg-green-100 border border-green-400"
                  : "bg-red-100 border border-red-400"
              }`}
            >
              <Text
                style={tw`${
                  generalMessage.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                } font-semibold`}
              >
                {generalMessage.text}
              </Text>
              <TouchableOpacity
                onPress={() => setGeneralMessage({ type: "", text: "" })}
                style={tw`absolute top-2 right-2 p-1`}
              >
                <Text style={tw`text-lg font-bold text-gray-600`}>&times;</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Campo Nome */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Nome
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                nameError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="user" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="Nome"
                keyboardType="default"
                autoCapitalize="words"
                value={name}
                onChangeText={(text: string) => {
                  setName(text);
                  setNameEdited(true);
                  handleNameValidation(text);
                }}
                onBlur={() => handleNameValidation(name)}
              />
              {nameEdited && name.length > 0 && (
                <View style={tw`p-3`}>
                  <Icon
                    name={nameError ? "x-circle" : "check-circle"}
                    size={20}
                    color={
                      nameError ? tw.color("red-500") : tw.color("green-500")
                    }
                  />
                </View>
              )}
            </View>
            {nameError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                Nome inválido. Digite ao menos 3 caracteres.
              </Text>
            ) : null}
          </View>

          {/* Campo Telefone */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Telefone
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                phoneError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="phone" size={20} color="#6B7280" />
              </View>
              <TextInputMask
                type={"cel-phone"}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) ",
                }}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setPhoneEdited(true);
                  handlePhoneValidation(text);
                }}
                onBlur={() => handlePhoneValidation(phone)}
                keyboardType="phone-pad"
                placeholder="Ex: (99) 99999-9999"
                style={tw`flex-1 p-3 text-base text-gray-800`}
              />
              {phoneEdited && phone.length > 0 && (
                <View style={tw`p-3`}>
                  <Icon
                    name={phoneError ? "x-circle" : "check-circle"}
                    size={20}
                    color={
                      phoneError ? tw.color("red-500") : tw.color("green-500")
                    }
                  />
                </View>
              )}
            </View>
            {phoneError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                Telefone inválido.
              </Text>
            ) : null}
          </View>

          {/* Campo Email */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Email
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                emailError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="mail" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  setEmailEdited(true);
                  handleEmailValidation(text);
                }}
                onBlur={() => handleEmailValidation(email)}
              />
              {emailEdited && email.length > 0 && (
                <View style={tw`p-3`}>
                  <Icon
                    name={emailError ? "x-circle" : "check-circle"}
                    size={20}
                    color={
                      emailError ? tw.color("red-500") : tw.color("green-500")
                    }
                  />
                </View>
              )}
            </View>
            {emailError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>Email inválido.</Text>
            ) : null}
          </View>

          {/* Campo Senha */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-base font-medium text-gray-700 mb-1`}>
              Senha
            </Text>
            <View
              style={tw`flex-row items-center border rounded-lg overflow-hidden ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <View style={tw`p-3 bg-gray-100 border-r border-gray-300`}>
                <Icon name="lock" size={20} color="#6B7280" />
              </View>
              <TextInput
                style={tw`flex-1 p-3 text-base text-gray-800`}
                placeholder="Sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  setPasswordEdited(true);
                  handlePasswordValidation(text);
                }}
                onBlur={() => handlePasswordValidation(password)}
              />
              <TouchableOpacity
                style={tw`p-3 bg-gray-100 border-l border-gray-300`}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
              {passwordEdited && password.length > 0 && (
                <View style={tw`p-3`}>
                  <Icon
                    name={passwordError ? "x-circle" : "check-circle"}
                    size={20}
                    color={
                      passwordError
                        ? tw.color("red-500")
                        : tw.color("green-500")
                    }
                  />
                </View>
              )}
            </View>
            {passwordError ? (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                Senha deve ter pelo menos 6 caracteres.
              </Text>
            ) : null}
          </View>

          {/* Botão */}
          <TouchableOpacity
            style={tw`bg-blue-600 py-3 rounded-lg w-full items-center justify-center shadow-md active:bg-blue-700`}
            onPress={handleLogin}
          >
            <Text style={tw`text-white text-lg font-bold`}>Entrar</Text>
          </TouchableOpacity>

          <View style={tw`mt-6 text-center items-center`}>
            <Text style={tw`text-gray-600 mb-3`}>Ainda não tem conta?</Text>
            <TouchableOpacity
              style={tw`border border-blue-500 py-3 rounded-lg w-3/4 items-center justify-center active:bg-blue-50`}
              onPress={() =>
                Alert.alert(
                  "Navegar para Cadastro",
                  "Implementar navegação para a tela de cadastro aqui."
                )
              }
            >
              <Text style={tw`text-blue-600 text-base font-semibold`}>
                Cadastre-se agora
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;
