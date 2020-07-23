const Validator = require("validator");
const isEmpty = require("../helpers/is-empty");

module.exports = {


  validateSignupInput: function (data) {
    let errors = {};

    data.fullname = !isEmpty(data.fullname) ? data.fullname : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmpassword = !isEmpty(data.confirmpassword) ? data.confirmpassword : "";



    if (data.password !== data.confirmpassword) {
      errors.error = "password and confirmpassword do not match";
    }

    if (Validator.isEmpty(data.confirmpassword)) {
      errors.error = "confirmpassword field  is required";
    }

    if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
      errors.error = "password must be atleast 5 characters";
    }

    if (Validator.isEmpty(data.password)) {
      errors.error = "password field  is required";
    }

    if (Validator.isEmpty(data.username)) {
      errors.error = 'username field is required';
    }

    if (!Validator.isEmail(data.email)) {
      errors.error = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
      errors.error = 'email field is required';
    }


    if (!Validator.isLength(data.fullname, { min: 3, max: 25 })) {
      errors.error = "fullname must be between 2 and 50 characters ";
    }

    if (Validator.isEmpty(data.fullname)) {
      errors.error = "fullname field is required";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },


  validateLoginInput: function (data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';



    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }
    if (Validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = 'Password field  is required';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };

  }

}
// exports = { validateSignupInput, validateLoginInput }