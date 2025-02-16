export const validateEmail = (email) => {
    if (!email) return "O e-mail é obrigatório.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? true : "E-mail inválido.";
  };
  
  export const validatePassword = (password) => {
    if (!password) return "A senha é obrigatória.";
    if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
    return true;
  };
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "A confirmação da senha é obrigatória.";
    if (confirmPassword.length < 8) return "A confirmação da senha deve ter no mínimo 8 caracteres.";
    if (confirmPassword !== password) return "As senhas não coincidem.";
    return true;
  };
  
  export const validateFullName = (name) => {
    if (!name) return "O nome completo é obrigatório.";
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return "O nome completo deve conter pelo menos duas palavras.";
    return true;
  };
  

  
  export const maskCPF = (value) => {
    return value
      .replace(/\D/g, "") 
      .slice(0, 11) 
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  export const validateCPF = (cpf) => {
    if (!cpf) return "O CPF é obrigatório.";

    const cleanedCPF = cpf.replace(/\D/g, "");

    if (cleanedCPF.length !== 11) return "CPF deve conter 11 dígitos.";

    const invalidCPFs = [
        "00000000000", "11111111111", "22222222222", "33333333333",
        "44444444444", "55555555555", "66666666666", "77777777777",
        "88888888888", "99999999999"
    ];
    if (invalidCPFs.includes(cleanedCPF)) {
        return "O CPF não é válido.";
    }

    let sum = 0, rest;

    for (let i = 1; i <= 9; i++) sum += parseInt(cleanedCPF[i - 1]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanedCPF[9])) return "O CPF não é válido.";

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanedCPF[i - 1]) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanedCPF[10])) return "O CPF não é válido.";

    return true; 
};
