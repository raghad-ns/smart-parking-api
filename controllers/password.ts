const checkPasswordLength = (password:string) => {
    const minimumLength = 8;
    if (password.length < minimumLength) {
        return false;
    }
    return true;
}

const checkPasswordLowerCase = (password:string) => {
    const lowerCase = /[a-z]/;
    if (!lowerCase.test(password)) {
        return false;
    }
    return true;
}

const checkPasswordUpperCase = (password:string) => {
    const upperCase = /[A-Z]/;
    if (!upperCase.test(password)) {
        return false;
    }
    return true;
}

const checkPasswordNumeric = (password:string) => {
    const numeric = /[0-9]/;
    if (!numeric.test(password)) {
        return false;
    }
    return true;
}

const checkPasswordSpecialChar = (password:string) => {
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialChar.test(password)) {
        return false;
    }
    return true;
}

const checkPasswordStrength = (password:string) => {
    if (!checkPasswordLength(password)) {
        return "Password length must be at least 8 characters";
    }
    if (!checkPasswordLowerCase(password)) {
        return "Password must contain at least one lowercase letter";
    }
    if (!checkPasswordUpperCase(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!checkPasswordNumeric(password)) {
        return "Password must contain at least one numeric character";
    }
    if (!checkPasswordSpecialChar(password)) {
        return "Password must contain at least one special character";
    }
    return true;
};

const passwordMatched = (pass: string, confirm: string) => {
    if (pass.length !== confirm.length) {
      return "Unmatched Passwords";
    } else if (pass.length > pass.replace(/\s/g, "").length) {
      return "Space in the Password";
    } else {
      for (let i = 0; i < pass.length; i++) {
        if (pass[i] !== confirm[i]) return "Unmatched passwords";
      }
      const passwordStatus = checkPasswordStrength(pass);
      if (passwordStatus === true) return true;
      else return passwordStatus;
    }
  };


export {checkPasswordStrength, passwordMatched};